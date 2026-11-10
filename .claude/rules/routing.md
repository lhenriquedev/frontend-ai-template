---
paths:
  - "src/app/routes/**"
  - "src/app/router.ts"
---

# Rotas (TanStack Router)

1. **File-based.** `src/app/route-tree.gen.ts` é regenerado pelo plugin do Vite; nunca edite à mão.
2. **Rota é fina.** O arquivo declara `createFileRoute`, carrega dados e aponta `component` para a página em `src/app/features/<feature>/pages/`. UI e regra de negócio não moram aqui, então a rota não tem teste unitário: o que ela liga é coberto pelo teste do hook e pelo e2e. Arquivo `*.test.*` em `routes/` é ignorado pelo gerador.
3. **Estado de tela vive na URL.** Filtro, página, ordenação e aba que devem sobreviver a refresh ou a um link compartilhado são search params, não `useState` nem store. A rota declara `validateSearch` com o schema Zod direto (Zod 4 dispensa adaptador). Valor inválido cai no padrão com `.catch(...)` em vez de quebrar a rota, e `stripSearchParams(defaults)` em `search.middlewares` tira da URL o que é igual ao padrão.
4. **Dados no `loader`.** Carregue pelo `context.queryClient` com o `queryOptions` de `features/<feature>/api/` (ex.: `context.queryClient.query({ ...orderQueryOptions(params.orderId), staleTime: "static" })`; `ensureQueryData` e `prefetchQuery` estão deprecated), para aquecer o cache. O hook da tela lê o mesmo `queryOptions` com `useSuspenseQuery` (dado sem o qual a tela não existe) ou `useQuery` (dado secundário); `useLoaderData` é barrado pelo lint, porque sem um observer o dado para de atualizar. Efeito colateral (ex.: `markRead`) não vai no loader: o preload por hover o dispararia.
5. **`beforeLoad` só para sessão e redirect.** Gate de sessão num layout sem path (ex.: `_authenticated.tsx`); parâmetro obrigatório ausente vira `throw redirect(...)`.
6. **Links tipados.** `<Link to="/orders/$orderId" params={{ orderId }}>`. Nunca string montada.
7. **Na URL só ids opacos e estado de navegação** (aba, página) (ver `personal-data.md`).
8. **Não encontrado.** Recurso que o servidor responde 404 vira `throw notFound()` no `loader`; a tela é o `RouteNotFound` padrão do router (`shell/route-states/`).
