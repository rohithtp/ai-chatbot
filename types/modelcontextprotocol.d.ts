declare module '@modelcontextprotocol/sdk' {
  export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
    name?: string;
    function_call?: any;
    tool_calls?: any[];
    parts?: Array<{
      type: 'text' | 'reasoning' | 'tool-invocation';
      text?: string;
      reasoning?: string;
      toolInvocation?: {
        toolName: string;
        toolCallId: string;
        state: 'call';
        args: any;
      };
    }>;
    experimental_attachments?: Array<{
      type: string;
      content: string;
      url: string;
      name: string;
      metadata?: Record<string, any>;
    }>;
  }

  export interface Attachment {
    type: string;
    content: string;
    url: string;
    name: string;
    metadata?: Record<string, any>;
  }
}

declare module '@modelcontextprotocol/sdk/react' {
  import { Message } from '@modelcontextprotocol/sdk';

  export interface ModelContextOptions {
    modelId: string;
    onError?: (error: Error) => void;
  }

  export interface SendMessageOptions {
    messages: Message[];
    stream?: boolean;
    functions?: any[];
    tools?: any[];
  }

  export interface ModelContext {
    sendMessage: (options: SendMessageOptions) => Promise<AsyncIterable<Message>>;
    stopGeneration: () => void;
  }

  export type Status = 'idle' | 'streaming' | 'submitted';

  export function useModelContext(options: ModelContextOptions): ModelContext & {
    status: Status;
  };

  export interface UIMessage extends Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
    parts: Array<{
      type: 'text' | 'reasoning' | 'tool-invocation';
      text?: string;
      reasoning?: string;
      toolInvocation?: {
        toolName: string;
        toolCallId: string;
        state: 'call';
        args: any;
      };
    }>;
  }
} 