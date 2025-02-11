import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { client } from "./client";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

interface CreateTodoRequest {
  title: string;
}

interface UpdateTodoRequest {
  title: string;
  completed: boolean;
}

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await client.GET("/todos");
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
      await client.DELETE(`/todos/${id}` as "/todos/{id}", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
