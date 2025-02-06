import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.ts";
import { getDbPath, getMigrationsPath } from "../drizzle.config.ts";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Use in-memory SQLite for tests, file-based for production
const sqlite =
  process.env.NODE_ENV === "test"
    ? new Database(":memory:")
    : new Database(getDbPath());

export const db = drizzle(sqlite, { schema });

sqlite.exec("PRAGMA foreign_keys = ON;");

// Run migrations for both test and production environments
migrate(db, { migrationsFolder: getMigrationsPath() });
