import process from "node:process";
import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { isCheckable } from "./lint-on-edit.js";

const projectDir = resolve(import.meta.dirname, "../..");
const script = join(import.meta.dirname, "lint-on-edit.js");
const fixture = join(import.meta.dirname, "lint-on-edit.fixture.js");

describe("isCheckable", () => {
  it.each(["/repo/src/app/features/orders/pages/order-page.tsx", "/repo/package.json", "/repo/eslint.config.js"])(
    "confere %s",
    (filePath) => {
      expect(isCheckable(filePath, "/repo")).toBe(true);
    },
  );

  it.each(["/repo/README.md", "/outro/src/app/main.tsx", "/repo/node_modules/zod/index.js", "/repo-2/src/main.ts"])(
    "ignora %s",
    (filePath) => {
      expect(isCheckable(filePath, "/repo")).toBe(false);
    },
  );
});

describe("lint-on-edit como hook PostToolUse", () => {
  function runHook(filePath) {
    const payload = { hook_event_name: "PostToolUse", tool_name: "Write", tool_input: { file_path: filePath } };
    return spawnSync("node", [script], {
      input: JSON.stringify(payload),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    });
  }

  afterEach(() => rmSync(fixture, { force: true }));

  it("sai com 2 e devolve o erro de lint no stderr", () => {
    writeFileSync(fixture, "console.log(1);\n");

    const result = runHook(fixture);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("lint-on-edit.fixture.js");
    expect(result.stderr).toContain("console");
    expect(result.stdout).toBe("");
  }, 30_000);

  it("sai com 2 quando o arquivo está fora do padrão do Prettier", () => {
    writeFileSync(fixture, "export const   total = 1\n");

    const result = runHook(fixture);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("pnpm format");
  }, 30_000);

  it("sai com 0 e em silêncio quando o arquivo passa", () => {
    writeFileSync(fixture, "export const total = 1;\n");

    const result = runHook(fixture);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  }, 30_000);

  it("não roda nada para arquivo fora do conjunto conferido", () => {
    const result = runHook(join(projectDir, "README.md"));

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });
});
