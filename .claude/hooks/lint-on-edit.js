import process from "node:process";
import { relative, sep } from "node:path";
import { codeFile, failedOutput, isEntryPoint, readHookInput } from "./hook-io.js";

export function isCheckable(filePath, projectDir) {
  const segments = relative(projectDir, filePath).split(sep);
  return segments[0] !== ".." && !segments.includes("node_modules") && codeFile.test(filePath);
}

function main() {
  const input = readHookInput();
  const filePath = input.tool_input?.file_path;
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
  if (typeof filePath !== "string" || !isCheckable(filePath, projectDir)) return;
  const failures = failedOutput(projectDir, [
    ["eslint", "--no-warn-ignored", filePath],
    ["prettier", "--check", "--ignore-unknown", filePath],
  ]);
  if (!failures) return;
  process.stderr.write(`${failures}\n\nCorrija antes de seguir. Formatação: rode \`pnpm format\`.\n`);
  process.exitCode = 2;
}

if (isEntryPoint(import.meta.url)) main();
