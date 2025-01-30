export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class UnhandledDatabaseError extends DatabaseError {
  constructor(error: unknown) {
    super(`Unhandled database error: ${error}`);
    this.name = "UnhandledDatabaseError";
  }
}
