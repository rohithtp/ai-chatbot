import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as path from 'path';

const client = createClient({
  url: `file:${path.join(process.cwd(), 'sqlite.db')}`,
});

export const db = drizzle(client);
export const rawDb = client; 