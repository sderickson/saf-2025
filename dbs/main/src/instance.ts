import { drizzle } from "drizzle-orm/bun-sqlite";
import Database from "bun:sqlite";
import * as schema from "./schema.ts";
import { getDbPath, getMigrationsPath } from "../drizzle.config.ts";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

// Use in-memory database for tests, file-based database otherwise
const sqlite = process.env.VITEST
  ? new Database(":memory:")
  : new Database(getDbPath());

export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: getMigrationsPath() });
