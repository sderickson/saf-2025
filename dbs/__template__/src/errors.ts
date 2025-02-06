// Base error class for database errors
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Example of a specific error type
export class ExampleNotFoundError extends DatabaseError {
  constructor(id: number) {
    super(`Example with id ${id} not found`);
    this.name = "ExampleNotFoundError";
  }
}
