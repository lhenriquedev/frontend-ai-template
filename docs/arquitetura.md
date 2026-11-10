# Arquitetura

Como o código se organiza e por quê. As regras de escrita ficam em `.claude/rules/`; as decisões com alternativa descartada, em `docs/adr/`.

## Camadas

```
src/app/
  main.tsx, router.ts, env.ts, env-schema.ts   entrada do app (só estes ficam na raiz)
  routes/      URL → tela. Arquivos do TanStack Router, finos
  shell/       o que envolve todas as telas
  features/    uma pasta por domínio; onde mora o produto
  shared/      o que 2 ou mais features usam
src/test/      setup do Vitest
e2e/           specs Playwright, um por fluxo
```

Quem importa quem: `routes` → `shell`, `features`, `shared`. `shell` → `features`, `shared`. `features` → `shared`. `shared` → nada. Uma feature não importa outra. O ESLint barra os três casos.

## Feature

Toda feature tem o mesmo conjunto de pastas. Nenhum arquivo fica solto na raiz dela, e a pasta só nasce quando tem arquivo.

```
features/orders/
  pages/        a tela que a rota aponta (order-list-page.tsx)
  components/   pedaços da tela
  hooks/        use-*.ts: dados e ações prontos para o componente
  schemas/      schemas Zod de formulário
  api/          contrato Zod, funções http, mock e queryOptions do domínio
  testing/      apoio a teste: dados de exemplo e API falsa
```

- Sem `index.ts` de reexportação: importe o arquivo direto.
- O teste fica ao lado do arquivo testado (`hooks/use-orders.test.ts`).
- Código usado por uma feature só fica nela. Na segunda feature que precisar, sobe para `shared/`.
- Apagar uma feature é apagar a pasta dela e a rota.

## Shell

```
shell/
  providers/      QueryClient, contexto do router
  route-states/   carregando, erro e não encontrado, padrão de todas as rotas
  styles/         base.css: tokens de design
  layout/         cabeçalho, navegação (nasce com a primeira tela autenticada)
```

## Shared

```
shared/
  ui/      componentes shadcn, sem regra de negócio: recebem tudo por props
  lib/     funções puras
  hooks/   hooks sem domínio (ex.: use-media-query)
  api/     cliente http, erro de API e a escolha entre mock e http
```

## Fluxo de um dado do servidor

1. `features/<f>/api/` define o contrato (schema Zod, tolerante a campo novo: `z.object`), a função que chama o servidor e o `queryOptions`.
2. O `loader` da rota aquece o cache com `context.queryClient.query(...)`.
3. O hook em `hooks/` lê com `useSuspenseQuery` (ou `useQuery`, para dado secundário) e entrega pronto.
4. O componente em `pages/` ou `components/` só renderiza: sucesso e vazio.
5. Carregando, erro e não encontrado são da rota (`shell/route-states/`).

## Onde vive cada estado

| Estado | Onde |
| --- | --- |
| Dado do servidor | TanStack Query |
| Filtro, página, ordenação, aba | search params da URL, validados na rota |
| Estado visual local (aberto, foco) | `useState` no componente |
| Formulário | React Hook Form + schema Zod |
| Estado do cliente que sobra, entre telas | Zustand |

## O que o template deixa para cada projeto

Autenticação, tempo real, i18n, monitoramento de erros e deploy variam demais. Cada projeto decide e registra em `.claude/rules/project.md` ou num ADR.
