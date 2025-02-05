import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Add an "exclude" option if there are files that should not be included in the coverage report
    },
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
