import * as OpenApiValidator from "express-openapi-validator";
import { OpenApiRequestHandler } from "express-openapi-validator/dist/framework/types.js";
import apiSpec from "@saf/specs-apis/dist/openapi.json";
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.js";

/**
 * Default OpenAPI validation middleware using the shared specification from @saf/specs-apis.
 * This is the recommended validator for most services.
 */
export const openApiValidator: OpenApiRequestHandler[] =
  OpenApiValidator.middleware({
    apiSpec: apiSpec as OpenAPIV3.DocumentV3,
    validateRequests: true,
    validateResponses: true,
  });

/**
 * Creates OpenAPI validation middleware with a custom specification.
 * Only use this if you need to validate against a different OpenAPI spec.
 */
export const createOpenApiValidator = (
  apiSpec: string | OpenAPIV3.DocumentV3
): OpenApiRequestHandler[] => {
  return OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  });
};
