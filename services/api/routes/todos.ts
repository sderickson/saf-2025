import express from "express";
import { todos, TodoNotFoundError } from "@saf/dbs-main";
import type { DatabaseError, UnhandledDatabaseError } from "@saf/dbs-main";

const router = express.Router();

// Get all todos
router.get("/", async (req, res, next) => {
  try {
    const todoList = await todos.getAllTodos();
    res.json(todoList);
  } catch (error) {
    next(error);
  }
});

// Create a new todo
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    const todo = await todos.createTodo(title);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

// Update a todo
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, completed } = req.body;
    const todo = await todos.updateTodo(id, title, completed);
    res.json(todo);
  } catch (error) {
    if (error instanceof TodoNotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

// Delete a todo
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await todos.deleteTodo(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof TodoNotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
