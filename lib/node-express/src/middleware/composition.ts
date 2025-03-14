import type { Handler } from "express";
import { json, urlencoded } from "express";
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.ts";
import { auth } from "./auth.ts";
import { corsRouter } from "./cors.ts";
import { errorHandler, notFoundHandler } from "./errors.ts";
import { healthRouter } from "./health.ts";
import { httpLogger } from "./httpLogger.ts";
import { loggerInjector } from "./logger.ts";
import { createOpenApiValidator, openApiValidator } from "./openapi.ts";
import { requestId } from "./requestId.ts";

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
  disableCors?: boolean;
}

export const createPreMiddleware = (
  options: PreMiddlewareOptions = {}
): Handler[] => {
  const { apiSpec, parseAuthHeaders, disableCors } = options;

  let openApiValidatorMiddleware: Handler[] = [];
  if (apiSpec) {
    openApiValidatorMiddleware = createOpenApiValidator(apiSpec);
  }

  let authMiddleware: Handler[] = [];
  if (parseAuthHeaders) {
    authMiddleware = [auth];
  }

  let corsMiddleware: Handler[] = [corsRouter];
  if (disableCors) {
    corsMiddleware = [];
  }

  return [
    healthRouter, // before httpLogger to avoid polluting logs
    requestId,
    httpLogger,
    // Built-in Express middleware
    json(),
    urlencoded({ extended: false }),
    loggerInjector,
    ...corsMiddleware,
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
