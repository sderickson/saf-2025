import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  create,
  getAll,
  getByEmail,
  getById,
  updateLastLogin,
  EmailConflictError,
  UserNotFoundError,
} from "./users.ts";
import { db } from "../instance.ts";
import { users } from "../schema.ts";

describe("users queries", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await db.delete(users);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = {
        email: "test@example.com",
        createdAt: new Date(),
      };

      const result = await create(newUser);

      expect(result).toMatchObject({
        ...newUser,
        id: expect.any(Number),
        createdAt: expect.any(Date),
      });
      expect(result.lastLoginAt).toBeNull();
    });

    it("should throw EmailConflictError for duplicate email", async () => {
      const user = {
        email: "test@example.com",
        createdAt: new Date(),
      };

      await create(user);

      await expect(create(user)).rejects.toThrow(EmailConflictError);
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const testUsers = [
        {
          name: "Test User 1",
          email: "test1@example.com",
          createdAt: new Date(),
        },
        {
          name: "Test User 2",
          email: "test2@example.com",
          createdAt: new Date(),
        },
      ];

      await Promise.all(testUsers.map((user) => create(user)));

      const result = await getAll();
      expect(result).toHaveLength(2);
      expect(result.map((u) => u.email)).toEqual(
        expect.arrayContaining(testUsers.map((u) => u.email)),
      );
    });

    it("should return empty array when no users exist", async () => {
      const result = await getAll();
      expect(result).toEqual([]);
    });
  });

  describe("getByEmail", () => {
    it("should return user by email", async () => {
      const user = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      const created = await create(user);
      const result = await getByEmail(user.email);

      expect(result).toEqual(created);
    });

    it("should throw UserNotFoundError when email not found", async () => {
      await expect(getByEmail("nonexistent@example.com")).rejects.toThrow(
        UserNotFoundError,
      );
    });
  });

  describe("getById", () => {
    it("should return user by id", async () => {
      const user = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      const created = await create(user);
      const result = await getById(created.id);

      expect(result).toEqual(created);
    });

    it("should throw UserNotFoundError when id not found", async () => {
      await expect(getById(999)).rejects.toThrow(UserNotFoundError);
    });
  });

  describe("updateLastLogin", () => {
    it("should update last login timestamp", async () => {
      vi.useFakeTimers();
      const user = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      const created = await create(user);
      const now = new Date();
      vi.setSystemTime(now.setDate(now.getDate() + 1));
      const result = await updateLastLogin(created.id);
      expect(result).toBeDefined();
      expect(result?.lastLoginAt).toBeInstanceOf(Date);
      expect(result?.lastLoginAt?.getTime()).toBeGreaterThan(
        created.createdAt.getTime(),
      );
      vi.useRealTimers();
    });

    it("should throw UserNotFoundError when id not found", async () => {
      await expect(updateLastLogin(999)).rejects.toThrow(UserNotFoundError);
    });
  });
});
