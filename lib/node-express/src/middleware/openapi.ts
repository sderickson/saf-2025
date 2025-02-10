import * as OpenApiValidator from "express-openapi-validator";
import type { ValidateResponseOpts } from "express-openapi-validator/dist/framework/types.ts";
import type { OpenApiRequestHandler } from "express-openapi-validator/dist/framework/types.ts";
import apiSpec from "@saf/specs-apis/dist/openapi.json" with { type: "json" };
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.ts";

const validateResponses: ValidateResponseOpts = {
  onError: (error, body, req) => {
    req.log.error("Validation error:", error);
  },
};

/**
 * Default OpenAPI validation middleware using the shared specification from @saf/specs-apis.
 * This is the recommended validator for most services.
 */
export const openApiValidator: OpenApiRequestHandler[] =
  OpenApiValidator.middleware({
    apiSpec: apiSpec as any,
    validateRequests: true,
    validateResponses: validateResponses,
    formats: [
      {
        name: "date-time",
        type: "string",
        validate: (value: string) => {
          return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
        },
      },
    ],
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
    validateResponses: validateResponses,
  });
};
