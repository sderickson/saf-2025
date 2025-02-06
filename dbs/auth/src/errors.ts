import { HandledDatabaseError } from "@saf/drizzle-sqlite3";

export class AuthDatabaseError extends HandledDatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "AuthDatabaseError";
  }
}
