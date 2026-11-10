import process from "node:process";
import { execFileSync } from "node:child_process";
import { isEntryPoint, readHookInput } from "./hook-io.js";

const protectedBranches = ["homolog", "main"];
const gitWrite = /\bgit\b[^|;&]*?\s(commit|push)\b([^|;&]*)/g;
const namesProtectedBranch = new RegExp(`(^|[\\s:/+])(${protectedBranches.join("|")})(\\s|$)`);

export function needsConfirmation(command, currentBranch) {
  const writes = [...command.matchAll(gitWrite)];
  if (writes.length === 0) return false;
  if (protectedBranches.includes(currentBranch)) return true;
  return writes.some(([, verb, args]) => verb === "push" && namesProtectedBranch.test(args));
}

function currentBranchOf(cwd) {
  try {
    return execFileSync("git", ["symbolic-ref", "--short", "HEAD"], { cwd, encoding: "utf8", stdio: "pipe" }).trim();
  } catch {
    return "";
  }
}

function main() {
  const input = readHookInput();
  const command = input.tool_input?.command;
  if (typeof command !== "string") return;
  const branch = currentBranchOf(input.cwd);
  if (!needsConfirmation(command, branch)) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: `Commit ou push em branch protegida (${protectedBranches.join(", ")}; branch atual: ${branch || "desconhecida"}). Só com permissão explícita do dev nesta conversa (.claude/rules/general.md).`,
      },
    }),
  );
}

if (isEntryPoint(import.meta.url)) main();
