---
paths:
  - "src/app/**/*.tsx"
---

# Componentes

## Tamanho

- Limite rígido: 250 linhas por arquivo (o lint barra). O motivo é a testabilidade: arquivo pequeno tem uma responsabilidade, e dá para testar e quebrar essa responsabilidade isolada.
- A partir de 150 linhas, revise as responsabilidades: divida por responsabilidade, nunca mecanicamente por contagem de linhas.
- Um componente por arquivo.

## Componente burro, hook inteligente

- **`src/app/features/<feature>/`**: cada componente de `components/` ou `pages/` importa seu próprio hook `use-<nome>.ts` de `hooks/`, que entrega dados e ações prontos. Store, query, transporte e regras de negócio vivem no hook; o componente só renderiza.
- **`src/app/shared/ui/`**: recebe tudo por props. Usa apenas hooks nativos do React para estado visual local (aberto/fechado, foco, refs).
- Props tipadas com tipos de domínio derivados dos schemas (ex.: `Order`, `OrderStatus`), nunca `string` solto para valores de conjunto fechado.

## Fluxo de renderização

- Prefira early return a ternário. Estados que trocam a tela inteira (carregando, vazio, erro, desconectado) saem no topo com `if (...) return <Estado />`, e o JSX principal fica sem ramificações.
- Ternário aninhado é proibido. Ramificação que sobra dentro do JSX vira subcomponente com seu próprio early return.

## Carregando e vazio

### Vazio

- Estado vazio usa `Empty` (`@app/shared/ui/empty`) com `EmptyHeader` > `EmptyTitle` + `EmptyDescription`. Título curto dizendo o que falta ("Nenhum pedido aqui"), descrição dizendo o que acontece ou o que fazer.
- Telas inteiras ou painéis principais levam ícone: `EmptyMedia variant="icon"` (caixa de 32px, ícone de 20px) com ícone lucide `aria-hidden="true"`. O ícone é decorativo; o título carrega o significado.
- Painel estreito ou bloco dentro de outro conteúdo (cartão, coluna lateral): `<Empty size="sm">`, com padding menor e sem crescer para ocupar o espaço.
- Erro que troca a tela é `Empty role="alert"` com ação de tentar de novo em `EmptyContent`.

### Carregando

- Dado lido com `useSuspenseQuery` não tem estado de carregando nem de erro no componente: quem mostra é o `RoutePending` e o `RouteError` da rota. O componente trata sucesso e vazio.
- Dado secundário, lido com `useQuery`, carrega dentro da tela com `Skeleton` (`@app/shared/ui/skeleton`) com a forma do conteúdo final (avatar, título, linhas), para a tela não saltar quando o dado chega. O `Skeleton` já para de pulsar com movimento reduzido.
- Cada placeholder é `aria-hidden="true"`. Quem monta o bloco anuncia uma vez só: texto sr-only "Carregando …" (ex.: "Carregando cliente…") e/ou `aria-busy="true"` no contêiner.
- Troca de rota usa só o `RoutePending` (`shell/route-states/route-pending.tsx`): skeleton genérico de barra de título + 3 linhas com "Carregando tela…". Sem pending por rota.
- `Spinner` só em três casos: ação pendente dentro de um controle (enviar, salvar, login), status de conexão e paginação que mantém a âncora do scroll. Nunca como carregamento de conteúdo nem centralizado na tela.

## Exports

- Named exports apenas: `export function OrderPage()`. Sem `export default`.
- Um hook por arquivo `use-*.ts`, exportado por nome.

## Falha isolada

- Cada rota tem `errorComponent` que mostra "algo deu errado, tentar de novo" e preserva o resto do app (navegação e topo).
- Monitoramento de erros (Sentry etc.) ainda não existe: marque o ponto com `// simplified:` até a decisão.
- Textos visíveis em pt-BR.
