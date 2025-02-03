import { db } from "../instance.ts";
import { users } from "../schema.ts";
import { DatabaseError, handleUnknownError } from "../errors.ts";

type NewUser = typeof users.$inferInsert;
type SelectUser = typeof users.$inferSelect;

export class EmailConflictError extends DatabaseError {
  constructor() {
    super("That email is taken.");
    this.name = "EmailConflictError";
  }
}

export const create = async function (user: NewUser): Promise<SelectUser> {
  try {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  } catch (e: unknown) {
    if (e instanceof Error) {
      const message = e.message;
      if (message.includes("UNIQUE constraint failed: users.email")) {
        throw new EmailConflictError();
      }
      handleUnknownError(e as Error);
    }
    throw e;
  }
};

export const getAll = async function (): Promise<SelectUser[]> {
  try {
    return db.query.users.findMany().execute();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};
