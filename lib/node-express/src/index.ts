export { requestId } from "./middleware/requestId.js";
export { httpLogger } from "./middleware/httpLogger.js";
export { createLogger, loggerInjector, logger } from "./middleware/logger.js";
export {
  openApiValidator,
  createOpenApiValidator,
} from "./middleware/openapi.js";
export { notFoundHandler, errorHandler } from "./middleware/errors.js";
export { healthRouter } from "./middleware/health.js";
import dotenv from "dotenv";

// Recommended middleware bundles
export {
  recommendedPreMiddleware,
  recommendedErrorHandlers,
} from "./middleware/composition.js";

dotenv.config();
