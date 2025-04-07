declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY: string;
    FIREWORKS_API_KEY: string;
    AUTH_SECRET: string;
    DATABASE_URL: string;
    NEXT_PUBLIC_METADATA_BASE_URL: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_SSL: string;
    POSTGRES_MAX_CONNECTIONS: string;
    NEXT_PUBLIC_MCP_ORIGIN: string;
    ENABLE_AI_MESSAGES: string;
  }
} 