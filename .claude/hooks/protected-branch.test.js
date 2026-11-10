import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { needsConfirmation } from "./protected-branch.js";

const script = join(import.meta.dirname, "protected-branch.js");

describe("needsConfirmation", () => {
  it.each([
    ["git commit -m 'feat: x'", "main"],
    ["git commit -m 'feat: x'", "homolog"],
    ["git push", "main"],
    ["cd app && git commit -am wip", "homolog"],
    ["git -C /repo commit -m x", "main"],
    ["git push origin main", "feat/login"],
    ["git push origin feat/login:homolog", "feat/login"],
    ["git push -u origin HEAD:main", "develop"],
    ["git commit -m x && git push origin main", "feat/login"],
    ["git add -A && git commit -m x && git push origin homolog", "feat/login"],
  ])("pede confirmação para `%s` na branch %s", (command, branch) => {
    expect(needsConfirmation(command, branch)).toBe(true);
  });

  it.each([
    ["git commit -m 'feat: x'", "feat/login"],
    ["git push", "develop"],
    ["git push origin feat/login", "feat/login"],
    ["git push origin main-fix", "feat/login"],
    ["git status", "main"],
    ["git log --oneline", "main"],
    ["pnpm test", "main"],
    ["echo commit && git status", "main"],
  ])("deixa passar `%s` na branch %s", (command, branch) => {
    expect(needsConfirmation(command, branch)).toBe(false);
  });
});

describe("protected-branch como hook PreToolUse", () => {
  let repo;

  function runHook(command) {
    const payload = { hook_event_name: "PreToolUse", tool_name: "Bash", tool_input: { command }, cwd: repo };
    return spawnSync("node", [script], { input: JSON.stringify(payload), encoding: "utf8" });
  }

  beforeAll(() => {
    repo = mkdtempSync(join(tmpdir(), "protected-branch-"));
    execFileSync("git", ["init", "--quiet", "--initial-branch=main", repo]);
  });

  afterAll(() => rmSync(repo, { recursive: true, force: true }));

  it("responde `ask` com o motivo quando o commit é em branch protegida", () => {
    const result = runHook("git commit -m 'feat: x'");

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: expect.stringContaining("main"),
      },
    });
  });

  it("não escreve nada quando o comando não é commit nem push", () => {
    const result = runHook("git status");

    expect(result.status).toBe(0);
    expect(result.stdout).toBe("");
  });
});
