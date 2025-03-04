# Adding Queries

All queries should live in the /clients/requests folder. This folder is responsible for interfacing with all remote resources, and it uses `tanstack/vue-query` in conjunction with `openapi-fetch` to do this.

Queries should be of the format:

```ts
// client.ts is a simple file that create an openapi-fetch client with openapi specs
import { client } from "./client.ts";

export const useGetFoos = (
  // parameters should be refs so that reactivity works
  fooId: Ref<number>,
  // expose options that aren't handled by this convenience function
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["foos", fooId],
    queryFn: async () => {
      // openapi-fetch does not throw errors
      const { data, error } = await client.GET("/foos/{fooId}", {
        params: {
          path: { fooId: fooId.value },
        },
      });

      // tanstack query expects thrown errors, though, so do so
      if (error) {
        throw error;
      }

      return data as ResponseSchema<"getUserSettings">;
    },
    ...options,
  });
};
```

Mutations are similar:

```ts
export type CreateFooRequest = RequestSchema<"createFoo">;

export function useCreateFoo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callSeries: CreateFooRequest) => {
      const { data, error } = await client.POST("/foo", {
        body: callSeries,
      });
      if (error) {
        throw error;
      }
      if (!data) throw new Error("Failed to create call series");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foos"] });
    },
  });
}
```
