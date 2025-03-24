import { db } from "../instance.ts";
import { emailAuth, users } from "../schema.ts";
import { AuthDatabaseError } from "../errors.ts";
import { queryWrapper } from "@saflib/drizzle-sqlite3";
import { eq } from "drizzle-orm";

type NewEmailAuth = typeof emailAuth.$inferInsert;
type SelectEmailAuth = typeof emailAuth.$inferSelect;

export class EmailAuthNotFoundError extends AuthDatabaseError {
  constructor() {
    super("Email authentication not found.");
    this.name = "EmailAuthNotFoundError";
  }
}

export const create = queryWrapper(
  async (auth: NewEmailAuth): Promise<SelectEmailAuth> => {
    const result = await db.insert(emailAuth).values(auth).returning();
    return result[0];
  }
);

export const getByEmail = queryWrapper(
  async (email: string): Promise<SelectEmailAuth | undefined> => {
    const result = await db.query.emailAuth.findFirst({
      where: eq(emailAuth.email, email),
    });
    if (!result) {
      throw new EmailAuthNotFoundError();
    }
    return result;
  }
);

export const updateVerification = queryWrapper(
  async (
    userId: number,
    verificationToken: string | null,
    verificationTokenExpiresAt: Date | null,
    verifiedAt: Date | null
  ): Promise<SelectEmailAuth> => {
    const result = await db
      .update(emailAuth)
      .set({
        verificationToken,
        verificationTokenExpiresAt,
        verifiedAt,
      })
      .where(eq(emailAuth.userId, userId))
      .returning();

    if (!result.length) {
      throw new EmailAuthNotFoundError();
    }
    return result[0];
  }
);

export const updateForgotPasswordToken = queryWrapper(
  async (
    userId: number,
    forgotPasswordToken: string | null,
    forgotPasswordTokenExpiresAt: Date | null
  ): Promise<SelectEmailAuth> => {
    const result = await db
      .update(emailAuth)
      .set({
        forgotPasswordToken,
        forgotPasswordTokenExpiresAt,
      })
      .where(eq(emailAuth.userId, userId))
      .returning();

    if (!result.length) {
      throw new EmailAuthNotFoundError();
    }
    return result[0];
  }
);

export const updatePasswordHash = queryWrapper(
  async (
    userId: number,
    passwordHash: Uint8Array
  ): Promise<SelectEmailAuth> => {
    const result = await db
      .update(emailAuth)
      .set({ passwordHash })
      .where(eq(emailAuth.userId, userId))
      .returning();

    if (!result.length) {
      throw new EmailAuthNotFoundError();
    }
    return result[0];
  }
);

export const deleteAll = queryWrapper(async (): Promise<void> => {
  await db.delete(emailAuth).execute();
});
