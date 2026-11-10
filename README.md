# frontend-ai-template

Template de frontend (React + Vite + TypeScript) com as regras, o ferramental e o CI já prontos para trabalhar com agentes de código. Um projeto novo nasce passando em `pnpm verify`.

## Começando um projeto novo

1. No GitHub: **Use this template** → crie o repositório e clone.
2. `corepack enable && pnpm install && cp .env.example .env`
3. Troque os placeholders. `grep -rnE '\{\{[A-Z_]+\}\}' --exclude-dir=node_modules --exclude-dir=.github .` lista os nomeados:
   - `{{PROJECT_NAME}}`, `{{PROJECT_TITLE}}`: `AGENTS.md`, `index.html`, `.claude/rules/project.md`
   - `name` no `package.json`
   - `.claude/rules/project.md` e `GLOSSARY.md`: os trechos `{{texto livre}}` (domínio, URLs do backend, primeiros termos)
4. Escreva os primeiros termos no `GLOSSARY.md` e a spec inicial a partir de `docs/spec-scaffold.md`.
5. Troque este README pelo do projeto (mantenha Scripts, Variáveis e Estrutura).
6. `pnpm verify` e `pnpm test:e2e` verdes → primeiro commit.
7. Crie as branches `develop` e `homolog`. O CI roda e2e só em PR para `homolog`.
8. Proteja `homolog` e `main` no servidor (PR obrigatório, CI verde). Os hooks locais pedem confirmação, mas não substituem a proteção de branch.

## Requisitos

- Node 26 LTS e pnpm 11 (`.tool-versions`), via `corepack enable`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Sobe o app. Lê `.env`. |
| `pnpm build` | Gera `dist/`. Exige `VITE_APP_ENV`. |
| `pnpm check` | `tsc`, ESLint, Prettier (`--check`) e knip. |
| `pnpm format` | Prettier em tudo. |
| `pnpm test` | Vitest (testes ao lado do código, jsdom). `pnpm test:coverage` gera `coverage/`. |
| `pnpm test:e2e` | Playwright (`e2e/`, chromium) contra o build. Antes: `pnpm exec playwright install chromium`. |
| `pnpm verify` | `check` + `test` + `build`. |

## Variáveis

Em `.env.example`. Toda `VITE_*` vai para o bundle público: só URLs e ids públicos, nunca segredo.

| Variável | Valores |
| --- | --- |
| `VITE_APP_ENV` | `develop`, `homolog` ou `production`. Obrigatória; o build falha sem ela. |

## Estrutura

```
src/app/routes/            rotas por arquivo (TanStack Router), finas
src/app/shell/             providers, estados de rota, tokens de design
src/app/features/<nome>/   pages, components, hooks, schemas, api, testing
src/app/shared/            ui (shadcn), lib, hooks, api
e2e/                       Playwright + axe
.claude/rules/             regras que os agentes seguem
docs/                      arquitetura.md, stack.md, adr/
```

Detalhe e motivos em `docs/arquitetura.md`. Stack em `docs/stack.md`.

## O que o template não traz

- API e mock: nascem com o primeiro endpoint, em `features/<nome>/api/`.
- axios, Zustand e React Hook Form: aprovados, instalados na primeira feature que usar (`docs/stack.md`).
- Autenticação e tempo real: variam por projeto.
- Deploy: cada projeto escolhe o seu.

## Levando uma melhoria do template para um projeto já criado

```
git remote add template <url-do-template>
git fetch template
git cherry-pick <commit>
```
