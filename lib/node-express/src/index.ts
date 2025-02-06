export { requestId } from "./middleware/requestId.ts";
export { httpLogger } from "./middleware/httpLogger.ts";
export { createLogger, loggerInjector, logger } from "./middleware/logger.ts";
export {
  openApiValidator,
  createOpenApiValidator,
} from "./middleware/openapi.ts";
export { notFoundHandler, errorHandler } from "./middleware/errors.ts";
export { healthRouter } from "./middleware/health.ts";
import dotenv from "dotenv";

// Recommended middleware bundles
export {
  recommendedPreMiddleware,
  recommendedErrorHandlers,
} from "./middleware/composition.ts";

dotenv.config();
