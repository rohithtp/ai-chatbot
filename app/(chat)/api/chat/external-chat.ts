import { streamText, smoothStream } from 'ai';
import { myProvider } from '@/lib/ai/providers';
import { systemPrompt } from '@/lib/ai/prompts';
import { generateUUID } from '@/lib/utils';

export async function getExternalChatResponse({
  messages,
  selectedChatModel,
  requestHints,
}: any) {
  // This function mimics the message generation logic, but can be moved to an external API later
  const result = streamText({
    model: myProvider.languageModel(selectedChatModel),
    system: systemPrompt({ selectedChatModel, requestHints }),
    messages,
    maxSteps: 5,
    experimental_transform: smoothStream({ chunking: 'word' }),
    experimental_generateMessageId: generateUUID,
  });
  result.consumeStream();
  return result;
}
