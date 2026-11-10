import { defineConfig, devices } from "@playwright/test";

// workaround: 5173 may be taken by another project's dev server; with reuseExistingServer the suite would run against the wrong app
const port = process.env["E2E_PORT"] ?? "5173";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  workers: process.env["CI"] ? 2 : "50%",
  forbidOnly: Boolean(process.env["CI"]),
  reporter: process.env["CI"] ? [["html", { open: "never" }], ["github"]] : "list",
  use: { baseURL: `http://localhost:${port}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // workaround: the dev server transforms each module on request and becomes the bottleneck with parallel workers; the built bundle runs the suite ~40% faster
    command: `pnpm exec vite build && pnpm exec vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env["CI"],
  },
});
