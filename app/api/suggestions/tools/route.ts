import { headers } from 'next/headers';
import { Client } from '@modelcontextprotocol/sdk/client/index';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse';

export const runtime = 'edge';

interface Tool {
  name: string;
  description: string;
  type: string;
  parameters?: Record<string, unknown>;
}

export async function GET() {
  try {
    // Set up SSE headers
    const response = new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const sseUrl = `${process.env.MCP_ORIGIN || "https://mcp-on-vercel.vercel.app"}/sse`;
            console.log('Connecting to SSE endpoint:', sseUrl);
            
            const transport = new SSEClientTransport(new URL(sseUrl));
            
            const client = new Client(
              {
                name: "chat-ui-client",
                version: "1.0.0",
              },
              {
                capabilities: {
                  prompts: {},
                  resources: {},
                  tools: {},
                },
              }
            );

            console.log('Attempting to connect to MCP server...');
            try {
              await client.connect(transport);
              console.log('Successfully connected to MCP server');
            } catch (error: unknown) {
              const connError = error as Error;
              console.error('Failed to connect to MCP server:', {
                error: connError.message,
                stack: connError.stack
              });
              
              // Send empty tools list in case of connection error
              const errorMessage = `data: ${JSON.stringify([])}\n\n`;
              controller.enqueue(new TextEncoder().encode(errorMessage));
              return;
            }

            console.log('Fetching tools from MCP server...');
            let tools: Tool[];
            try {
              const rawTools = await client.listTools();
              console.log('Raw tools response:', rawTools);

              if (!rawTools || typeof rawTools !== 'object') {
                throw new Error('Invalid tools response from server');
              }

              tools = (Array.isArray(rawTools) ? rawTools : []).map(tool => {
                const processedTool = {
                  name: String(tool?.name || ''),
                  description: String(tool?.description || ''),
                  type: String(tool?.type || 'unknown'),
                  parameters: tool?.parameters as Record<string, unknown> || {}
                };
                console.log('Processed tool:', processedTool);
                return processedTool;
              });

              console.log('Final tools array:', tools);

              // Validate the tools array
              if (!tools.every(tool => 
                typeof tool.name === 'string' && 
                typeof tool.description === 'string' && 
                typeof tool.type === 'string'
              )) {
                throw new Error('Invalid tool format in response');
              }

              // Send the tools list as an SSE event
              const sseMessage = `data: ${JSON.stringify(tools)}\n\n`;
              console.log('Sending SSE message:', sseMessage);
              
              controller.enqueue(new TextEncoder().encode(sseMessage));
              console.log('Successfully sent tools data to client');
            } catch (error: unknown) {
              const toolsError = error as Error;
              console.error('Failed to fetch/process tools:', {
                error: toolsError.message,
                stack: toolsError.stack
              });
              
              // Send empty tools list in case of error
              const errorMessage = `data: ${JSON.stringify([])}\n\n`;
              controller.enqueue(new TextEncoder().encode(errorMessage));
            }
          } catch (error: unknown) {
            const err = error as Error;
            console.error('Error in SSE connection/tools fetch:', {
              error: err.message,
              stack: err.stack,
              type: err.constructor.name
            });
            // Send empty tools list in case of error
            const errorMessage = `data: ${JSON.stringify([])}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorMessage));
          } finally {
            // Close the stream after sending the data
            controller.close();
            console.log('Closed SSE stream');
          }
        }
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no'
        },
      }
    );

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in GET handler:', {
      error: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    
    return new Response('Internal Server Error', { status: 500 });
  }
} 