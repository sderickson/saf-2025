import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { usersRouter } from "./users.js";

import * as db from "dbs-auth";
const mockDb: typeof db = {
  ...db,
  users: {
    ...db.users,
    getAll: vi.fn(),
    create: vi.fn(),
  },
};

// Create a basic express app for testing
const app = express();
app.use(express.json());
app.use((req: Request, _res, next) => {
  req.db = mockDb;
  next();
});
app.use("/users", usersRouter);

describe("Users Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: "1", email: "user1@example.com", name: "User 1" },
        { id: "2", email: "user2@example.com", name: "User 2" },
      ];
      (mockDb.users.getAll as Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockDb.users.getAll).toHaveBeenCalledOnce();
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      (mockDb.users.getAll as Mock).mockRejectedValue(error);
      const response = await request(app).get("/users");
      expect(response.status).toBe(500);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const newUser = {
        email: "new@example.com",
        name: "New User",
      };
      const createdUser = {
        id: "3",
        ...newUser,
      };
      (mockDb.users.create as Mock).mockResolvedValue(createdUser);

      const response = await request(app).post("/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
      expect(mockDb.users.create).toHaveBeenCalledWith(newUser);
    });

    it("should return 409 when email already exists", async () => {
      const newUser = {
        email: "existing@example.com",
        name: "New User",
      };
      (mockDb.users.create as Mock).mockRejectedValue(
        new db.users.EmailConflictError()
      );

      const response = await request(app).post("/users").send(newUser);

      expect(response.status).toBe(409);
    });

    it("should handle other database errors", async () => {
      const newUser = {
        email: "new@example.com",
        name: "New User",
      };
      const error = new Error("Database error");
      (mockDb.users.create as Mock).mockRejectedValue(error);

      const response = await request(app).post("/users").send(newUser);

      expect(response.status).toBe(500);
    });
  });
});
