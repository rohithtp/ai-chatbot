import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
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
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  // Save user message first
  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  // Create data stream for response
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Handle MCP metrics first, regardless of AI status
        console.log('Starting chat request processing');
        const response = await fetch(`${process.env.NEXT_PUBLIC_MCP_ORIGIN}/mcp/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'request',
            action: 'execute',
            tool: 'get_metrics',
            data: { question: userMessage.content }
          }),
        });

        if (!response.ok) {
          console.error('MCP metrics call failed:', response.statusText);
        } else {
          console.log('MCP metrics call successful');
        }

        // Check if AI messages are enabled
        const isAIMessagesEnabled = process.env.ENABLE_AI_MESSAGES !== 'false';
        console.log('AI messages enabled:', isAIMessagesEnabled);

        if (!isAIMessagesEnabled) {
          console.log('AI messages disabled, sending warning message');
          const warningMessage = {
            id: generateUUID(),
            role: 'assistant',
            content: '⚠️ AI message generation is currently disabled. Your message has been logged but no AI response will be generated.',
            createdAt: new Date(),
          };
          
          try {
            // Send initial response with user message
            dataStream.write(`2:${JSON.stringify({
              messages: [{
                id: userMessage.id,
                role: userMessage.role,
                content: userMessage.content,
                createdAt: new Date()
              }]
            })}\n`);
            console.log('Sent user message');
            
            // Send warning message
            dataStream.write(`2:${JSON.stringify({
              messages: [{
                id: warningMessage.id,
                role: warningMessage.role,
                content: warningMessage.content,
                createdAt: warningMessage.createdAt
              }]
            })}\n`);
            console.log('Sent warning message');
            
            // Send final response with both messages
            dataStream.write(`3:${JSON.stringify({
              messages: [
                {
                  id: userMessage.id,
                  role: userMessage.role,
                  content: userMessage.content,
                  createdAt: new Date()
                },
                {
                  id: warningMessage.id,
                  role: warningMessage.role,
                  content: warningMessage.content,
                  createdAt: warningMessage.createdAt
                }
              ],
              done: true
            })}\n`);
            console.log('Sent completion response');
            return;
          } catch (streamError) {
            console.error('Error writing to data stream:', streamError);
            throw streamError;
          }
        }

        console.log('Proceeding with AI response');
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
          },
          onFinish: async ({ response, reasoning }) => {
            if (session.user?.id) {
              try {
                const sanitizedResponseMessages = sanitizeResponseMessages({
                  messages: response.messages,
                  reasoning,
                });

                await saveMessages({
                  messages: sanitizedResponseMessages.map((message) => {
                    return {
                      id: message.id,
                      chatId: id,
                      role: message.role,
                      content: message.content,
                      createdAt: new Date(),
                    };
                  }),
                });
              } catch (error) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      } catch (error) {
        console.error('Error in chat stream:', error);
        dataStream.write(`0:${JSON.stringify({ type: 'error', error: 'An error occurred processing your request' })}\n`);
      }
    },
    onError: () => {
      return 'Oops, an error occurred!';
    },
  });
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
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
