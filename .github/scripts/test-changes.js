import { execFileSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const testFile = /\.(test|spec)\.(ts|tsx|js)$/;

export function changedExistingTests(numstat) {
  return numstat
    .split("\0")
    .filter(Boolean)
    .map((record) => {
      const [, removed, ...pathParts] = record.split("\t");
      return { path: pathParts.join("\t"), removedLines: Number(removed) };
    })
    .filter(({ path, removedLines }) => testFile.test(path) && removedLines > 0);
}

function escapeProperty(value) {
  return value
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A")
    .replaceAll(":", "%3A")
    .replaceAll(",", "%2C");
}

export function warningFor({ path, removedLines }) {
  return `::warning file=${escapeProperty(path)},title=Teste existente alterado::${removedLines} linha(s) removida(s) ou alterada(s) em teste que já existia. Confira se o teste não foi enfraquecido para passar (.claude/rules/general.md).`;
}

function main() {
  const numstat = execFileSync("git", ["diff", "--numstat", "--no-renames", "-z", `${process.env.BASE_REF}...HEAD`], {
    encoding: "utf8",
  });
  const warnings = changedExistingTests(numstat).map(warningFor);
  if (warnings.length > 0) process.stdout.write(`${warnings.join("\n")}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
