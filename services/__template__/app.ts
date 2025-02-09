/**
 * Template Service Application
 *
 * This is a template for creating new microservices in the SAF architecture.
 * It includes common middleware, error handling, and configuration patterns
 * that should be used across all services.
 */

import express from "express";
import {
  recommendedPreMiddleware,
  recommendedErrorHandlers,
} from "@saf/node-express";
import exampleRouter from "./routes/example.ts";
const app = express();

/**
 * Pre-route Middleware Stack
 * Includes request ID, logging, body parsing, and OpenAPI validation
 */
app.use(recommendedPreMiddleware);

/**
 * Routes
 * Import and use your route handlers here
 */
app.use("/api/examples", exampleRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(recommendedErrorHandlers);

export default app;
