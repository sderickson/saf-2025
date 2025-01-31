import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { dbPath, migrationsPath } from "../drizzle.config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Use in-memory SQLite for tests, file-based for production
const sqlite =
  process.env.NODE_ENV === "test"
    ? new Database(":memory:")
    : new Database(dbPath);

export const db = drizzle(sqlite, { schema });

// Run migrations for both test and production environments
migrate(db, { migrationsFolder: migrationsPath });
