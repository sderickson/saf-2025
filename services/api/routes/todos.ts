import express from "express";
import { todos, TodoNotFoundError } from "@saf/dbs-main";
import type { RequestSchema, ResponseSchema } from "@saf/specs-apis";
import { createHandler } from "@saf/node-express";
const router = express.Router();

// Get all todos
router.get(
  "/",
  createHandler(async (req, res, next) => {
    const todoList = await todos.getAllTodos();
    res.json(todoList);
  }),
);

// Create a new todo
router.post(
  "/",
  createHandler(async (req, res, next) => {
    const { title } = req.body as RequestSchema<"createTodo">;
    const todo: ResponseSchema<"createTodo", 201> =
      await todos.createTodo(title);
    res.status(201).json(todo);
  }),
);

// Update a todo
router.put(
  "/:id",
  createHandler(async (req, res, next) => {
    try {
      const id = parseInt((req.params as RequestSchema<"updateTodo">).id, 10);
      const { title, completed } = req.body as RequestSchema<"updateTodo">;
      const todo: ResponseSchema<"updateTodo", 200> = await todos.updateTodo(
        id,
        title,
        completed,
      );
      res.json(todo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ message: error.message });
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
      const id = parseInt((req.params as RequestSchema<"deleteTodo">).id, 10);
      const todo: ResponseSchema<"deleteTodo", 204> =
        await todos.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }),
);

export default router;
