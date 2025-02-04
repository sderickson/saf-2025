import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";
import { dbPath, migrationsPath } from "../drizzle.config.js";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Use in-memory database for tests, file-based database otherwise
const sqlite = process.env.VITEST
  ? new Database(":memory:")
  : new Database(dbPath);

export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: migrationsPath });
