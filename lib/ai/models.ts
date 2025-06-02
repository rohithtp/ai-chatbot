import { createOllama } from 'ollama-ai-provider';
import {
  customProvider,
} from 'ai';

const ollama = createOllama({
  
});

export const DEFAULT_CHAT_MODEL: string = 'mistral-small:latest';

export const myProvider = customProvider({
  languageModels: {
    'mistral-small:latest': ollama('mistral-small:latest'),
    'title-model': ollama('gemma2:9b'),
  },
  imageModels: {},
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'mistral-small:latest',
    name: 'mistral',
    description: 'mistral small model for fast, lightweight tasks',
  },
];
