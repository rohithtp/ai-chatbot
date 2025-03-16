import { defineConfig } from 'drizzle-kit';
import * as path from 'path';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: path.join(process.cwd(), 'sqlite.db'),
  },
  verbose: true,
  strict: true,
});
