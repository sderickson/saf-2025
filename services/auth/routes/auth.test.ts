import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import request from "supertest";
import express from "express";
import session from "express-session";
import passport from "passport";
import * as OpenApiValidator from "express-openapi-validator";
import { join } from "path";
import { authRouter } from "./auth.ts";
import { setupPassport } from "../config/passport.ts";
import * as argon2 from "argon2";

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

// Create a fresh app for each test
const app = express();
app.use(express.json());
app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Add OpenAPI validator middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(process.cwd(), "../../specs/apis/openapi.yaml"),
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/auth", authRouter);

// Add error handler for validation errors
app.use((err: any, req: any, res: any, next: any) => {
  // Format validation errors
  if (err.status === 400 && err.errors) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors,
    });
  }
  next(err);
});

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const createdUser = {
        id: 1,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(),
        lastLoginAt: null,
      };

      (users.create as Mock).mockResolvedValue(createdUser);
      (emailAuth.create as Mock).mockResolvedValue({
        userId: createdUser.id,
        email: createdUser.email,
        passwordHash: Buffer.from("hashed-password"),
      });

      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        name: userData.name,
        id: createdUser.id,
      });

      expect(users.create).toHaveBeenCalledWith({
        email: userData.email,
        name: userData.name,
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
        name: "Test User",
      };

      (users.create as Mock).mockRejectedValue(new users.EmailConflictError());

      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: userData.email,
        name: "Test User",
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

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        name: user.name,
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

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });

    it("should return 401 for wrong password", async () => {
      const userData = {
        email: "test@example.com",
        password: "wrong",
      };

      const user = {
        id: 1,
        email: userData.email,
        name: "Test User",
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

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout successfully", async () => {
      // First login
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: userData.email,
        name: "Test User",
        createdAt: new Date(),
        lastLoginAt: null,
      };

      (users.getByEmail as Mock).mockResolvedValue(user);
      (emailAuth.getByEmail as Mock).mockResolvedValue({
        userId: user.id,
        email: user.email,
        passwordHash: Buffer.from("hashed-password"),
      });
      (users.updateLastLogin as Mock).mockResolvedValue({
        ...user,
        lastLoginAt: new Date(),
      });
      (users.getById as Mock).mockResolvedValue(user);
      (argon2.verify as Mock).mockResolvedValue(true);

      const agent = request.agent(app);
      await agent.post("/auth/login").send(userData);

      const response = await agent.post("/auth/logout");
      expect(response.status).toBe(200);

      // Verify we're logged out
      const verifyResponse = await agent.post("/auth/verify");
      expect(verifyResponse.status).toBe(401);
    });
  });

  describe("POST /auth/verify", () => {
    it("should verify authenticated user", async () => {
      // First login
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: userData.email,
        name: "Test User",
        createdAt: new Date(),
        lastLoginAt: null,
      };

      (users.getByEmail as Mock).mockResolvedValue(user);
      (emailAuth.getByEmail as Mock).mockResolvedValue({
        userId: user.id,
        email: user.email,
        passwordHash: Buffer.from("hashed-password"),
      });
      (users.updateLastLogin as Mock).mockResolvedValue({
        ...user,
        lastLoginAt: new Date(),
      });
      (users.getById as Mock).mockResolvedValue(user);
      (argon2.verify as Mock).mockResolvedValue(true);

      const agent = request.agent(app);
      await agent.post("/auth/login").send(userData);

      const response = await agent.post("/auth/verify");

      expect(response.status).toBe(200);
      expect(response.header["x-user-id"]).toBe(user.id.toString());
      expect(response.header["x-user-email"]).toBe(user.email);
    });

    it("should return 401 for unauthenticated user", async () => {
      const response = await request(app).post("/auth/verify");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    });
  });
});
