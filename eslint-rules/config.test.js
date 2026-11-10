import { ESLint } from "eslint";
import { describe, expect, it, vi } from "vitest";

vi.setConfig({ testTimeout: 60_000 });

const eslint = new ESLint();

async function messagesFor(code, filePath = "src/app/env.ts") {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((message) => message.message);
}

describe("mensagens do ESLint dizem como corrigir", () => {
  it("asserção `as` aponta para a validação com Zod", async () => {
    const messages = await messagesFor("export const total = JSON.parse('1') as number;\n");

    expect(messages).toEqual([expect.stringContaining(".parse(")]);
  });

  it("asserção com colchetes angulares também é barrada", async () => {
    const messages = await messagesFor("export const total = <number>JSON.parse('1');\n");

    expect(messages).toEqual([expect.stringContaining(".parse(")]);
  });

  it("`as const` e `satisfies` continuam liberados", async () => {
    const code = "export const sizes = ['sm', 'lg'] as const;\nexport const total = 1 satisfies number;\n";

    expect(await messagesFor(code)).toEqual([]);
  });

  it("console aponta para onde o erro deve ir", async () => {
    const messages = await messagesFor("console.log('x');\n");

    expect(messages).toEqual([expect.stringContaining("personal-data.md")]);
  });

  it("import de camada de cima diz o que fazer no lugar", async () => {
    const messages = await messagesFor(
      'import { HomePage } from "@app/features/home/pages/home-page";\nexport const page = HomePage;\n',
      "src/app/shared/lib/utils.ts",
    );

    expect(messages).toEqual([expect.stringContaining("props")]);
  });
});
