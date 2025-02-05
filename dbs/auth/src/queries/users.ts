import { db } from "../instance.ts";
import { users } from "../schema.ts";
import { DatabaseError, handleUnknownError } from "../errors.ts";
import { eq } from "drizzle-orm";

type NewUser = typeof users.$inferInsert;
type SelectUser = typeof users.$inferSelect;

export class EmailConflictError extends DatabaseError {
  constructor() {
    super("That email is taken.");
    this.name = "EmailConflictError";
  }
}

export class UserNotFoundError extends DatabaseError {
  constructor() {
    super("User not found.");
    this.name = "UserNotFoundError";
  }
}

export const create = async function (user: NewUser): Promise<SelectUser> {
  try {
    const now = new Date();
    const result = await db
      .insert(users)
      .values({ ...user, createdAt: now })
      .returning();
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

export const getByEmail = async function (
  email: string
): Promise<SelectUser | undefined> {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};

export const getById = async function (
  id: number
): Promise<SelectUser | undefined> {
  try {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};

export const updateLastLogin = async function (
  id: number
): Promise<SelectUser | undefined> {
  let result: SelectUser[] | undefined;
  try {
    const now = new Date();
    result = await db
      .update(users)
      .set({ lastLoginAt: now })
      .where(eq(users.id, id))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
  if (!result.length) {
    throw new UserNotFoundError();
  }
  return result[0];
};

export const deleteAll = async function (): Promise<void> {
  try {
    await db.delete(users).execute();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};
