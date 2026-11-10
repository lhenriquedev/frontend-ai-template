import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { changedExistingTests, warningFor } from "./test-changes.js";

vi.setConfig({ testTimeout: 60_000 });

const script = join(import.meta.dirname, "test-changes.js");

describe("changedExistingTests", () => {
  it("aponta teste existente que perdeu linhas", () => {
    const numstat = "2\t3\tsrc/app/orders.test.ts\0";

    expect(changedExistingTests(numstat)).toEqual([{ path: "src/app/orders.test.ts", removedLines: 3 }]);
  });

  it("aponta spec de e2e removido", () => {
    expect(changedExistingTests("0\t40\te2e/login.spec.ts\0")).toEqual([
      { path: "e2e/login.spec.ts", removedLines: 40 },
    ]);
  });

  it("ignora teste novo e teste que só ganhou linhas", () => {
    const numstat = "30\t0\tsrc/app/new.test.tsx\0" + "5\t0\tsrc/app/orders.test.ts\0";

    expect(changedExistingTests(numstat)).toEqual([]);
  });

  it("ignora arquivo que não é teste e arquivo binário", () => {
    const numstat = "1\t9\tsrc/app/orders.ts\0" + "-\t-\tsrc/assets/logo.test.png\0";

    expect(changedExistingTests(numstat)).toEqual([]);
  });
});

describe("warningFor", () => {
  it("gera a anotação de aviso do GitHub com o arquivo e a contagem", () => {
    const warning = warningFor({ path: "src/app/orders.test.ts", removedLines: 3 });

    expect(warning).toMatch(/^::warning file=src\/app\/orders\.test\.ts,title=[^:]+::3 linha/);
  });

  it("escapa caracteres que quebrariam o comando do workflow", () => {
    const warning = warningFor({ path: "src/a,b\n::error::x.test.ts", removedLines: 1 });

    expect(warning.split("\n")).toHaveLength(1);
    expect(warning).toContain("file=src/a%2Cb%0A%3A%3Aerror%3A%3Ax.test.ts,");
  });
});

describe("test-changes no CI", () => {
  let repository;

  function git(...args) {
    execFileSync("git", args, { cwd: repository, stdio: "ignore" });
  }

  function runScript() {
    return spawnSync("node", [script], {
      cwd: repository,
      encoding: "utf8",
      env: { ...process.env, BASE_REF: "main" },
    });
  }

  beforeEach(() => {
    repository = mkdtempSync(join(tmpdir(), "test-changes-"));
    git("init", "-q", "-b", "main");
    git("config", "user.email", "ci@example.com");
    git("config", "user.name", "ci");
    writeFileSync(join(repository, "orders.test.ts"), "it('a', () => {});\nit('b', () => {});\n");
    git("add", "-A");
    git("commit", "-q", "-m", "base");
    git("checkout", "-q", "-b", "feature");
  });

  afterEach(() => {
    rmSync(repository, { recursive: true, force: true });
  });

  it("avisa sem falhar quando o PR remove linha de teste existente", () => {
    writeFileSync(join(repository, "orders.test.ts"), "it('a', () => {});\n");
    git("commit", "-q", "-am", "remove teste");

    const result = runScript();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("::warning file=orders.test.ts,");
  });

  it("fica em silêncio quando o PR só adiciona teste", () => {
    writeFileSync(join(repository, "new.test.ts"), "it('c', () => {});\n");
    git("add", "-A");
    git("commit", "-q", "-m", "teste novo");

    const result = runScript();

    expect(result.status).toBe(0);
    expect(result.stdout).toBe("");
  });
});
