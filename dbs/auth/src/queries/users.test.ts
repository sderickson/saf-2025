import { describe, it, expect, beforeEach } from "vitest";
import { create, getAll, EmailConflictError } from "./users";
import { db } from "../instance";
import { users } from "../schema";

describe("users queries", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await db.delete(users);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
      };

      const result = await create(newUser);

      expect(result).toMatchObject({
        ...newUser,
        id: expect.any(Number),
      });
    });

    it("should throw EmailConflictError for duplicate email", async () => {
      const user = {
        name: "Test User",
        email: "test@example.com",
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
        },
        {
          name: "Test User 2",
          email: "test2@example.com",
        },
      ];

      await Promise.all(testUsers.map((user) => create(user)));

      const result = await getAll();
      expect(result).toHaveLength(2);
      expect(result.map((u) => u.email)).toEqual(
        expect.arrayContaining(testUsers.map((u) => u.email))
      );
    });

    it("should return empty array when no users exist", async () => {
      const result = await getAll();
      expect(result).toEqual([]);
    });
  });
});
