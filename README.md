<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI+Chatbot&demo-description=An+Open-Source+AI+Chatbot+Template+Built+With+Next.js+and+the+AI+SDK+by+Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22integrationSlug%22%3A%22upstash%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

## Prerequisites

- **Redis**: Required for resumable streams and chat functionality. Ensure you have a Redis instance running locally and set the `REDIS_URL` environment variable in your `.env` file.
- **Postgres**: For data persistence (see `.env.example`).

## API Usage

### Chat Endpoint

The main chat API expects a POST request with the following JSON body (see `app/(chat)/api/chat/schema.ts`):

```jsonc
{
  "id": "<uuid>",
  "message": {
    "id": "<uuid>",
    "createdAt": "<date>",
    "role": "user",
    "content": "<string>",
    "parts": [
      { "text": "<string>", "type": "text" }
    ],
    "experimental_attachments": [
      { "url": "<url>", "name": "<string>", "contentType": "image/png|image/jpg|image/jpeg" }
    ]
  },
  "selectedChatModel": "chat-model|chat-model-reasoning",
  "selectedVisibilityType": "public|private"
}
```

- `selectedChatModel` can be one of the supported models (see below).
- `selectedVisibilityType` controls chat privacy.

## Supported Models

The following models are available (see `lib/ai/models.ts` and `lib/ai/providers.ts`):

- `chat-model`: Primary model for all-purpose chat (default: OpenAI gpt-4o)
- `chat-model-reasoning`: Model with advanced reasoning (default: OpenAI gpt-4o)
- `title-model`: Used for generating chat titles (default: OpenAI gpt-4o)
- `artifact-model`: Used for document/artifact generation (default: OpenAI gpt-4o)

You can extend or swap providers in `lib/ai/providers.ts`.

## External Chat API Refactor

### Overview
- Message generation logic has been moved to a new local API handler (`app/(chat)/api/chat/external-chat.ts`).
- A feature flag (`USE_EXTERNAL_CHAT_API` in `lib/constants.ts`) controls whether to use the new external API handler or the legacy local logic.
- All tool integrations (getWeather, createDocument, updateDocument, requestSuggestions) have been removed from the message generation logic.

### How it works
- When `USE_EXTERNAL_CHAT_API` is `false` (default):
  - The chat API uses the legacy local message generation logic (no tools).
- When `USE_EXTERNAL_CHAT_API` is `true`:
  - The chat API delegates message generation to the new local handler (`getExternalChatResponse`).
  - This handler can be easily moved to a remote/external API in the future.

### How to switch
- Edit `lib/constants.ts` and set `USE_EXTERNAL_CHAT_API` to `true` to use the new handler.
- Set it to `false` to use the legacy logic.

### Next steps
- To move message generation to a remote/external API, replace the implementation of `getExternalChatResponse` with a `fetch` call to your external service.

## Requirements for External Server API (for Chat Message Generation)

If you want to move message generation to an external server, your external API should:

### 1. Endpoint
- Expose a POST endpoint (e.g., `/api/external-chat`)

### 2. Request Format
- Accept a JSON body with:
  - `messages`: Array of chat messages (with roles, content, etc.)
  - `selectedChatModel`: String (model identifier)
  - `requestHints`: Object (optional, e.g., location info)

Example:
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi! How can I help you?" }
  ],
  "selectedChatModel": "chat-model",
  "requestHints": { "city": "San Francisco" }
}
```

### 3. Response Format
- Should return a streaming response (text/event-stream or chunked JSON/text) with the generated assistant message(s).
- If streaming is not possible, return the full assistant message in the response body.

Example (non-streaming):
```json
{
  "role": "assistant",
  "content": "How can I help you today?"
}
```

### 4. Authentication (Optional)
- If your external API requires authentication, ensure your backend can provide the necessary headers/tokens.

### 5. Error Handling
- Return appropriate HTTP status codes and error messages for invalid requests or server errors.

### 6. Extensibility
- The API should be stateless and not manage chat history or user data. Only generate responses based on the provided input.

---

See the `getExternalChatResponse` function in `app/(chat)/api/chat/external-chat.ts` for the current local implementation and how to adapt it for remote calls.

```bash
pnpm install
pnpm dev
```