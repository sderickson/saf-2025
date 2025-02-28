import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "./todos.ts";
import { client } from "./client.ts";
import { withVueQuery } from "@saf/clients/test-utils";
import { QueryClient } from "@tanstack/vue-query";

// Mock the client
vi.mock("./client", () => ({
  client: {
    GET: vi.fn(),
    POST: vi.fn(),
    PUT: vi.fn(),
    DELETE: vi.fn(),
  },
}));

describe("todo requests", () => {
  const mockGET = client.GET as ReturnType<typeof vi.fn>;
  const mockPOST = client.POST as ReturnType<typeof vi.fn>;
  const mockPUT = client.PUT as ReturnType<typeof vi.fn>;
  const mockDELETE = client.DELETE as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGET.mockClear();
    mockPOST.mockClear();
    mockPUT.mockClear();
    mockDELETE.mockClear();
  });

  describe("useTodos", () => {
    it("should fetch todos", async () => {
      const mockTodos = [
        { id: 1, title: "Test Todo", completed: false },
        { id: 2, title: "Another Todo", completed: true },
      ];
      mockGET.mockResolvedValueOnce({ data: mockTodos });

      const [result, app] = withVueQuery(() => useTodos());
      await result.suspense();
      app.unmount();

      expect(mockGET).toHaveBeenCalledWith("/todos");
      expect(result.data.value).toEqual(mockTodos);
    });

    it("should return empty array when no todos exist", async () => {
      mockGET.mockResolvedValueOnce({ data: null });

      const [result, app] = withVueQuery(() => useTodos());
      await result.suspense();
      app.unmount();

      expect(mockGET).toHaveBeenCalledWith("/todos");
      expect(result.data.value).toEqual([]);
    });
  });

  describe("useCreateTodo", () => {
    const newTodo = {
      title: "New Todo",
      completed: false,
    };

    it("should create a new todo", async () => {
      const mockResponse = { id: 1, ...newTodo };
      mockPOST.mockResolvedValueOnce({ data: mockResponse });

      const [result, app] = withVueQuery(() => useCreateTodo());
      const response = await result.mutateAsync(newTodo);
      app.unmount();

      expect(mockPOST).toHaveBeenCalledWith("/todos", { body: newTodo });
      expect(response).toEqual(mockResponse);
    });

    it("should throw error when creation fails", async () => {
      mockPOST.mockResolvedValueOnce({ data: null });

      const [result, app] = withVueQuery(() => useCreateTodo());
      await expect(result.mutateAsync(newTodo)).rejects.toThrow(
        "Failed to create todo",
      );
      app.unmount();
    });
  });

  describe("useUpdateTodo", () => {
    const todoUpdate = {
      id: 1,
      todo: {
        title: "Updated Todo",
        completed: true,
      },
    };

    it("should update a todo", async () => {
      const mockResponse = { id: todoUpdate.id, ...todoUpdate.todo };
      mockPUT.mockResolvedValueOnce({ data: mockResponse });

      const [result, app] = withVueQuery(() => useUpdateTodo());
      const response = await result.mutateAsync(todoUpdate);
      app.unmount();

      expect(mockPUT).toHaveBeenCalledWith("/todos/1", {
        body: todoUpdate.todo,
      });
      expect(response).toEqual(mockResponse);
    });

    it("should throw error when update fails", async () => {
      mockPUT.mockResolvedValueOnce({ data: null });

      const [result, app] = withVueQuery(() => useUpdateTodo());
      await expect(result.mutateAsync(todoUpdate)).rejects.toThrow(
        "Failed to update todo",
      );
      app.unmount();
    });
  });

  describe("useDeleteTodo", () => {
    const todoId = 1;

    it("should delete a todo", async () => {
      mockDELETE.mockResolvedValueOnce({ data: {} });

      const [result, app] = withVueQuery(() => useDeleteTodo());
      await result.mutateAsync(todoId);
      app.unmount();

      expect(mockDELETE).toHaveBeenCalledWith("/todos/1", {});
    });

    it("should throw error when deletion fails", async () => {
      mockDELETE.mockResolvedValueOnce({ data: null });

      const [result, app] = withVueQuery(() => useDeleteTodo());
      await expect(result.mutateAsync(todoId)).rejects.toThrow(
        "Failed to delete todo",
      );
      app.unmount();
    });
  });

  describe("query cache behavior", () => {
    const mockTodos = [
      { id: 1, title: "Test Todo", completed: false },
      { id: 2, title: "Another Todo", completed: true },
    ];

    it("should cache query results", async () => {
      // Set up initial query response
      mockGET.mockResolvedValue({ data: mockTodos });

      // Create a shared query client with refetchOnMount disabled
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnMount: false,
            staleTime: Infinity, // Consider data as never stale
          },
          mutations: {
            retry: false,
          },
        },
      });

      // First query
      const [result1, app1] = withVueQuery(() => useTodos(), queryClient);
      await result1.suspense();

      // Verify first call
      expect(mockGET).toHaveBeenCalledTimes(1);

      // Second query should use cache
      const [result2, app2] = withVueQuery(() => useTodos(), queryClient);
      await result2.suspense();

      // Should still only have been called once
      expect(mockGET).toHaveBeenCalledTimes(1);

      // Verify both queries have the same data
      expect(result1.data.value).toEqual(mockTodos);
      expect(result2.data.value).toEqual(mockTodos);

      app1.unmount();
      app2.unmount();
    });

    it("should invalidate cache when creating a todo", async () => {
      // Set up initial todos
      mockGET.mockResolvedValue({ data: mockTodos });

      // Create a shared query client
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Initial query
      const [queryResult, queryApp] = withVueQuery(
        () => useTodos(),
        queryClient,
      );
      await queryResult.suspense();
      expect(mockGET).toHaveBeenCalledTimes(1);

      // Create new todo
      const newTodo = { title: "New Todo", completed: false };
      const mockResponse = { id: 3, ...newTodo };
      mockPOST.mockResolvedValueOnce({ data: mockResponse });

      const [mutationResult, mutationApp] = withVueQuery(
        () => useCreateTodo(),
        queryClient,
      );
      await mutationResult.mutateAsync(newTodo);

      // Wait for cache invalidation and verify refetch
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockGET).toHaveBeenCalledTimes(2);

      queryApp.unmount();
      mutationApp.unmount();
    });

    it("should invalidate cache when updating a todo", async () => {
      // Set up initial todos
      mockGET.mockResolvedValue({ data: mockTodos });

      // Create a shared query client
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Initial query
      const [queryResult, queryApp] = withVueQuery(
        () => useTodos(),
        queryClient,
      );
      await queryResult.suspense();
      expect(mockGET).toHaveBeenCalledTimes(1);

      // Update todo
      const todoUpdate = {
        id: 1,
        todo: { title: "Updated Todo", completed: true },
      };
      const mockResponse = { id: todoUpdate.id, ...todoUpdate.todo };
      mockPUT.mockResolvedValueOnce({ data: mockResponse });

      const [mutationResult, mutationApp] = withVueQuery(
        () => useUpdateTodo(),
        queryClient,
      );
      await mutationResult.mutateAsync(todoUpdate);

      // Wait for cache invalidation and verify refetch
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockGET).toHaveBeenCalledTimes(2);

      queryApp.unmount();
      mutationApp.unmount();
    });

    it("should invalidate cache when deleting a todo", async () => {
      // Set up initial todos
      mockGET.mockResolvedValue({ data: mockTodos });

      // Create a shared query client
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Initial query
      const [queryResult, queryApp] = withVueQuery(
        () => useTodos(),
        queryClient,
      );
      await queryResult.suspense();
      expect(mockGET).toHaveBeenCalledTimes(1);

      // Delete todo
      mockDELETE.mockResolvedValueOnce({ data: {} });

      const [mutationResult, mutationApp] = withVueQuery(
        () => useDeleteTodo(),
        queryClient,
      );
      await mutationResult.mutateAsync(1);

      // Wait for cache invalidation and verify refetch
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockGET).toHaveBeenCalledTimes(2);

      queryApp.unmount();
      mutationApp.unmount();
    });
  });
});
