import { Router } from "express";

/**
 * Health Check Router
 * Provides a basic health check endpoint for container orchestration
 * readiness/liveness probes
 */
export const healthRouter = Router();

healthRouter.get("/health", (req, res) => {
  res.send("OK");
});
