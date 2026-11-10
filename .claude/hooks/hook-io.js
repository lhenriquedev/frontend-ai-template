import process from "node:process";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const codeFile = /\.(ts|tsx|js|jsx|css|json)$/;
export const scriptFile = /\.(ts|tsx|js|jsx)$/;

export function readHookInput() {
  return JSON.parse(readFileSync(0, "utf8"));
}

export function isEntryPoint(moduleUrl) {
  return process.argv[1] === fileURLToPath(moduleUrl);
}

export function failedOutput(projectDir, commands) {
  return commands
    .map((args) => spawnSync("pnpm", ["exec", ...args], { cwd: projectDir, encoding: "utf8" }))
    .filter((result) => result.status !== 0)
    .map((result) => `${result.stdout}${result.stderr}`.trim())
    .join("\n\n");
}
