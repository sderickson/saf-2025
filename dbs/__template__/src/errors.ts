// Base error class for database errors
export class TemplateDatabaseError extends Error {
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
