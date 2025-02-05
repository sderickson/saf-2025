/**
 * Template Service Application
 *
 * This is a template for creating new microservices in the SAF architecture.
 * It includes common middleware, error handling, and configuration patterns
 * that should be used across all services.
 */

import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import morgan from "morgan";
import winston, { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";
import * as OpenApiValidator from "express-openapi-validator";
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
      id: string; // Request ID for tracing
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
app.use((req, res, next) => {
  req.id = uuidv4().slice(0, 8);
  next();
});

/**
 * Logging Middleware Setup
 * Uses Morgan for HTTP logging and Winston for application logging
 */
morgan.token("id", (req: Request) => req.id);
app.use(
  morgan(
    ":date[iso] <:id> :method :url :status :response-time ms - :res[content-length]"
  )
);

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
 * Winston Logger Setup
 * Creates a logger instance with request ID correlation
 */
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ reqId, level, message, timestamp }) => {
      return `${timestamp} <${reqId}> [${level}]: ${message}`;
    })
  ),
});

/**
 * Logger Injection Middleware
 * Attaches a child logger with request ID to each request
 */
app.use((req, res, next) => {
  req.log = logger.child({ reqId: req.id });
  next();
});

/**
 * OpenAPI Validation Middleware
 * Validates requests and responses against the OpenAPI specification
 */
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, "../../specs/apis/dist/openapi.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

/**
 * Routes
 * Import and use your route handlers here
 */
// app.use("/api/resource", resourceRouter);

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Error Handler
 * Central error handling middleware
 */
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Log error
  if (!req.log) {
    console.error(err.stack);
  } else {
    req.log.error(err.stack);
  }

  // Send error response
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

export default app;
