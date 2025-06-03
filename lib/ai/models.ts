import { createOllama } from 'ollama-ai-provider';
import {
  customProvider,
} from 'ai';

const ollama = createOllama({
  
});

export const DEFAULT_CHAT_MODEL: string = 'mistral:latest';

export const myProvider = customProvider({
  languageModels: {
    'mistral:latest': ollama('mistral:latest'),
    'title-model': ollama('mistral:latest'),
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
    id: 'mistral:latest',
    name: 'mistral',
    description: 'Mistral latest model for fast, lightweight tasks',
  },
];
