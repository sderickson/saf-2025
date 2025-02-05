import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import session from "express-session";
import passport from "passport";
import { authRouter } from "./auth.js";
import { setupPassport } from "../config/passport.js";
import { users, DatabaseError } from "dbs-auth";
import * as emailAuth from "dbs-auth/queries/email-auth";
import * as argon2 from "argon2";

setupPassport();

describe("Auth Routes", () => {
  let app: express.Express;

  beforeEach(async () => {
    // Clean up the database
    await users.deleteAll();
    await emailAuth.deleteAll();

    // Create a fresh app for each test
    app = express();
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
    app.use("/auth", authRouter);
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        name: userData.name,
        id: expect.any(Number),
      });

      // Verify user was created in database
      const user = await users.getByEmail(userData.email);
      expect(user).toBeDefined();
      expect(user?.name).toBe(userData.name);

      // Verify email auth was created
      const auth = await emailAuth.getByEmail(userData.email);
      expect(auth).toBeDefined();
      // Verify password can be checked with argon2
      const passwordHash = Buffer.from(
        auth!.passwordHash as Uint8Array
      ).toString("utf-8");
      expect(await argon2.verify(passwordHash, userData.password)).toBe(true);
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      // Register first user
      await request(app).post("/auth/register").send(userData);

      // Try to register with same email
      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      // First register a user
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      await request(app).post("/auth/register").send(userData);

      // Then try to login
      const response = await request(app).post("/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: userData.email,
        name: userData.name,
        id: expect.any(Number),
      });
      expect(response.header["set-cookie"]).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrong",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout successfully", async () => {
      // First register and login
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const agent = request.agent(app);

      await agent.post("/auth/register").send(userData);

      const response = await agent.post("/auth/logout");
      expect(response.status).toBe(200);

      // Verify we're logged out by trying to access a protected route
      const verifyResponse = await agent.post("/auth/verify");
      expect(verifyResponse.status).toBe(401);
    });
  });

  describe("POST /auth/verify", () => {
    it("should verify authenticated user", async () => {
      // First register and login
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const agent = request.agent(app);

      const registerResponse = await agent
        .post("/auth/register")
        .send(userData);

      const response = await agent.post("/auth/verify");

      expect(response.status).toBe(200);
      expect(response.header["x-user-id"]).toBe(
        registerResponse.body.id.toString()
      );
      expect(response.header["x-user-email"]).toBe(userData.email);
    });

    it("should return 401 for unauthenticated user", async () => {
      const response = await request(app).post("/auth/verify");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    });
  });
});
