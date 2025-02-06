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

// Example of a specific error type
export class ExampleNotFoundError extends TemplateDatabaseError {
  constructor(id: number) {
    super(`Example with id ${id} not found`);
    this.name = "ExampleNotFoundError";
  }
}
