import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { Dispatch, SetStateAction } from 'react';

export interface UseChatHelpers {
  /** Current messages in the chat */
  messages: Message[];
  
  /** The error object of the API request */
  error: undefined | Error;
  
  /** The current input value */
  input: string;
  
  /** The current chat ID */
  id: string;
  
  /** Whether the API request is in progress */
  isLoading: boolean;
  
  /** The current status of the chat */
  status: 'ready' | 'streaming' | 'submitted';
  
  /** Function to set the input value */
  setInput: (value: string) => void;
  
  /** Function to handle form submission */
  handleSubmit: (e: React.FormEvent<HTMLFormElement> | undefined, options?: ChatRequestOptions) => void;
  
  /** Function to handle input change */
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  
  /** Function to append a message to the chat */
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  
  /** Function to reload the chat */
  reload: () => void;
  
  /** Function to stop the response generation */
  stop: () => void;
  
  /** Function to set the messages */
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export interface UseChatOptions {
  /** The API endpoint that the chat will make requests to */
  api?: string;
  
  /** A unique identifier for the chat */
  id?: string;
  
  /** Initial messages to start the chat with */
  initialMessages?: Message[];
  
  /** Initial input value for the chat */
  initialInput?: string;
  
  /** Callback that will be called when a response is received */
  onResponse?: (response: Response) => void | Promise<void>;
  
  /** Callback that will be called when the chat is finished */
  onFinish?: (message: Message) => void;
  
  /** Callback that will be called when an error occurs */
  onError?: (error: Error) => void;
} 