import { HandledDatabaseError } from "@saf/drizzle-sqlite3";

export class MainDatabaseError extends HandledDatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "MainDatabaseError";
  }
}
