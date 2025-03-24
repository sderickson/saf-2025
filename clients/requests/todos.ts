import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { client } from "./client.ts";
import type { RequestSchema, ResponseSchema } from "@saf-2025/specs-apis";

type Todos = ResponseSchema<"getTodos", 200>;
type CreateTodoRequest = RequestSchema<"createTodo">;
type UpdateTodoRequest = RequestSchema<"updateTodo">;

export function useTodos() {
  return useQuery<Todos>({
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

  return useMutation({
    mutationFn: async (todo: CreateTodoRequest) => {
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

  return useMutation({
    mutationFn: async ({
      id,
      todo,
    }: {
      id: number;
      todo: UpdateTodoRequest;
    }) => {
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
