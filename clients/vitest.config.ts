import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue(), vuetify()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "dist/"],
    },
    deps: {
      inline: ["vuetify"],
    },
    mockReset: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      ".css": fileURLToPath(
        new URL("./test/__mocks__/fileMock.ts", import.meta.url),
      ),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
