import { Handler } from "express";
import { v4 as uuidv4 } from "uuid";

// Extend Express Request type to include id property
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

/**
 * Middleware that adds a unique request ID to each incoming request.
 * The ID is generated using UUID v4 and truncated to 8 characters.
 * This ID can be used for request tracing and logging correlation.
 */
export const requestId: Handler = (req, res, next): void => {
  req.id = uuidv4().slice(0, 8);
  next();
};
