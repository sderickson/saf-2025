import * as users from "./src/queries/users.ts";
import { AuthDatabaseError } from "./src/errors.ts";

import session from "express-session";
import sqlite from "better-sqlite3";
import BetterSqlite3SessionStore from "better-sqlite3-session-store";
import path from "path";
const SqliteStore = BetterSqlite3SessionStore(session);
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionDb = new sqlite(path.join(__dirname, "data/sessions.sqlite"));
const sessionStore = new SqliteStore({
  client: sessionDb,
  expired: {
    clear: true,
    intervalMs: 900000, //ms = 15min
  },
});

export { users, AuthDatabaseError, sessionStore };
