---
paths:
  - "e2e/**"
  - "playwright.config.ts"
---

# E2E (Playwright)

1. **Um spec por fluxo** em `e2e/<fluxo>.spec.ts`. E2E cobre fluxo de vários passos; o que dá para testar no Vitest fica no Vitest.
2. **Dados vêm do backend mock.** Monte o estado com `?scenario=` na URL, não criando dado pela UI. O template não traz o mock: ele nasce com a primeira API do projeto, atrás da mesma interface da API http.
   - Toda tela ou fluxo novo tem um cenário para cada um destes estados: carregando, vazio, falha de carga (5xx ou rede), não encontrado (404) e sessão expirada (401). Cada estado vira um `test()` no spec. Assim, qualquer agente abre e verifica o estado sem montar dado à mão.
3. **Seletores:** `getByRole` > `getByLabel` > `getByText`. `locator` com CSS só como último recurso, com comentário do porquê. Sem `getByTestId`.
4. **Asserção no alvo do teste.** Confira a célula, o link ou o item de que a história fala (`getByRole("cell", { name })`, `getByRole("link", { name })`), não o texto inteiro da linha da tabela nem a lista completa do menu: coluna ou item novo de outro ticket não deve quebrar o spec.
5. **Nunca `waitForTimeout`.** Use o auto-wait dos locators ou `expect(...).toBeVisible()`; para tempo, `page.clock`.
6. **Axe em toda tela nova** (`AxeBuilder`, tags até `wcag22aa`), sem violações.
7. Ao iterar: só os specs da feature (`pnpm test:e2e e2e/<fluxo>.spec.ts`). A suíte completa roda uma vez, no fim, no commit que você entrega: qualquer commit depois dela pede outra rodada (ver `general.md`).
