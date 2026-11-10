const allowedPrefixes = ["simplified:", "workaround:", "eslint-disable", "eslint-enable"];

export const noComments = {
  meta: {
    type: "suggestion",
    messages: {
      forbidden:
        "Comentário proibido. Apague e deixe o nome dizer o quê. Se for um porquê não óbvio, escreva `// simplified: <o que ficou de fora e por quê>` ou `// workaround: <motivo>` (AGENTS.md).",
    },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (allowedPrefixes.some((prefix) => comment.value.trim().startsWith(prefix))) continue;
          context.report({ loc: comment.loc, messageId: "forbidden" });
        }
      },
    };
  },
};
