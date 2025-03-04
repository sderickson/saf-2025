import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [vue(), vuetify()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        // main and router files don't need to be unit tested
        // prefer e2e tests for those.
        "**/main.ts",
        "**/router.ts",

        // Clearly these don't need to be unit tested
        "*.config.*",
        "**/*.d.ts",
        "**/__mocks__",
      ],
    },
    deps: {
      inline: ["vuetify"],
    },
    mockReset: true,
  },
});
