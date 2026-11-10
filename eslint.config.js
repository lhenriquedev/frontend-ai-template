import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { featureStructure, noCrossFeatureImports } from "./eslint-rules/feature-boundaries.js";
import { noComments } from "./eslint-rules/no-comments.js";

const personalDataMessage = "Dado pessoal não vai para storage nem título (.claude/rules/personal-data.md).";

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
  { ignores: [".claude", "dist", "coverage", "playwright-report", "test-results", "src/app/route-tree.gen.ts"] },
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
      "no-console": "error",
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
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
          message: "const enum quebra com isolatedModules (.claude/rules/general.md).",
        },
      ],
      "no-restricted-globals": [
        "error",
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
      "shared não importa shell, features nem routes (docs/arquitetura.md).",
    ),
  },
  {
    files: ["src/app/features/**"],
    rules: layerImports(["shell", "routes"], "features não importam shell nem routes (docs/arquitetura.md)."),
  },
  {
    files: ["src/app/shell/**"],
    rules: layerImports(["routes"], "shell não importa routes (docs/arquitetura.md)."),
  },
  {
    files: ["src/app/**/*.tsx"],
    ignores: ["**/*.test.tsx"],
    rules: { "max-lines": ["error", { max: 250 }] },
  },
);
