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
import { getUsers } from '@/lib/ai/tools/get-users';

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Incoming request body:', body);
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } = body;

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    console.error('No user message found in messages:', messages);
    return new Response(JSON.stringify({ error: 'No user message found' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Stream the response from the external endpoint
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        const externalPayload = { query: userMessage.content };
        console.log('Sending to external service:', externalPayload);
        const externalResponse = await fetch('http://localhost:8800/users/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(externalPayload),
        });

        const reader = externalResponse.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let buffer = '';
        while (reader && !done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            buffer += chunk;
            console.log('External service chunk:', chunk);
            // Do not stream chunk yet, wait until buffer is complete
          }
        }
        // After streaming, process the buffer
        if (buffer) {
          try {
            const parsed = JSON.parse(buffer);
            if (parsed.answer) {
              console.log('Parsed answer:', parsed.answer);
              const answer = parsed.answer;
              if (answer) {
                for (const line of answer.split('\n')) {
                  console.log('line :', line.trim());
                  dataStream.writeData({ type: 'text-delta', content: `${line.trim()}\n` });
                }
              }
            } else {
              dataStream.writeData({ type: 'text-delta', content: buffer });
            }
          } catch {
            dataStream.writeData({ type: 'text-delta', content: buffer });
          }
        }
        console.log('Full response from external service:', buffer);
        dataStream.writeData({ type: 'text-delta', content: '\n-- Feedback: This response is from the external service --\n' });
        dataStream.writeData({ type: 'finish', content: '' });
      } catch (error: any) {
        console.error('Failed to contact external service', error?.stack || error);
        dataStream.writeData({ type: 'text-delta', content: 'Failed to contact external service.' });
        dataStream.writeData({ type: 'finish', content: '' });
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
