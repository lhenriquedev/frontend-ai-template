# Stack

O que usamos, para quê, e o que já está instalado. Versões exatas: `package.json`.

| Camada | Lib | Por que esta | Instalada |
| --- | --- | --- | --- |
| Build | Vite + TypeScript estrito | SPA sem servidor; `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes` ligados | sim |
| Rotas | TanStack Router (file-based) | rota, params e search tipados; code splitting automático | sim |
| Dados do servidor | TanStack Query | cache, dedupe e revalidação; o router só aquece o cache | sim |
| Contratos e validação | Zod 4 | o schema é a única fonte do tipo; valida toda fronteira | sim |
| HTTP | axios | interceptors para sessão e erro num lugar só | na primeira API |
| UI | Tailwind 4 + shadcn (Base UI) + lucide | componentes copiados para o repo, donos dos próprios tokens | sim |
| Formulários | React Hook Form + `@hookform/resolvers` | validação pelo mesmo schema Zod | no primeiro formulário |
| Estado do cliente | Zustand | só para o que não é do servidor nem da URL | quando precisar |
| Testes unitários | Vitest + Testing Library (jsdom) | ao lado do código | sim |
| Testes E2E | Playwright + axe | fluxo real e WCAG 2.2 AA | sim |
| Qualidade | ESLint (typescript-eslint strict, jsx-a11y, regras locais), Prettier, knip | o que dá para barrar por máquina não depende de revisão | sim |
| Runtime | Node 26 LTS, pnpm 11 | `.tool-versions` | sim |

## Libs aprovadas e ainda não instaladas

axios, React Hook Form, `@hookform/resolvers` e Zustand entram na primeira feature que usar. O knip falha com dependência sem uso, por isso não vêm instaladas.

## Lib nova

Qualquer lib fora desta tabela: pergunte ao dev antes, dizendo qual, para quê, e por que a plataforma, o que já está instalado ou uma linha de código não resolvem.

## Regras locais do ESLint (`eslint-rules/`)

- `no-comments`: comentário só com `// simplified:` ou `// workaround:` e o porquê.
- `feature-structure`: arquivo de feature fora das pastas fixas, ou `index` de reexportação.
- `no-cross-feature-imports`: feature importando outra feature.
