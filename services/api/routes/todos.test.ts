import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { join } from "path";
import { todos, TodoNotFoundError } from "@saf/dbs-main";
import todosRouter from "./todos.ts";

// Create a basic express app for testing
const app = express();
app.use(express.json());

// Add OpenAPI validator middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(process.cwd(), "../../specs/apis/openapi.yaml"),
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/todos", todosRouter);

// Add error handler for validation errors
app.use((err: any, req: any, res: any, next: any) => {
  // Format validation errors
  if (err.status === 400 && err.errors) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors,
    });
  }
  next(err);
});

// Mock the database functions
vi.mock("@saf/dbs-main", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@saf/dbs-main")>();
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
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Test Todo 2",
          completed: true,
          created_at: new Date().toISOString(),
        },
      ];
      vi.mocked(todos.getAllTodos).mockResolvedValue(mockTodos);

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTodos);
      expect(todos.getAllTodos).toHaveBeenCalledOnce();
    });

    it("should handle database errors", async () => {
      vi.mocked(todos.getAllTodos).mockRejectedValue(
        new Error("Database error")
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
        created_at: new Date().toISOString(),
      };
      vi.mocked(todos.createTodo).mockResolvedValue(createdTodo);

      const response = await request(app).post("/todos").send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTodo);
      expect(todos.createTodo).toHaveBeenCalledWith(newTodo.title);
    });

    it("should handle database errors", async () => {
      vi.mocked(todos.createTodo).mockRejectedValue(
        new Error("Database error")
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
        created_at: new Date().toISOString(),
      };
      vi.mocked(todos.updateTodo).mockResolvedValue(updatedTodo);

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTodo);
      expect(todos.updateTodo).toHaveBeenCalledWith(
        todoId,
        updateData.title,
        updateData.completed
      );
    });

    it("should return 404 when todo not found", async () => {
      const todoId = 999;
      vi.mocked(todos.updateTodo).mockRejectedValue(
        new TodoNotFoundError(todoId)
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
        created_at: new Date().toISOString(),
      };
      vi.mocked(todos.deleteTodo).mockResolvedValue(deletedTodo);

      const response = await request(app).delete(`/todos/${todoId}`);

      expect(response.status).toBe(204);
      expect(todos.deleteTodo).toHaveBeenCalledWith(todoId);
    });

    it("should return 404 when todo not found", async () => {
      const todoId = 999;
      vi.mocked(todos.deleteTodo).mockRejectedValue(
        new TodoNotFoundError(todoId)
      );

      const response = await request(app).delete(`/todos/${todoId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Todo with id 999 not found" });
    });
  });
});
