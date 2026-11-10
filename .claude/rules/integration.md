---
paths:
  - "src/app/shared/api/**"
  - "src/app/features/**/api/**"
  - "src/app/**/use-*.ts"
---

# Integração HTTP e WebSocket: sem duplicação, sem vazamento

Vale para todo código que fala com o servidor. O caminho feliz e o errado estão em `general.md`.

## Sem request duplicado

1. **Busca só via `useSuspenseQuery` ou `useQuery`.** Nada de chamada à API dentro de `useEffect`. O TanStack Query deduplica pela `queryKey`.
   - Exceção: comando periódico sem dado para cachear (ex.: heartbeat) pode rodar num timer iniciado por `useEffect`. Exige um único dono, cleanup que limpa o timer e aborta o request em andamento, e teste que prova `StrictMode` sem intervalo dobrado e `vi.getTimerCount()` voltando a zero.
   - Exceção: busca com dado sensível ou de vida curta (termo de busca com dado pessoal, URL assinada) roda por `useMutation` com `gcTime: 0`, para o dado ficar fora da `queryKey` e do cache. Um `ref` de "em andamento" barra a segunda chamada no mesmo tick, antes de o `isPending` virar.
   - Toda exceção nova entra nesta lista, com o endpoint e o motivo.
2. **Mutation não dispara duas vezes.** O botão que dispara a mutation fica desabilitado enquanto `isPending`.
3. **Teste conta as chamadas.** O teste de integração renderiza em `StrictMode`, força re-render e remonta, e confere que o cliente http falso foi chamado 1 vez (ou o número exato esperado).

## Sem memory leak

1. **Desmontou, limpou.** O teste de integração desmonta o hook e confere que:
   - toda inscrição de evento foi cancelada (o contador de listeners do socket falso volta a zero);
   - timers e intervals foram limpos (`vi.getTimerCount()` volta a zero);
   - o request em andamento foi abortado (o `signal` do `queryFn` chega ao cliente http).
2. **Um WebSocket só.** No navegador (MCP `playwright`), abra e feche a tela que usa tempo real 10 vezes e confira em `browser_network_requests` que continua existindo 1 conexão WebSocket e que nenhum request se repete.
