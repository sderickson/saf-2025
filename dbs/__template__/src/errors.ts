import { HandledDatabaseError } from "@saf/drizzle-sqlite3";

// Base error class for database errors.
// All errors should extend this class, so that queryWrapper can rethrow them.
// Rename this class to match the name of this package.
export class TemplateDatabaseError extends HandledDatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "TemplateDatabaseError";
  }
}

// Specific error types should tend to live in the query files that throw them.
