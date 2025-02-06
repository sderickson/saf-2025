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

// the db is a singleton for the process.
// db should only be used for tests of this library, and not accessible outside
export const db = drizzle(sqlite, { schema });

// Any pragmas should be set here
sqlite.exec("PRAGMA foreign_keys = ON;");

// Run migrations for both test and production environments
// This template adheres to "Option 4" from https://orm.drizzle.team/docs/migrations
// where the migrations are generated from the schema, checked into the repo, and
// applied to the database during runtime.
migrate(db, { migrationsFolder: getMigrationsPath() });
