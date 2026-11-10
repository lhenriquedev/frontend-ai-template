export const maxFileLines = {
  meta: {
    type: "suggestion",
    messages: {
      tooLong:
        "Arquivo com {{lines}} linhas; o limite é {{max}}. Divida por responsabilidade, não por contagem: extraia um subcomponente para outro arquivo ou mova a lógica para um hook em hooks/ (.claude/rules/components.md).",
    },
    schema: [
      {
        type: "object",
        properties: { max: { type: "integer", minimum: 1 } },
        required: ["max"],
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const { max } = context.options[0];
    return {
      Program(node) {
        const { lines } = context.sourceCode;
        const count = lines.at(-1) === "" ? lines.length - 1 : lines.length;
        if (count > max) context.report({ node, messageId: "tooLong", data: { lines: count, max } });
      },
    };
  },
};
