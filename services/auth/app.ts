/**
 * Authentication Service Application
 *
 * Handles user authentication and session management for the SAF architecture.
 * Implements common middleware patterns and specific auth-related functionality.
 */

import * as db from "@saf/dbs-auth";
import {
  createPreMiddleware,
  recommendedErrorHandlers,
} from "@saf/node-express";
import express from "express";
import session from "express-session";
import passport from "passport";
import { setupPassport } from "./config/passport.ts";
import { authRouter } from "./routes/auth.ts";

const app = express();
app.set("trust proxy", true);

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
console.log("Env:", {
  DISABLE_CORS: process.env.DISABLE_CORS,
  DOMAIN: process.env.DOMAIN,
  PROTOCOL: process.env.PROTOCOL,
});

const DISABLE_CORS = process.env.DISABLE_CORS === "true";
app.use(createPreMiddleware({ disableCors: DISABLE_CORS }));

// Session configuration
const cookie = {
  secure: process.env.PROTOCOL === "https",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: "strict" as const,
  domain: `.${process.env.DOMAIN}`, // Allow cookies to be shared across subdomains
};

app.use(
  session({
    store: db.sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie,
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
app.use("/auth", authRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(recommendedErrorHandlers);

export default app;
