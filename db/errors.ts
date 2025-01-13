export class DatabaseError extends Error {}

export class UnhandledDatabaseError extends DatabaseError {
    constructor() {
        super('Unknown error');
        this.name = 'UnknownDatabaseError';
    }
}

export const handleUnknownError = function (err: Error) {
    // Log, but don't propagate, details about the error. Database errors should
    // be handled within db/queries.
    console.error(err.message);
    console.error(err.stack);
    throw new UnhandledDatabaseError();
}