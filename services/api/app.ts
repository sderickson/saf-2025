/**
 * API Service Application
 *
 * Main API service for the SAF architecture.
 * Implements common middleware patterns and routes for various API endpoints.
 */

import express from "express";
import { preMiddleware, errorHandlers } from "./middleware.ts";
import todosRouter from "./routes/todos.ts";

const app = express();
app.set("trust proxy", true);

/**
 * Pre-route Middleware Stack
 * Includes request ID, logging, body parsing, and OpenAPI validation
 */
app.use(preMiddleware);

/**
 * Routes
 * API endpoints for various resources
 */
app.use("/todos", todosRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(errorHandlers);

export default app;
