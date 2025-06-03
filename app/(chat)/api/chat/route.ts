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
  console.log('Incoming request body:', JSON.stringify(body, null, 2));
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

  // For non-streaming APIs, send only a text-delta event
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        const externalPayload = { query: userMessage.content };
        console.log('Sending to external service:', JSON.stringify(externalPayload, null, 2));
        const externalResponse = await fetch('http://localhost:8800/users/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(externalPayload),
        });

        const responseText = await externalResponse.text();
        console.log('Raw response from external service:', responseText);
        let answer = responseText;
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.answer) {
            answer = parsed.answer;
          }
        } catch {
          // Not JSON, just use the raw text
        }
        console.log('Sending assistant text-delta with content:', answer);
        dataStream.writeData({ type: 'text-delta', content: answer });
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
    headers: {
      'Transfer-Encoding': 'chunked',
      'Connection': 'keep-alive',
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
