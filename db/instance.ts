import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { dbPath, migrationsPath } from './drizzle.config';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export const db = drizzle({
    connection: { source: dbPath },
    schema
});

migrate(db, { migrationsFolder: migrationsPath });