import express from "express";
import { todos, DatabaseError, UnhandledDatabaseError } from "dbs-main";

const router = express.Router();

// Get all todos
router.get("/", async (req, res, next) => {
  try {
    const todoList = await todos.getAllTodos();
    res.json(todoList);
  } catch (err: unknown) {
    const error = err as Error;
    if (error instanceof UnhandledDatabaseError) {
      next(error);
    } else {
      next(new Error("Failed to fetch todos"));
    }
  }
});

// Create a new todo
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    const todo = await todos.createTodo(title);
    res.status(201).json(todo);
  } catch (err: unknown) {
    const error = err as Error;
    if (error instanceof UnhandledDatabaseError) {
      next(error);
    } else {
      next(new Error("Failed to create todo"));
    }
  }
});

// Update a todo
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, completed } = req.body;
    const todo = await todos.updateTodo(id, title, completed);
    res.json(todo);
  } catch (err: unknown) {
    const error = err as Error;
    if (error instanceof DatabaseError) {
      if (error.message === "Todo not found") {
        res.status(404).json({ message: "Todo not found" });
        return;
      }
      next(error);
    } else {
      next(new Error("Failed to update todo"));
    }
  }
});

// Delete a todo
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await todos.deleteTodo(id);
    res.status(204).send();
  } catch (err: unknown) {
    const error = err as Error;
    if (error instanceof DatabaseError) {
      if (error.message === "Todo not found") {
        res.status(404).json({ message: "Todo not found" });
        return;
      }
      next(error);
    } else {
      next(new Error("Failed to delete todo"));
    }
  }
});

export default router;
