#!/usr/bin/env node

/**
 * Health Check Script
 *
 * Makes an HTTP request to the service's health endpoint.
 * Exits with 0 if healthy, 1 if unhealthy.
 */

import http from "http";

const port = process.env.PORT || 3000;
const options = {
  host: "localhost",
  port,
  path: "/health",
  timeout: 2000,
};

const request = http.get(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on("error", (err) => {
  console.error("Health check failed:", err.message);
  process.exit(1);
});

request.on("timeout", () => {
  console.error("Health check timeout");
  process.exit(1);
});
