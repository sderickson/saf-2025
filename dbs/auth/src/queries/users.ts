import { db } from "../instance.ts";
import { users } from "../schema.ts";
import { AuthDatabaseError } from "../errors.ts";
import { queryWrapper } from "@saf/drizzle-sqlite3";
import { eq } from "drizzle-orm";

type NewUser = typeof users.$inferInsert;
type SelectUser = typeof users.$inferSelect;

export class EmailConflictError extends AuthDatabaseError {
  constructor() {
    super("That email is taken.");
    this.name = "EmailConflictError";
  }
}

export class UserNotFoundError extends AuthDatabaseError {
  constructor() {
    super("User not found.");
    this.name = "UserNotFoundError";
  }
}

export const create = queryWrapper(
  async (user: NewUser): Promise<SelectUser> => {
    try {
      const now = new Date();
      const result = await db
        .insert(users)
        .values({ ...user, createdAt: now })
        .returning();
      return result[0];
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        e.message.includes("UNIQUE constraint failed: users.email")
      ) {
        throw new EmailConflictError();
      }
      throw e;
    }
  },
);

export const getAll = queryWrapper(async (): Promise<SelectUser[]> => {
  return db.query.users.findMany().execute();
});

export const getByEmail = queryWrapper(
  async (email: string): Promise<SelectUser | undefined> => {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!result) {
      throw new UserNotFoundError();
    }
    return result;
  },
);

export const getById = queryWrapper(
  async (id: number): Promise<SelectUser | undefined> => {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!result) {
      throw new UserNotFoundError();
    }
    return result;
  },
);

export const updateLastLogin = queryWrapper(
  async (id: number): Promise<SelectUser> => {
    const now = new Date();
    const result = await db
      .update(users)
      .set({ lastLoginAt: now })
      .where(eq(users.id, id))
      .returning();

    if (!result.length) {
      throw new UserNotFoundError();
    }
    return result[0];
  },
);

export const deleteAll = queryWrapper(async (): Promise<void> => {
  await db.delete(users).execute();
});
