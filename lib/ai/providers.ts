import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai.responses('gpt-4o'),
        'chat-model-reasoning': openai.responses('gpt-4o'),
        'title-model': openai.responses('gpt-4o'),
        'artifact-model': openai.responses('gpt-4o'),
      },
      imageModels: {
        'small-model': openai.image('gpt-4o-mini'),
      },
    });
