import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@app": resolve(import.meta.dirname, "src/app") } },
  test: {
    include: ["src/**/*.test.{ts,tsx}", "eslint-rules/**/*.test.js"],
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**"],
      reporter: ["text-summary", "html"],
    },
  },
});
