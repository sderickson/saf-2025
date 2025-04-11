import express from "express";
import { todos, TodoNotFoundError } from "@saf-2025/dbs-main";
import type { ApiRequestSchema, ApiResponseSchema } from "@saf-2025/specs-apis";
import { createHandler } from "@saflib/node-express";
const router = express.Router();

// Get all todos
router.get(
  "/",
  createHandler(async (_, res, next) => {
    try {
      const todoList = await todos.getAllTodos();
      res.json(todoList);
    } catch (error) {
      next(error);
    }
  }),
);

// Create a new todo
router.post(
  "/",
  createHandler(async (req, res, next) => {
    try {
      const { title } = req.body as ApiRequestSchema["createTodo"];
      const todo = await todos.createTodo(title);
      // Convert Date to ISO string for API response
      const responseTodo: ApiResponseSchema["createTodo"]["201"] = {
        ...todo,
        createdAt: todo.createdAt.toISOString(),
      };
      res.status(201).json(responseTodo);
    } catch (error) {
      next(error);
    }
  }),
);

// Update a todo
router.put(
  "/:id",
  createHandler(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, completed } = req.body as ApiRequestSchema["updateTodo"];
      const todo = await todos.updateTodo(id, title, completed);
      // Convert Date to ISO string for API response
      const responseTodo: ApiResponseSchema["updateTodo"]["200"] = {
        ...todo,
        createdAt: todo.createdAt.toISOString(),
      };
      res.json(responseTodo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }),
);

// Delete a todo
router.delete(
  "/:id",
  createHandler(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      await todos.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }),
);

// Delete all todos
router.delete(
  "/",
  createHandler(async (_, res, next) => {
    try {
      await todos.deleteAllTodos();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }),
);

export default router;
