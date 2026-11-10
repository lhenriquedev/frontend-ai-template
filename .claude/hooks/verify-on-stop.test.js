import process from "node:process";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { changedFiles, checksFor } from "./verify-on-stop.js";

vi.setConfig({ testTimeout: 60_000 });

const script = join(import.meta.dirname, "verify-on-stop.js");

describe("changedFiles", () => {
  it("lê modificados, novos, apagados e renomeados do `git status --porcelain -z`", () => {
    const porcelain = " M src/a.ts\0?? src/b.tsx\0 D src/c.ts\0R  src/new.ts\0src/old.ts\0A  docs/x.md\0";

    expect(changedFiles(porcelain)).toEqual([
      { path: "src/a.ts", isDeleted: false },
      { path: "src/b.tsx", isDeleted: false },
      { path: "src/c.ts", isDeleted: true },
      { path: "src/new.ts", isDeleted: false },
      { path: "docs/x.md", isDeleted: false },
    ]);
  });

  it("devolve lista vazia com a árvore limpa", () => {
    expect(changedFiles("")).toEqual([]);
  });
});

describe("checksFor", () => {
  it("não confere nada quando só mudou documentação", () => {
    expect(checksFor([{ path: "README.md", isDeleted: false }])).toEqual([]);
  });

  it("roda tipos, lint, formatação e testes ligados nos arquivos alterados", () => {
    const files = [
      { path: "src/a.ts", isDeleted: false },
      { path: "src/base.css", isDeleted: false },
      { path: "README.md", isDeleted: false },
    ];

    expect(checksFor(files)).toEqual([
      ["tsc", "--noEmit"],
      ["eslint", "--no-warn-ignored", "src/a.ts"],
      ["prettier", "--check", "--ignore-unknown", "src/a.ts", "src/base.css"],
      ["vitest", "related", "--run", "--passWithNoTests", "src/a.ts"],
    ]);
  });

  it("só confere tipos quando o código alterado foi apagado", () => {
    expect(checksFor([{ path: "src/a.ts", isDeleted: true }])).toEqual([["tsc", "--noEmit"]]);
  });
});

describe("verify-on-stop como hook Stop", () => {
  let repo;

  function runHook(payload) {
    return spawnSync("node", [script], {
      input: JSON.stringify({ hook_event_name: "Stop", stop_hook_active: false, ...payload }),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PROJECT_DIR: repo },
    });
  }

  beforeEach(() => {
    repo = mkdtempSync(join(tmpdir(), "verify-on-stop-"));
    execFileSync("git", ["init", "--quiet", repo]);
  });

  afterEach(() => rmSync(repo, { recursive: true, force: true }));

  it("sai com 2 e orienta o agente quando a verificação do código alterado falha", () => {
    writeFileSync(join(repo, "broken.ts"), "export const total: number = 'um';\n");

    const result = runHook({});

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("relate ao dev");
    expect(result.stdout).toBe("");
  }, 30_000);

  it("deixa encerrar quando já está continuando por causa do próprio hook", () => {
    writeFileSync(join(repo, "broken.ts"), "export const total: number = 'um';\n");

    const result = runHook({ stop_hook_active: true });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });

  it("deixa encerrar com a árvore limpa ou só com documentação alterada", () => {
    writeFileSync(join(repo, "notes.md"), "# notas\n");

    const result = runHook({});

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });
});
