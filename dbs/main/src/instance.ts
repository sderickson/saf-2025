import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.ts";
import { getDbPath, getMigrationsPath } from "../drizzle.config.ts";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Use in-memory database for tests, file-based database otherwise
const sqlite = process.env.VITEST
  ? new Database(":memory:")
  : new Database(getDbPath());

export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: getMigrationsPath() });
