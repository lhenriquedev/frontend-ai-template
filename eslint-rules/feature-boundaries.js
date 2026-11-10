import { dirname, resolve } from "node:path";

const featureFile = /[\\/]src[\\/]app[\\/]features[\\/]([^\\/]+)[\\/](.+)$/;
const featureImport = /^@app\/features\/([^/]+)/;
const featureFolders = ["api", "components", "hooks", "pages", "schemas", "testing"];

function featureOf(filename) {
  const match = featureFile.exec(filename);
  return match ? { name: match[1], segments: match[2].split(/[\\/]/) } : null;
}

function importedFeature(source, filename) {
  const aliased = featureImport.exec(source);
  if (aliased) return aliased[1];
  if (!source.startsWith(".")) return null;
  return featureOf(resolve(dirname(filename), source, "file"))?.name ?? null;
}

export const featureStructure = {
  meta: {
    type: "problem",
    messages: {
      loose: `Arquivo solto na raiz da feature. Mova para uma das pastas: ${featureFolders.join(", ")} (docs/arquitetura.md).`,
      folder: `Pasta fora do conjunto da feature. Mova o arquivo para uma das pastas: ${featureFolders.join(", ")} (docs/arquitetura.md).`,
      barrel:
        "Feature não tem index de reexportação. Apague este arquivo e importe cada arquivo direto pelo caminho dele (docs/arquitetura.md).",
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const feature = featureOf(context.filename);
        if (!feature) return;
        if (feature.segments.length === 1) return context.report({ node, messageId: "loose" });
        if (!featureFolders.includes(feature.segments[0])) return context.report({ node, messageId: "folder" });
        if (/^index\.[jt]sx?$/.test(feature.segments.at(-1))) context.report({ node, messageId: "barrel" });
      },
    };
  },
};

export const noCrossFeatureImports = {
  meta: {
    type: "problem",
    messages: {
      crossFeature:
        "A feature {{from}} não importa a feature {{to}}. Código comum sobe para shared (docs/arquitetura.md).",
    },
    schema: [],
  },
  create(context) {
    const feature = featureOf(context.filename);
    if (!feature) return {};

    function check(node) {
      if (typeof node.source?.value !== "string") return;
      const target = importedFeature(node.source.value, context.filename);
      if (target === null || target === feature.name) return;
      context.report({ node, messageId: "crossFeature", data: { from: feature.name, to: target } });
    }

    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};
