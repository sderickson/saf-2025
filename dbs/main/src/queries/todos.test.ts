import { describe, it, expect, beforeEach } from "vitest";
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  TodoNotFoundError,
} from "./todos.ts";
import { db } from "../instance.ts";
import { todos } from "../schema.ts";

// The table's type is inferred automatically
type Todo = typeof todos.$inferSelect;

describe("todos queries", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await db.delete(todos);
  });

  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const title = "Test Todo";
      const result = await createTodo(title);

      expect(result).toMatchObject({
        title,
        completed: false,
        id: expect.any(Number),
        createdAt: expect.any(Date),
      });
    });
  });

  describe("getAllTodos", () => {
    it("should return all todos in order of creation", async () => {
      const titles = ["First Todo", "Second Todo", "Third Todo"];
      await Promise.all(titles.map((title) => createTodo(title)));

      const result = await getAllTodos();
      expect(result).toHaveLength(3);
      expect(result.map((todo: Todo) => todo.title)).toEqual(titles);
    });

    it("should return empty array when no todos exist", async () => {
      const result = await getAllTodos();
      expect(result).toEqual([]);
    });
  });

  describe("updateTodo", () => {
    it("should update a todo's title and completed status", async () => {
      const todo = await createTodo("Original Title");
      const updatedTitle = "Updated Title";

      const result = await updateTodo(todo.id, updatedTitle, true);

      expect(result).toMatchObject({
        id: todo.id,
        title: updatedTitle,
        completed: true,
      });
    });

    it("should throw TodoNotFoundError when todo not found", async () => {
      const nonExistentId = 999;
      await expect(updateTodo(nonExistentId, "Title", false)).rejects.toThrow(
        new TodoNotFoundError(nonExistentId)
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", async () => {
      const todo = await createTodo("To Be Deleted");
      const result = await deleteTodo(todo.id);

      expect(result).toMatchObject({
        id: todo.id,
        title: "To Be Deleted",
      });

      const allTodos = await getAllTodos();
      expect(allTodos).toHaveLength(0);
    });

    it("should throw TodoNotFoundError when todo not found", async () => {
      const nonExistentId = 999;
      await expect(deleteTodo(nonExistentId)).rejects.toThrow(
        new TodoNotFoundError(nonExistentId)
      );
    });
  });
});
