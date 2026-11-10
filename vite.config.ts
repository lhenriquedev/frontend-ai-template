import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { parseEnv } from "./src/app/env-schema.ts";

export default defineConfig(({ mode }) => {
  parseEnv(loadEnv(mode, process.cwd(), "VITE_"));

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "src/app/routes",
        generatedRouteTree: "src/app/route-tree.gen.ts",
        routeFileIgnorePattern: "\\.test\\.",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: { alias: { "@app": resolve(import.meta.dirname, "src/app") } },
  };
});
