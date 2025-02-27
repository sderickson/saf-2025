import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { client } from "./client.ts";
import type { RequestSchema, ResponseSchema } from "@saf/specs-apis";

type Todo = ResponseSchema<"getTodos">;
type CreateTodoRequest = RequestSchema<"createTodo">;
type UpdateTodoRequest = RequestSchema<"updateTodo">;

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await client.GET("/todos");
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoRequest>({
    mutationFn: async (todo) => {
      const { data } = await client.POST("/todos", { body: todo });
      if (!data) throw new Error("Failed to create todo");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, { id: number; todo: UpdateTodoRequest }>({
    mutationFn: async ({ id, todo }) => {
      const { data } = await client.PUT(`/todos/${id}` as "/todos/{id}", {
        body: todo,
      });
      if (!data) throw new Error("Failed to update todo");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const { data } = await client.DELETE(`/todos/${id}` as "/todos/{id}", {});
      if (!data) throw new Error("Failed to delete todo");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
