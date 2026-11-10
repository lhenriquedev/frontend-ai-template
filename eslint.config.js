import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { featureStructure, noCrossFeatureImports } from "./eslint-rules/feature-boundaries.js";
import { maxFileLines } from "./eslint-rules/max-file-lines.js";
import { noComments } from "./eslint-rules/no-comments.js";

const personalDataMessage =
  "Dado pessoal não vai para storage nem título. Dado revelado fica em useState da tela e some ao sair dela (.claude/rules/personal-data.md).";
const consoleMessage =
  "console é proibido: dado pessoal vaza no log. Erro vai para o estado de erro da rota ou da tela; log de depuração sai antes de concluir (.claude/rules/personal-data.md).";
const typeAssertionMessage =
  "Asserção de tipo é proibida. Dado que vem de fora: valide com o schema Zod (`schema.parse(valor)`). Dado interno: estreite com type guard ou corrija o tipo na origem. `as const` e `satisfies` continuam liberados (.claude/rules/general.md).";

function layerImports(forbidden, message) {
  return {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: forbidden.flatMap((layer) => [`@app/${layer}`, `@app/${layer}/*`, `**/${layer}`, `**/${layer}/*`]),
            message,
          },
        ],
      },
    ],
  };
}

export default tseslint.config(
  {
    ignores: [
      ".claude/worktrees",
      "dist",
      "coverage",
      "playwright-report",
      "test-results",
      "src/app/route-tree.gen.ts",
    ],
  },
  js.configs.recommended,
  tseslint.configs.strict,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.tsx"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-duplicate-type-constituents": "error",
    },
  },
  {
    plugins: {
      local: {
        rules: {
          "max-file-lines": maxFileLines,
          "no-comments": noComments,
          "feature-structure": featureStructure,
          "no-cross-feature-imports": noCrossFeatureImports,
        },
      },
    },
    rules: {
      "local/no-comments": "error",
      "local/feature-structure": "error",
      "local/no-cross-feature-imports": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: "dangerouslySetInnerHTML é proibido (.claude/rules/personal-data.md).",
        },
        {
          selector: "CallExpression[callee.property.name='useLoaderData'], CallExpression[callee.name='useLoaderData']",
          message:
            "Leia o dado com useSuspenseQuery ou useQuery: o loader só aquece o cache (.claude/rules/routing.md).",
        },
        {
          selector: "TSEnumDeclaration[const=true]",
          message:
            "const enum quebra com isolatedModules. Use `enum` de string ou `z.enum([...])` (.claude/rules/general.md).",
        },
        { selector: "TSAsExpression[typeAnnotation.typeName.name!='const']", message: typeAssertionMessage },
        { selector: "TSTypeAssertion[typeAnnotation.typeName.name!='const']", message: typeAssertionMessage },
      ],
      "no-restricted-globals": [
        "error",
        { name: "console", message: consoleMessage },
        { name: "localStorage", message: personalDataMessage },
        { name: "sessionStorage", message: personalDataMessage },
        { name: "indexedDB", message: personalDataMessage },
      ],
      "no-restricted-properties": [
        "error",
        { object: "window", property: "localStorage", message: personalDataMessage },
        { object: "window", property: "sessionStorage", message: personalDataMessage },
        { object: "window", property: "indexedDB", message: personalDataMessage },
        { object: "document", property: "title", message: personalDataMessage },
      ],
    },
  },
  {
    files: ["src/app/shared/**"],
    rules: layerImports(
      ["shell", "features", "routes"],
      "shared não importa shell, features nem routes. Receba o que precisa por props ou parâmetro; shared não conhece o produto (docs/arquitetura.md).",
    ),
  },
  {
    files: ["src/app/features/**"],
    rules: layerImports(
      ["shell", "routes"],
      "features não importam shell nem routes. Código comum sobe para shared; o que vem do shell chega por props ou contexto (docs/arquitetura.md).",
    ),
  },
  {
    files: ["src/app/shell/**"],
    rules: layerImports(
      ["routes"],
      "shell não importa routes. É a rota que monta o shell: passe o que o shell precisa por props ou contexto do router (docs/arquitetura.md).",
    ),
  },
  {
    files: ["src/app/**/*.tsx"],
    ignores: ["**/*.test.tsx"],
    rules: { "local/max-file-lines": ["error", { max: 250 }] },
  },
);
