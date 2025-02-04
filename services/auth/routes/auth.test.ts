import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import session from "express-session";
import passport from "passport";
import { authRouter } from "./auth.js";
import { setupPassport } from "../config/passport.js";

setupPassport();

describe("Auth Routes", () => {
  let app: express.Express;
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "session-authenticated" });
      expect(response.header["set-cookie"]).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrong" });

      expect(response.status).toBe(401);
    });

    // TODO: Add error handling when passport actually uses dbs
    // it("should handle login errors", async () => {
    //   const error = new Error("Login failed");
    //   const response = await request(app)
    //     .post("/auth/login")
    //     .send({ email: "test@example.com", password: "password" });

    //   expect(response.status).toBe(500);
    // });
  });

  // describe("POST /auth/logout", () => {
  //   it("should logout successfully", async () => {
  //     app = express();
  //     app.use(express.json());
  //     app.use((req, _res, next) => {
  //       req.logout = (cb: (err?: any) => void) => cb();
  //       next();
  //     });
  //     app.use("/auth", authRouter);

  //     const response = await request(app).post("/auth/logout");
  //     expect(response.status).toBe(200);
  //   });

  //   it("should handle logout errors", async () => {
  //     const error = new Error("Logout failed");
  //     app = express();
  //     app.use(express.json());
  //     app.use((req, _res, next) => {
  //       req.logout = (cb: (err?: any) => void) => cb(error);
  //       next();
  //     });
  //     app.use("/auth", authRouter);

  //     const response = await request(app).post("/auth/logout");
  //     expect(response.status).toBe(500);
  //   });
  // });

  // describe("POST /auth/verify", () => {
  //   it("should verify authenticated user", async () => {
  //     const mockUser = { id: "123", email: "test@example.com" };
  //     app = express();
  //     app.use(express.json());
  //     app.use((req, _res, next) => {
  //       req.isAuthenticated = () => true;
  //       req.user = mockUser;
  //       next();
  //     });
  //     app.use("/auth", authRouter);

  //     const response = await request(app).post("/auth/verify");

  //     expect(response.status).toBe(200);
  //     expect(response.header["x-user-id"]).toBe("123");
  //     expect(response.header["x-user-email"]).toBe("test@example.com");
  //   });

  //   it("should return 401 for unauthenticated user", async () => {
  //     app = express();
  //     app.use(express.json());
  //     app.use((req, _res, next) => {
  //       req.isAuthenticated = () => false;
  //       next();
  //     });
  //     app.use("/auth", authRouter);

  //     const response = await request(app).post("/auth/verify");

  //     expect(response.status).toBe(401);
  //     expect(response.body).toEqual({ error: "Unauthorized" });
  //   });

  //   it("should handle verification errors", async () => {
  //     app = express();
  //     app.use(express.json());
  //     app.use((req, _res, next) => {
  //       req.isAuthenticated = () => {
  //         throw new Error("Verification failed");
  //       };
  //       next();
  //     });
  //     app.use("/auth", authRouter);

  //     const response = await request(app).post("/auth/verify");
  //     expect(response.status).toBe(500);
  //   });
  // });
});
