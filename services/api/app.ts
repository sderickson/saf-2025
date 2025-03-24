/**
 * API Service Application
 *
 * Main API service for the SAF architecture.
 * Implements common middleware patterns and routes for various API endpoints.
 */

import express from "express";
import {
  recommendedPreMiddleware,
  recommendedErrorHandlers,
} from "@saflib/node-express";
import todosRouter from "./routes/todos.ts";

const app = express();
app.set("trust proxy", true);

/**
 * Pre-route Middleware Stack
 * Includes request ID, logging, body parsing, and OpenAPI validation
 */
app.use(recommendedPreMiddleware);

/**
 * Routes
 * API endpoints for various resources
 */
app.use("/todos", todosRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(recommendedErrorHandlers);

export default app;
