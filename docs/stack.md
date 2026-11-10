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
- `max-file-lines`: arquivo `.tsx` com mais de 250 linhas.

Toda mensagem de regra diz o que fazer no lugar e aponta o doc. Regra nova segue o mesmo formato: o agente lê a mensagem e se corrige sozinho.

## Guard rails fora do lint

O que é proibição vira bloqueio de máquina; o texto das regras só explica o porquê.

| Onde | O que faz |
| --- | --- |
| `.claude/settings.json` (`permissions.deny`) | Barra edição de `route-tree.gen.ts`, leitura de `.env*`, `npm`, `yarn`, `git push --force` e `rm -rf`. |
| `.claude/hooks/protected-branch.js` (PreToolUse) | Commit ou push em `homolog`/`main` pede confirmação do dev. |
| `.claude/hooks/lint-on-edit.js` (PostToolUse) | ESLint e Prettier no arquivo que o agente acabou de editar. |
| `.claude/hooks/verify-on-stop.js` (Stop) | Com código alterado, o agente só encerra com tipos, lint, formatação e testes ligados passando. Vale uma rodada por turno. |
| `.githooks/pre-commit` | ESLint e Prettier nos arquivos do commit, mais `tsc`. Ativado pelo `prepare` (`core.hooksPath`). |
| `preinstall` | Instalação fora do pnpm falha. |

Clone que já tinha `node_modules` antes do pre-commit existir: rode `pnpm run prepare` uma vez (o pnpm pula o `prepare` quando a instalação já está em dia). O pre-commit confere o arquivo como está no disco, não só o trecho que entrou no commit. O hook de branch lê a branch antes do comando rodar: `git checkout main && git commit` num comando só passa por ele.

Os hooks do Claude Code só valem para o Claude Code. Para qualquer agente ou pessoa, a barreira é o pre-commit, o CI e a proteção de branch no servidor.
