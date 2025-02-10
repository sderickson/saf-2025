/**
 * Example Route Handler
 *
 * This is a template for creating new route handlers in the service.
 * It demonstrates common patterns for:
 * - Route organization
 * - Error handling
 * - Request validation
 * - Response formatting
 */

import express from "express";
import createError from "http-errors";
import { createHandler } from "@saf/node-express";
const router = express.Router();

/**
 * GET /example
 *
 * Example of a simple GET endpoint that returns a list of items
 */
router.get(
  "/",
  createHandler(async (req, res, next) => {
    // Log the request
    req.log.info("Fetching example items");

    // Example response
    const items = [
      {
        id: 1,
        name: "Example 1",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Example 2",
        createdAt: new Date().toISOString(),
      },
    ];

    res.json(items);
  })
);

/**
 * POST /example
 *
 * Example of a POST endpoint that creates a new item
 */
router.post(
  "/",
  createHandler(async (req, res, next) => {
    const { name } = req.body;

    // Log the request
    req.log.info(`Creating new example item: ${name}`);

    // Example response
    const newItem = {
      id: 3,
      name,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(newItem);
  })
);

/**
 * GET /example/:id
 *
 * Example of a GET endpoint with URL parameters and error handling
 */
router.get(
  "/:id",
  createHandler(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    // Log the request
    req.log.info(`Fetching example item: ${id}`);

    // Example of error handling
    if (id === 999) {
      return next(createError(404, "Item not found"));
    }

    // Example response
    const item = {
      id,
      name: "Example Item",
      createdAt: new Date().toISOString(),
    };

    res.json(item);
  })
);

export default router;
