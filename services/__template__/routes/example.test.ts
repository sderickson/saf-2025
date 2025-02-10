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

import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import exampleRouter from "./example.js";
import {
  recommendedErrorHandlers,
  recommendedPreMiddleware,
} from "@saf/node-express";

// Create Express app for testing
const app = express();
app.use(recommendedPreMiddleware);
app.use("/api/examples", exampleRouter);
app.use(recommendedErrorHandlers);

describe("Example Routes", () => {
  describe("GET /examples", () => {
    it("should return list of examples", async () => {
      const response = await request(app).get("/api/examples");

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

      const response = await request(app).post("/api/examples").send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: newItem.name,
        createdAt: expect.any(String),
      });
    });

    it("should validate request body", async () => {
      const response = await request(app).post("/api/examples").send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: "request/body must have required property 'name'",
        status: 400,
      });
    });
  });

  describe("GET /example/:id", () => {
    it("should return example by id", async () => {
      const response = await request(app).get("/api/examples/1");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        name: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should return 404 for non-existent example", async () => {
      const response = await request(app).get("/api/examples/999");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: "Item not found",
        status: 404,
      });
    });
  });
});
