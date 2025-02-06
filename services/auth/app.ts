/**
 * Authentication Service Application
 *
 * Handles user authentication and session management for the SAF architecture.
 * Implements common middleware patterns and specific auth-related functionality.
 */

import express from "express";
import passport from "passport";
import * as db from "@saf/dbs-auth";
import session from "express-session";
import {
  recommendedPreMiddleware,
  recommendedErrorHandlers,
} from "@saf/node-express";
import { authRouter } from "./routes/auth.ts";
import { setupPassport } from "./config/passport.ts";

const app = express();

// Define properties added to Express Request objects by middleware
declare global {
  namespace Express {
    interface Request {
      db: typeof db;
    }
  }
}

/**
 * Pre-route Middleware Stack
 * Includes request ID, logging, body parsing, and OpenAPI validation
 */
app.use(recommendedPreMiddleware);

// Session configuration
app.use(
  session({
    store: db.sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    },
  })
);

// Initialize Passport and restore authentication state from session
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// db injection
app.use((req, _, next) => {
  req.db = db;
  next();
});

/**
 * Routes
 * Authentication related endpoints
 */
app.use("/api/auth", authRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(recommendedErrorHandlers);

export default app;
