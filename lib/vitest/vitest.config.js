import { defineConfig } from "vitest/config";

export const defaultConfig = defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/**", "dist/**", "**/*.test.ts", "migrations/**"],
    },
  },
});
