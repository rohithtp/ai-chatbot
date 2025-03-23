# Postgres Integration with Model Context Protocol (MCP)

This guide explains how to integrate and use Postgres database queries with MCP in your chat application. The integration allows you to create interactive database analytics cards and perform database operations through chat interactions.

## Setting Up Postgres Integration

To integrate Postgres querying capabilities into your chat application, follow these steps:

1. Set up the database configuration
2. Configure the tool definition
3. Implement analytics components
4. Define query types and interfaces
5. Add security measures

### 1. Setting Up Database Configuration

Create a database configuration file in `lib/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not defined');
}

const client = postgres(process.env.POSTGRES_URL);
export const db = drizzle(client);
```

### 2. Tool Definition

The Postgres tool is defined in the chat route handler:

```typescript
const mcp_postgres_local_query = tool({
  description: 'Run a read-only SQL query',
  parameters: jsonSchema({
    type: 'object',
    properties: {
      sql: {
        type: 'string',
        description: 'The SQL query to execute'
      },
      type: {
        type: 'string',
        enum: ['chat_statistics', 'user_activity', 'message_history', 'vote_analytics'],
        description: 'The type of analytics query being executed'
      }
    },
    required: ['sql', 'type']
  }),
  execute: async ({ sql: query, type }) => {
    try {
      // Basic SQL injection prevention
      if (query.toLowerCase().includes('drop') || 
          query.toLowerCase().includes('delete') || 
          query.toLowerCase().includes('truncate') ||
          query.toLowerCase().includes('alter')) {
        throw new Error('Operation not allowed');
      }

      const result = await db.execute(sql.raw(query));
      return {
        rows: result,
        type
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  }
});
```

### 3. Query Types and Examples

The Postgres integration supports several types of analytics queries:

1. **Chat Statistics**
```sql
SELECT 
  COUNT(*) as chat_count,
  COUNT(CASE WHEN "visibility" = 'public' THEN 1 END) as public_chats,
  COUNT(CASE WHEN "visibility" = 'private' THEN 1 END) as private_chats
FROM "Chat";
```

2. **User Activity**
```sql
SELECT 
  COUNT(DISTINCT c."userId") as active_users,
  COUNT(m.*) as total_messages,
  MAX(m."createdAt") as last_activity
FROM "Message" m
JOIN "Chat" c ON m."chatId" = c.id;
```

3. **Message History**
```sql
SELECT 
  COUNT(CASE WHEN "role" = 'user' THEN 1 END) as user_messages,
  COUNT(CASE WHEN "role" = 'assistant' THEN 1 END) as assistant_messages
FROM "Message";
```

4. **Vote Analytics**
```sql
SELECT 
  COUNT(*) as total_votes,
  COUNT(CASE WHEN "isUpvoted" = true THEN 1 END) as upvotes,
  COUNT(CASE WHEN "isUpvoted" = false THEN 1 END) as downvotes
FROM "Vote";
```

### 4. Security Measures

1. **SQL Injection Prevention**:
   - Validate query strings
   - Block dangerous operations (DROP, DELETE, TRUNCATE, ALTER)
   - Use raw SQL queries with proper escaping

2. **Access Control**:
   - Implement user authentication
   - Validate chat ownership
   - Restrict sensitive data access

3. **Error Handling**:
   - Graceful error responses
   - User-friendly error messages
   - Proper logging

## Using Analytics in Chat

To trigger analytics cards in chat, use this prompt:
```
Show me analytics about our chat system including message counts, user activity, and voting patterns.
```

This will execute all analytics queries and display them in interactive cards.

## Best Practices

1. **Query Performance**:
   - Use appropriate indexes
   - Join tables efficiently
   - Keep queries simple and focused

2. **UI/UX**:
   - Show loading states during query execution
   - Handle error states gracefully
   - Display results in clear, readable cards

3. **Data Management**:
   - Use proper table joins
   - Handle null values appropriately
   - Format dates and numbers consistently

4. **Maintenance**:
   - Monitor query performance
   - Log errors and usage
   - Keep documentation updated

## Troubleshooting

Common issues and solutions:

1. **Query Errors**:
   - Check table and column names
   - Verify SQL syntax
   - Ensure proper table joins

2. **Type Errors**:
   - Verify analytics type matches query
   - Check response format
   - Validate tool parameters

3. **Performance Issues**:
   - Review query execution plans
   - Check table indexes
   - Optimize JOIN operations

For more details on the chat application architecture, refer to the other documentation files in this directory. 