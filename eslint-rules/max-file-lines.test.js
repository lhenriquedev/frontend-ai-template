import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import { maxFileLines } from "./max-file-lines.js";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();
const linesOfCode = (count) => Array.from({ length: count }, (_, index) => `export const a${index} = ${index};`);

ruleTester.run("max-file-lines", maxFileLines, {
  valid: [
    { code: linesOfCode(3).join("\n"), options: [{ max: 3 }] },
    { code: `${linesOfCode(3).join("\n")}\n`, options: [{ max: 3 }] },
  ],
  invalid: [
    {
      code: `${linesOfCode(4).join("\n")}\n`,
      options: [{ max: 3 }],
      errors: [{ messageId: "tooLong", data: { lines: 4, max: 3 } }],
    },
  ],
});
