import { createPreMiddleware } from "@saflib/node-express";
import { recommendedErrorHandlers } from "@saflib/node-express";
import { jsonSpec } from "@saf-2025/specs-apis";
// Create pre-middleware with OpenAPI validation
export const preMiddleware = createPreMiddleware({
  apiSpec: jsonSpec,
});

// Re-export error handlers for convenience
export { recommendedErrorHandlers as errorHandlers };
