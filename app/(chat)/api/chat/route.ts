import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
  tool,
  jsonSchema,
  ToolExecutionOptions,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const maxDuration = 60;

const mcp_postgres_local_query = tool({
  description: 'Execute a read-only SQL query against the database to get statistics',
  parameters: jsonSchema({
    type: 'object',
    properties: {
      sql: {
        type: 'string',
        description: 'The SQL query to execute'
      },
      type: {
        type: 'string',
        description: 'The type of analytics query being executed',
        enum: ['chat_statistics', 'user_activity', 'message_history', 'vote_analytics', 'chat_visibility']
      }
    },
    required: ['sql', 'type']
  }),
  execute: async (args: unknown, options: ToolExecutionOptions) => {
    console.log('MCP Tool Call - Starting execution with args:', args);
    
    try {
      const { sql: query, type } = args as { sql: string; type: string };
      console.log('MCP Tool Call - Parsed arguments:', { query, type });

      // Basic SQL injection prevention
      if (query.toLowerCase().includes('drop') || 
          query.toLowerCase().includes('delete') || 
          query.toLowerCase().includes('truncate') ||
          query.toLowerCase().includes('alter')) {
        console.log('MCP Tool Call - SQL injection attempt detected:', query);
        throw new Error('Operation not allowed');
      }

      console.log('MCP Tool Call - Executing SQL query:', query);
      // Execute the query using prepared statement
      const result = await db.execute(sql.raw(query));
      console.log('MCP Tool Call - Raw SQL result:', result);
      
      // Transform the first row into the expected format
      const formattedData = result[0] || {};
      console.log('MCP Tool Call - Formatted data:', formattedData);
      
      const response = {
        rows: formattedData,
        type
      };
      console.log('MCP Tool Call - Final response:', response);
      return response;
    } catch (error: unknown) {
      console.error('MCP Tool Call - Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  },
});

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                  'mcp_postgres_local_query'
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
            mcp_postgres_local_query,
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (error) {
                console.error('Failed to save chat:', error);
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('Stream Error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        return 'Oops, an error occurred!';
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
