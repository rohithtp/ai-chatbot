# Model Context Protocol (MCP) Integration

The chatbot template now supports the Model Context Protocol (MCP) through the `@modelcontextprotocol/sdk` package. MCP provides a standardized way to handle message interactions, attachments, tool calls, and model context management in your chat application.

## Integrating MCP into Your Project

To integrate MCP into your chat application, follow these steps:

1. Install the required dependencies
2. Configure model providers
3. Update chat components to use MCP
4. Set up database schema for MCP message handling
5. Implement API routes for MCP

### 1. Installing Dependencies

First, install the necessary MCP packages:

```bash
pnpm add @modelcontextprotocol/sdk @ai-sdk/react
```

### 2. Configuring Model Providers

Update your model configuration in `/lib/ai/models.ts` to use MCP-compatible providers:

```typescript
import { customProvider } from "ai";
import { xai } from "@ai-sdk/xai";
import { groq } from "@ai-sdk/groq";

export const myProvider = customProvider({
  languageModels: {
    "chat-model": xai("grok-2-1212"),
    "chat-model-reasoning": wrapLanguageModel({
      model: groq("deepseek-r1-distill-llama-70b"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": xai("grok-2-1212"),
    "artifact-model": xai("grok-2-1212"),
  },
  imageModels: {
    "small-model": xai.image("grok-2-1212"),
  },
});
```

Note: Tool configuration should be specified in your API routes using the `experimental_activeTools` option, not in the provider configuration.

### 3. Updating Chat Components

Update your chat components to use MCP hooks and interfaces. The main changes will be in your Chat component:

```typescript
import { useChat } from '@ai-sdk/react';
import type { Attachment, UIMessage } from 'ai';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
  });
  
  // ... rest of your chat component implementation
}
```

### 4. Setting Up Database Schema

Ensure your database schema supports MCP message structure. Update your message schema in `/lib/db/schema.ts`:

```typescript
export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;
```

### 5. Implementing API Routes

Create or update your chat API route to handle MCP messages:

```typescript
// app/(chat)/api/chat/route.ts
export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: {
    id: string;
    messages: Array<UIMessage>;
    selectedChatModel: string;
  } = await request.json();

  // ... authentication and validation

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools: [
          'getWeather',
          'mcp_postgres_local_query',
          'createDocument',
          'updateDocument',
          'requestSuggestions',
        ],
        experimental_transform: smoothStream({ chunking: 'word' }),
        tools: {
          mcp_postgres_local_query: async ({ sql: query }) => {
            try {
              const result = await sql.query(query);
              return { rows: result.rows };
            } catch (error) {
              return { error: error.message };
            }
          },
        },
      });
      
      return result;
    },
  });
}
```

### Adding Postgres Tool Integration

To add Postgres database querying capabilities as an MCP tool:

```typescript
// app/(chat)/api/chat/route.ts
import { sql } from '@vercel/postgres';

// ... existing imports ...

export async function POST(request: Request) {
  // ... existing code ...

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools: [
          'getWeather',
          'mcp_postgres_local_query',
          'createDocument',
          'updateDocument',
          'requestSuggestions',
        ],
        tools: {
          mcp_postgres_local_query: async ({ sql: query }) => {
            try {
              const result = await sql.query(query);
              return { rows: result.rows };
            } catch (error) {
              return { error: error.message };
            }
          },
        },
      });
      
      return result;
    },
  });
}
```

The Postgres tool can be used in chat messages like this:
```typescript
// Example tool call in chat
<tool>mcp_postgres_local_query</tool>
<args>
{
  "sql": "SELECT * FROM users LIMIT 5"
}
</args>
```

## MCP Features

The Model Context Protocol provides several key features:

1. **Message Handling**:
   - Structured message parts
   - Support for different message types
   - Tool invocations and results

2. **Attachments**:
   - File attachments
   - Metadata handling
   - URL management

3. **Tool Integration**:
   - Standardized tool calls
   - Function invocations
   - Tool state management

4. **Model Context**:
   - Context management
   - Stream handling
   - Error management

## Type Definitions

MCP provides TypeScript definitions for all its interfaces. Key interfaces include:

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
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
  experimental_attachments?: Array<Attachment>;
}

interface Attachment {
  type: string;
  content: string;
  url: string;
  name: string;
  metadata?: Record<string, any>;
}
```

## Best Practices

1. **State Management**:
   - Use cookies for model selection persistence
   - Implement proper error handling
   - Handle streaming states appropriately

2. **Tool Implementation**:
   - Keep tool functions modular
   - Implement proper validation
   - Handle errors gracefully

3. **Message Handling**:
   - Use the parts property for structured content
   - Handle different message types appropriately
   - Implement proper UI rendering for each part type

4. **Performance**:
   - Implement proper streaming
   - Handle large message histories
   - Optimize database queries

## Migration Notes

If you're migrating from a previous version:

1. Update your database schema to support MCP message structure
2. Transform existing messages to use the new format
3. Update your UI components to handle MCP message parts
4. Test thoroughly with different message types and tools

For more details on migrating messages to use parts, refer to the [Migrate to Message Parts](./04-migrate-to-parts.md) guide. 