import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

export function withVueQuery(composable: () => unknown) {
  let result;
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
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

  app.use(VueQueryPlugin, { queryClient });
  app.mount(document.createElement("div"));

  return [result, app] as const;
}
