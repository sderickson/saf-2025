import { createApp, App } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

/**
 * Helper function to test Vue Query composables in isolation
 *
 * @param composable - The composable function to test
 * @param queryClient - Optional custom query client
 * @returns A tuple containing the composable result, the Vue app instance, and the query client
 */
export function withVueQuery<T>(
  composable: () => T,
  queryClient?: any // TODO: Make this QueryClient instead
): [T, App<Element>, any] {
  let result!: T;
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
        queries: {
          retry: false,
        },
      },
    });

  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });

  app.use(VueQueryPlugin, { queryClient: client });
  app.mount(document.createElement("div"));

  return [result, app, client];
}
