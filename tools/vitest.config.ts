import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/*.js"],
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
