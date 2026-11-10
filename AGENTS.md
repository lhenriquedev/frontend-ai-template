# {{PROJECT_NAME}}

Leia antes de escrever código:

- `.claude/rules/`: regras de escrita. `general.md` vale sempre; `project.md` traz o que é só deste projeto (domínio, backend, branches).
- `docs/arquitetura.md`: antes de criar arquivo, pasta ou feature. Diz onde cada coisa mora e quem importa quem.
- `docs/stack.md`: antes de escolher ou instalar uma lib.
- `docs/adr/`: decisões com a alternativa descartada. Leia as da área em que vai mexer.
- `GLOSSARY.md`: vocabulário do domínio, usado em código, nomes e textos.

## Comandos

Gerenciador: **pnpm** (nunca npm/yarn). Node 26 LTS.

- `pnpm dev`: Vite local (modo da API vem de `VITE_API_MODE`)
- `pnpm check`: `tsc --noEmit` + ESLint + `prettier --check` + knip (o que o CI roda)
- `pnpm test` / `pnpm test:coverage`: Vitest (`*.test.ts(x)` ao lado do código)
- `pnpm test:e2e`: Playwright (`e2e/`, chromium). Porta 5173 ocupada por outro projeto? `E2E_PORT=5184 pnpm test:e2e`
- `pnpm verify`: check + test + build. Rode antes de concluir.

## O que o lint barra

Imports com alias `@app/` (`@app/shared/ui/empty`). `src/app/route-tree.gen.ts` é gerado: nunca edite.

- Camada importando a de cima, e feature importando outra feature.
- Arquivo solto na raiz de uma feature, pasta fora de `api`, `components`, `hooks`, `pages`, `schemas`, `testing`, e `index` de reexportação.
- Comentário sem `// simplified:` ou `// workaround:`, `console`, storage do navegador, `as`, `useLoaderData`, arquivo `.tsx` com mais de 250 linhas.

## Design system

Fonte da verdade: `src/app/shell/styles/base.css` (tokens) e `src/app/shared/ui/` (componentes). Toda cor nova entra como token no `base.css`; componente usa o token. Componente shadcn novo: `pnpm dlx shadcn@latest add <nome>`.

## Agent skills

O fluxo espera instalados no Claude Code: `mattpocock-skills` (`tdd`, `diagnosing-bugs`, `code-review`, `domain-modeling`), `frontend-design` e o MCP `playwright`.

Como as skills consomem o glossário e os ADRs: `docs/agents/domain.md`.
