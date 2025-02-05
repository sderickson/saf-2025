import { db } from "../instance.ts";
import { emailAuth, users } from "../schema.ts";
import { DatabaseError, handleUnknownError } from "../errors.ts";
import { eq } from "drizzle-orm";

type NewEmailAuth = typeof emailAuth.$inferInsert;
type SelectEmailAuth = typeof emailAuth.$inferSelect;

export class EmailAuthNotFoundError extends DatabaseError {
  constructor() {
    super("Email authentication not found.");
    this.name = "EmailAuthNotFoundError";
  }
}

export const create = async function (
  auth: NewEmailAuth
): Promise<SelectEmailAuth> {
  try {
    const result = await db.insert(emailAuth).values(auth).returning();
    return result[0];
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};

export const getByEmail = async function (
  email: string
): Promise<SelectEmailAuth | undefined> {
  let result: SelectEmailAuth | undefined;
  try {
    result = await db.query.emailAuth.findFirst({
      where: eq(emailAuth.email, email),
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
  return result;
};

export const updateVerification = async function (
  userId: number,
  verificationToken: string | null,
  verificationTokenExpiresAt: Date | null,
  verifiedAt: Date | null
): Promise<SelectEmailAuth> {
  let result: SelectEmailAuth[] | undefined;
  try {
    result = await db
      .update(emailAuth)
      .set({
        verificationToken,
        verificationTokenExpiresAt,
        verifiedAt,
      })
      .where(eq(emailAuth.userId, userId))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
  if (!result.length) {
    throw new EmailAuthNotFoundError();
  }
  return result[0];
};

export const updateForgotPasswordToken = async function (
  userId: number,
  forgotPasswordToken: string | null,
  forgotPasswordTokenExpiresAt: Date | null
): Promise<SelectEmailAuth> {
  let result: SelectEmailAuth[] | undefined;
  try {
    result = await db
      .update(emailAuth)
      .set({
        forgotPasswordToken,
        forgotPasswordTokenExpiresAt,
      })
      .where(eq(emailAuth.userId, userId))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
  if (!result.length) {
    throw new EmailAuthNotFoundError();
  }
  return result[0];
};

export const updatePasswordHash = async function (
  userId: number,
  passwordHash: Uint8Array
): Promise<SelectEmailAuth> {
  let result: SelectEmailAuth[] | undefined;
  try {
    result = await db
      .update(emailAuth)
      .set({ passwordHash })
      .where(eq(emailAuth.userId, userId))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
  if (!result.length) {
    throw new EmailAuthNotFoundError();
  }
  return result[0];
};

export const deleteAll = async function (): Promise<void> {
  try {
    await db.delete(emailAuth).execute();
  } catch (e: unknown) {
    if (e instanceof Error) {
      handleUnknownError(e);
    }
    throw e;
  }
};
