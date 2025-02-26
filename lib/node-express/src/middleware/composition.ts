import type { Handler } from "express";
import { json, urlencoded } from "express";
import { requestId } from "./requestId.ts";
import { httpLogger } from "./httpLogger.ts";
import { loggerInjector } from "./logger.ts";
import { openApiValidator, createOpenApiValidator } from "./openapi.ts";
import { notFoundHandler, errorHandler } from "./errors.ts";
import { healthRouter } from "./health.ts";
import { corsRouter } from "./cors.ts";
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.ts";
import { user } from "./user.ts";

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
  healthRouter, // before httpLogger to avoid polluting logs
  requestId,
  httpLogger,
  // Built-in Express middleware
  json(),
  urlencoded({ extended: false }),
  loggerInjector,
  corsRouter,
  ...openApiValidator,
];

interface PreMiddlewareOptions {
  apiSpec?: OpenAPIV3.DocumentV3;
  parseAuthHeaders?: boolean;
}

export const createPreMiddleware = (options: PreMiddlewareOptions = {}): Handler[] => {
  const { apiSpec, parseAuthHeaders } = options;
  
  let openApiValidatorMiddleware: Handler[] = [];
  if (apiSpec) {
    openApiValidatorMiddleware = createOpenApiValidator(apiSpec);
  }

  let authMiddleware: Handler[] = [];
  if (parseAuthHeaders) {
    authMiddleware = [user];
  }

  return [
    healthRouter, // before httpLogger to avoid polluting logs
    requestId,
    httpLogger,
    // Built-in Express middleware
    json(),
    urlencoded({ extended: false }),
    loggerInjector,
    corsRouter,
    ...openApiValidatorMiddleware,
    ...authMiddleware,
  ];
};

/**
 * Recommended error handling middleware stack.
 * Should be used after all routes.
 * Includes:
 * 1. 404 handler for undefined routes
 * 2. Error handler for all other errors
 */
export const recommendedErrorHandlers = [notFoundHandler, errorHandler];
