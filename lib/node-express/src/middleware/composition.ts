import { Handler, json, urlencoded } from "express";
import { requestId } from "./requestId.js";
import { httpLogger } from "./httpLogger.js";
import { loggerInjector } from "./logger.js";
import { openApiValidator } from "./openapi.js";
import { notFoundHandler, errorHandler } from "./errors.js";
import { healthRouter } from "./health.js";

/**
 * Recommended pre-route middleware stack.
 * Includes:
 * 1. Request ID generation
 * 2. HTTP request logging (Morgan)
 * 3. Body parsing (JSON + URL-encoded)
 * 4. Logger injection
 * 5. OpenAPI validation
 * 6. Health check endpoint (/health)
 */
export const recommendedPreMiddleware: Handler[] = [
  requestId,
  httpLogger,
  // Built-in Express middleware
  json(),
  urlencoded({ extended: false }),
  loggerInjector,
  healthRouter,
  ...openApiValidator,
];

/**
 * Recommended error handling middleware stack.
 * Should be used after all routes.
 * Includes:
 * 1. 404 handler for undefined routes
 * 2. Error handler for all other errors
 */
export const recommendedErrorHandlers = [notFoundHandler, errorHandler];
