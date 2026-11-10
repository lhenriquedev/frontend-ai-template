const allowedPrefixes = ["simplified:", "workaround:", "eslint-disable", "eslint-enable"];

export const noComments = {
  meta: {
    type: "suggestion",
    messages: {
      forbidden: "Comentário proibido. Só `// simplified:` ou `// workaround:` com o porquê.",
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
