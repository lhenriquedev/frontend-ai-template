import process from "node:process";
import { execFileSync } from "node:child_process";
import { codeFile, failedOutput, isEntryPoint, readHookInput, scriptFile } from "./hook-io.js";

const maxOutputLength = 6000;

export function changedFiles(porcelain) {
  const entries = porcelain.split("\0").filter(Boolean);
  const files = [];
  for (let index = 0; index < entries.length; index++) {
    const status = entries[index].slice(0, 2);
    files.push({ path: entries[index].slice(3), isDeleted: status.includes("D") });
    if (/[RC]/.test(status)) index++;
  }
  return files;
}

export function checksFor(files) {
  const code = files.filter((file) => codeFile.test(file.path));
  if (code.length === 0) return [];
  const present = code.filter((file) => !file.isDeleted).map((file) => file.path);
  const scripts = present.filter((path) => scriptFile.test(path));
  return [
    ["tsc", "--noEmit"],
    ...(scripts.length > 0 ? [["eslint", "--no-warn-ignored", ...scripts]] : []),
    ...(present.length > 0 ? [["prettier", "--check", "--ignore-unknown", ...present]] : []),
    ...(scripts.length > 0 ? [["vitest", "related", "--run", "--passWithNoTests", ...scripts]] : []),
  ];
}

function main() {
  const input = readHookInput();
  if (input.stop_hook_active) return;
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
  const porcelain = execFileSync("git", ["status", "--porcelain", "-z", "--untracked-files=all"], {
    cwd: projectDir,
    encoding: "utf8",
  });
  const failures = failedOutput(projectDir, checksFor(changedFiles(porcelain)));
  if (!failures) return;
  process.stderr.write(
    `Verificação falhou nos arquivos alterados (tipos, lint, formatação ou testes ligados).\n\n${failures.slice(0, maxOutputLength)}\n\nSe a falha veio do seu trabalho, corrija antes de encerrar. Se já existia ou está em arquivo que você não tocou, não corrija: relate ao dev.\n`,
  );
  process.exitCode = 2;
}

if (isEntryPoint(import.meta.url)) main();
