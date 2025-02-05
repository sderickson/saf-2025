/**
 * Template Service Application
 *
 * This is a template for creating new microservices in the SAF architecture.
 * It includes common middleware, error handling, and configuration patterns
 * that should be used across all services.
 */

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { Logger } from "winston";
import {
  requestId,
  httpLogger,
  loggerInjector,
  openApiValidator,
  notFoundHandler,
  errorHandler,
} from "@saf/node-express";
import apiSpec from "@saf/specs-apis/dist/openapi.json" assert { type: "json" };
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ES modules don't have __dirname, so we need to construct it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();

/**
 * Type declarations for Express Request extensions
 * Add any additional properties that middleware will attach to the request object
 */
declare global {
  namespace Express {
    interface Request {
      log: Logger; // Winston logger instance
    }
  }
}

/**
 * Basic health check endpoint
 * Used by container orchestration for readiness/liveness probes
 */
app.get("/health", (req, res) => {
  res.send("OK");
});

/**
 * Request ID Middleware
 * Generates a unique ID for each request for tracing through logs
 */
app.use(requestId);

/**
 * HTTP Request Logging
 * Uses Morgan for HTTP access logging with request ID correlation
 */
app.use(httpLogger);

/**
 * Body Parser Middleware
 * Handles JSON and URL-encoded bodies
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Static File Serving
 * Uncomment if your service needs to serve static files
 */
// app.use(express.static(path.join(__dirname, "public")));

/**
 * Logger Injection Middleware
 * Attaches a child logger with request ID to each request
 */
app.use(loggerInjector);

/**
 * OpenAPI Validation Middleware
 * Validates requests and responses against the OpenAPI specification
 */
app.use(openApiValidator);

/**
 * Routes
 * Import and use your route handlers here
 */
// app.use("/api/resource", resourceRouter);

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use(notFoundHandler);

/**
 * Error Handler
 * Central error handling middleware
 */
app.use(errorHandler);

export default app;
