/**
 * Example Route Tests
 *
 * This is a template for testing route handlers.
 * It demonstrates common patterns for:
 * - Setting up test environment
 * - Making HTTP requests
 * - Asserting responses
 * - Error case testing
 *
 * For focused and faster tests, mock whatever libraries or services, such as databases, are used
 * by the route handlers.
 */

import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express, { ErrorRequestHandler } from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { join } from "path";
import winston from "winston";
import exampleRouter from "./example.js";

// Create Express app for testing
const app = express();
app.use(express.json());

// Create a mock logger
const mockLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      silent: true, // Suppress logs during tests
    }),
  ],
});

// Add mock logger middleware
app.use((req, res, next) => {
  req.log = mockLogger;
  next();
});

// Add OpenAPI validator middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(process.cwd(), "../../specs/apis/routes/example.yaml"),
    validateRequests: true,
    validateResponses: true,
  })
);

// Add routes
app.use("/example", exampleRouter);

// Error handler for validation errors
const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 400 && err.errors) {
    res.status(400).json({
      error: "Validation error",
      details: err.errors,
    });
    return;
  }
  if (err.status === 404) {
    res.status(404).json({
      message: err.message,
    });
    return;
  }
  next(err);
};

// Final error handler
const finalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err.name,
  });
};

app.use(validationErrorHandler);
app.use(finalErrorHandler);

describe("Example Routes", () => {
  describe("GET /example", () => {
    it("should return list of examples", async () => {
      const response = await request(app).get("/example");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });

  describe("POST /example", () => {
    it("should create new example", async () => {
      const newItem = { name: "Test Example" };

      const response = await request(app).post("/example").send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: newItem.name,
        createdAt: expect.any(String),
      });
    });

    it("should validate request body", async () => {
      const response = await request(app).post("/example").send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Validation error",
      });
    });
  });

  describe("GET /example/:id", () => {
    it("should return example by id", async () => {
      const response = await request(app).get("/example/1");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        name: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should return 404 for non-existent example", async () => {
      const response = await request(app).get("/example/999");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: "Item not found",
      });
    });
  });
});
