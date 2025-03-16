import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, rawDb } from './index';

const runMigrate = async () => {
  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  
  // Close the database connection
  await rawDb.close();
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  rawDb.close().finally(() => process.exit(1));
});
