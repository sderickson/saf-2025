import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import request from "supertest";
import express from "express";
import session from "express-session";
import passport from "passport";
import { authRouter } from "./auth.js";
import { setupPassport } from "../config/passport.js";
import * as argon2 from "argon2";
import {
  recommendedErrorHandlers,
  recommendedPreMiddleware,
} from "@saf/node-express";

// Import the mocked modules
import { users } from "@saf/dbs-auth";
import * as emailAuth from "@saf/dbs-auth/queries/email-auth";

// Mock the modules
vi.mock("@saf/dbs-auth", () => ({
  users: {
    create: vi.fn(),
    getByEmail: vi.fn(),
    getById: vi.fn(),
    updateLastLogin: vi.fn(),
    EmailConflictError: class EmailConflictError extends Error {
      constructor() {
        super("Email already exists");
        this.name = "EmailConflictError";
      }
    },
  },
}));

vi.mock("@saf/dbs-auth/queries/email-auth", () => ({
  create: vi.fn(),
  getByEmail: vi.fn(),
}));

vi.mock("argon2", () => ({
  hash: vi.fn().mockResolvedValue("hashed-password"),
  verify: vi.fn().mockResolvedValue(true),
}));

setupPassport();

// Create Express app for testing
const app = express();
app.use(recommendedPreMiddleware);
app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use(recommendedErrorHandlers);

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = {
        id: 1,
        email: userData.email,
        createdAt: new Date(),
        lastLoginAt: null,
      };

      (users.create as Mock).mockResolvedValue(createdUser);
      (emailAuth.create as Mock).mockResolvedValue({
        userId: createdUser.id,
        email: createdUser.email,
        passwordHash: Buffer.from("hashed-password"),
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        id: createdUser.id,
      });

      expect(users.create).toHaveBeenCalledWith({
        email: userData.email,
        createdAt: expect.any(Date),
      });

      expect(emailAuth.create).toHaveBeenCalledWith({
        userId: createdUser.id,
        email: userData.email,
        passwordHash: expect.any(Buffer),
      });

      expect(argon2.hash).toHaveBeenCalledWith(userData.password);
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      (users.create as Mock).mockRejectedValue(new users.EmailConflictError());

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ message: "Email already exists" });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: userData.email,
        createdAt: new Date(),
        lastLoginAt: null,
      };

      const authData = {
        userId: user.id,
        email: user.email,
        passwordHash: Buffer.from("hashed-password"),
      };

      (users.getByEmail as Mock).mockResolvedValue(user);
      (emailAuth.getByEmail as Mock).mockResolvedValue(authData);
      (users.updateLastLogin as Mock).mockResolvedValue({
        ...user,
        lastLoginAt: new Date(),
      });
      (users.getById as Mock).mockResolvedValue(user);
      (argon2.verify as Mock).mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        id: user.id,
      });
      expect(response.header["set-cookie"]).toBeDefined();

      expect(users.getByEmail).toHaveBeenCalledWith(userData.email);
      expect(emailAuth.getByEmail).toHaveBeenCalledWith(userData.email);
      expect(argon2.verify).toHaveBeenCalled();
      expect(users.updateLastLogin).toHaveBeenCalledWith(user.id);
    });

    it("should return 401 for invalid credentials", async () => {
      const userData = {
        email: "test@example.com",
        password: "wrong",
      };

      (users.getByEmail as Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    });

    it("should return 401 for wrong password", async () => {
      const userData = {
        email: "test@example.com",
        password: "wrong",
      };

      const user = {
        id: 1,
        email: userData.email,
        createdAt: new Date(),
        lastLoginAt: null,
      };

      const authData = {
        userId: user.id,
        email: user.email,
        passwordHash: Buffer.from("hashed-password"),
      };

      (users.getByEmail as Mock).mockResolvedValue(user);
      (emailAuth.getByEmail as Mock).mockResolvedValue(authData);
      (argon2.verify as Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      // First login
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: userData.email,
        createdAt: new Date(),
        lastLoginAt: null,
      };

      (users.getByEmail as Mock).mockResolvedValue(user);
      (emailAuth.getByEmail as Mock).mockResolvedValue({
        userId: user.id,
        email: user.email,
        passwordHash: Buffer.from("hashed-password"),
      });

      // Login first
      await request(app).post("/api/auth/login").send(userData);

      // Then logout
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
  });
});
