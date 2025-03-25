import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { todos, TodoNotFoundError } from "@saf-2025/dbs-main";
import type { Todo } from "@saf-2025/dbs-main";
import todosRouter from "./todos.js";
import {
  recommendedErrorHandlers,
  recommendedPreMiddleware,
} from "@saflib/node-express";

// Create Express app for testing
const app = express();
app.use(recommendedPreMiddleware);
app.use("/todos", todosRouter);
app.use(recommendedErrorHandlers);

// Mock the database functions
vi.mock("@saf-2025/dbs-main", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@saf-2025/dbs-main")>();
  return {
    ...actual,
    todos: {
      getAllTodos: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    },
  };
});

const convertTimestamps = (todo: Todo) => {
  return {
    ...todo,
    createdAt: new Date(todo.createdAt).toISOString(),
  };
};

describe("Todos Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /todos", () => {
    it("should return all todos", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo 1",
          completed: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Test Todo 2",
          completed: true,
          createdAt: new Date(),
        },
      ];
      vi.mocked(todos.getAllTodos).mockResolvedValue(mockTodos);

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTodos.map(convertTimestamps));
      expect(todos.getAllTodos).toHaveBeenCalledOnce();
    });

    it("should handle database errors", async () => {
      vi.mocked(todos.getAllTodos).mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app).get("/todos");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const newTodo = { title: "New Todo" };
      const createdTodo = {
        id: 1,
        title: "New Todo",
        completed: false,
        createdAt: new Date(),
      };
      vi.mocked(todos.createTodo).mockResolvedValue(createdTodo);

      const response = await request(app).post("/todos").send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(convertTimestamps(createdTodo));
      expect(todos.createTodo).toHaveBeenCalledWith(newTodo.title);
    });

    it("should handle database errors", async () => {
      vi.mocked(todos.createTodo).mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .post("/todos")
        .send({ title: "New Todo" });

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update a todo", async () => {
      const todoId = 1;
      const updateData = { title: "Updated Todo", completed: true };
      const updatedTodo = {
        id: todoId,
        ...updateData,
        createdAt: new Date(),
      };
      vi.mocked(todos.updateTodo).mockResolvedValue(updatedTodo);

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(convertTimestamps(updatedTodo));
      expect(todos.updateTodo).toHaveBeenCalledWith(
        todoId,
        updateData.title,
        updateData.completed,
      );
    });

    it("should return 404 when todo not found", async () => {
      const todoId = 999;
      vi.mocked(todos.updateTodo).mockRejectedValue(
        new TodoNotFoundError(todoId),
      );

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send({ title: "Updated Todo", completed: true });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Todo with id 999 not found" });
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete a todo", async () => {
      const todoId = 1;
      const deletedTodo = {
        id: todoId,
        title: "Deleted Todo",
        completed: false,
        createdAt: new Date(),
      };
      vi.mocked(todos.deleteTodo).mockResolvedValue(deletedTodo);

      const response = await request(app).delete(`/todos/${todoId}`);

      expect(response.status).toBe(204);
      expect(todos.deleteTodo).toHaveBeenCalledWith(todoId);
    });

    it("should return 404 when todo not found", async () => {
      const todoId = 999;
      vi.mocked(todos.deleteTodo).mockRejectedValue(
        new TodoNotFoundError(todoId),
      );

      const response = await request(app).delete(`/todos/${todoId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Todo with id 999 not found" });
    });
  });
});
