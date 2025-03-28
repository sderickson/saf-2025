import { describe, it, expect, beforeEach } from "vitest";
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  TodoNotFoundError,
} from "./todos.ts";
import { db } from "../instance.ts";
import { todos } from "../schema.ts";

// The table's type is inferred automatically
type Todo = typeof todos.$inferSelect;

describe("Todo Queries", () => {
  beforeEach(async () => {
    // Clear todos table before each test
    await db.delete(todos);
  });

  describe("getAllTodos", () => {
    it("returns empty array when no todos exist", async () => {
      const result = await getAllTodos();
      expect(result).toEqual([]);
    });

    it("returns all todos in order of creation", async () => {
      const todo1 = await createTodo("First todo");
      const todo2 = await createTodo("Second todo");

      const result = await getAllTodos();
      expect(result).toEqual([todo1, todo2]);
    });
  });

  describe("createTodo", () => {
    it("creates a new todo", async () => {
      const todo = await createTodo("Test todo");
      expect(todo.title).toBe("Test todo");
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("updateTodo", () => {
    it("updates an existing todo", async () => {
      const todo = await createTodo("Original title");
      const updated = await updateTodo(todo.id, "Updated title", true);

      expect(updated.title).toBe("Updated title");
      expect(updated.completed).toBe(true);
    });

    it("throws error when todo not found", async () => {
      await expect(updateTodo(999, "Title", false)).rejects.toThrow(
        "Todo with id 999 not found",
      );
    });
  });

  describe("deleteTodo", () => {
    it("deletes an existing todo", async () => {
      const todo = await createTodo("To delete");
      const deleted = await deleteTodo(todo.id);

      expect(deleted).toEqual(todo);
      const remaining = await getAllTodos();
      expect(remaining).toEqual([]);
    });

    it("throws error when todo not found", async () => {
      await expect(deleteTodo(999)).rejects.toThrow(
        "Todo with id 999 not found",
      );
    });
  });

  describe("deleteAllTodos", () => {
    it("deletes all todos", async () => {
      // Create some test todos
      await createTodo("First todo");
      await createTodo("Second todo");
      await createTodo("Third todo");

      // Verify todos exist
      let allTodos = await getAllTodos();
      expect(allTodos).toHaveLength(3);

      // Delete all todos
      await deleteAllTodos();

      // Verify todos are deleted
      allTodos = await getAllTodos();
      expect(allTodos).toHaveLength(0);
    });
  });
});
