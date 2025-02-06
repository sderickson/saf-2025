import { describe, it, expect, beforeEach } from "vitest";
import {
  create,
  getByEmail,
  updateVerification,
  updateForgotPasswordToken,
  updatePasswordHash,
  EmailAuthNotFoundError,
} from "./email-auth.ts";
import { create as createUser } from "./users.ts";
import { db } from "../instance.ts";
import { emailAuth, users } from "../schema.ts";

describe("email-auth queries", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await db.delete(emailAuth);
    await db.delete(users);
  });

  describe("create", () => {
    it("should create email auth for a user", async () => {
      const user = await createUser({
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      const passwordHash = Buffer.from([1, 2, 3]);
      const auth = await create({
        userId: user.id,
        email: user.email,
        passwordHash,
      });

      expect(auth).toMatchObject({
        userId: user.id,
        email: user.email,
        passwordHash,
      });
    });
  });

  describe("getByEmail", () => {
    it("should get email auth by email", async () => {
      const user = await createUser({
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      const passwordHash = Buffer.from([1, 2, 3]);
      const created = await create({
        userId: user.id,
        email: user.email,
        passwordHash,
      });

      const auth = await getByEmail(user.email);
      expect(auth).toEqual(created);
    });

    it("should throw EmailAuthNotFoundError when email not found", async () => {
      await expect(getByEmail("nonexistent@example.com")).rejects.toThrow(
        EmailAuthNotFoundError
      );
    });
  });

  describe("updateVerification", () => {
    it("should update verification details", async () => {
      const user = await createUser({
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      const passwordHash = Buffer.from([1, 2, 3]);
      await create({
        userId: user.id,
        email: user.email,
        passwordHash,
      });

      const now = new Date();
      const token = "verification-token";
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expiresAt.setMilliseconds(0);

      const updated = await updateVerification(user.id, token, expiresAt, null);
      expect(updated).toMatchObject({
        verificationToken: token,
        verificationTokenExpiresAt: expiresAt,
        verifiedAt: null,
      });
    });

    it("should throw EmailAuthNotFoundError when user not found", async () => {
      await expect(
        updateVerification(999, "token", new Date(), null)
      ).rejects.toThrow(EmailAuthNotFoundError);
    });
  });

  describe("updateForgotPasswordToken", () => {
    it("should update forgot password token", async () => {
      const user = await createUser({
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      const passwordHash = Buffer.from([1, 2, 3]);
      await create({
        userId: user.id,
        email: user.email,
        passwordHash,
      });

      const now = new Date();
      const token = "forgot-password-token";
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expiresAt.setMilliseconds(0);

      const updated = await updateForgotPasswordToken(
        user.id,
        token,
        expiresAt
      );
      expect(updated).toMatchObject({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiresAt: expiresAt,
      });
    });

    it("should throw EmailAuthNotFoundError when user not found", async () => {
      await expect(
        updateForgotPasswordToken(999, "token", new Date())
      ).rejects.toThrow(EmailAuthNotFoundError);
    });
  });

  describe("updatePasswordHash", () => {
    it("should update password hash", async () => {
      const user = await createUser({
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      });

      const passwordHash = Buffer.from([1, 2, 3]);
      await create({
        userId: user.id,
        email: user.email,
        passwordHash,
      });

      const newPasswordHash = Buffer.from([4, 5, 6]);
      const updated = await updatePasswordHash(user.id, newPasswordHash);
      expect(updated).toMatchObject({
        passwordHash: newPasswordHash,
      });
    });

    it("should throw EmailAuthNotFoundError when user not found", async () => {
      await expect(
        updatePasswordHash(999, Buffer.from([4, 5, 6]))
      ).rejects.toThrow(EmailAuthNotFoundError);
    });
  });
});
