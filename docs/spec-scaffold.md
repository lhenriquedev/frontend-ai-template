# Spec do scaffold de {{PROJECT_NAME}}

Modelo. Preencha antes da primeira feature: é o que o agente lê para montar a base do projeto.

## Pronto quando

- {{Critérios verificáveis: rota X abre, login funciona em mock, `pnpm verify` verde.}}

## 1. Estrutura

{{Pastas além das do template e o que cada uma guarda.}}

## 2. Estado

{{O que vive no TanStack Query (dado do servidor), no Zustand (estado do cliente) e na URL.}}

## 3. Rotas

{{Tabela: caminho, tela, precisa de sessão?}}

## 4. I/O

{{Uma interface por fronteira (ex.: `AuthApi`, `AppApi`), com implementação mock e http. Liste os métodos e o endpoint de cada um.}}

## 5. Autenticação

{{Como a sessão nasce, onde fica, o que acontece no 401.}}

## 6. Dados pessoais

{{Que dados sensíveis aparecem e como `.claude/rules/personal-data.md` se aplica.}}

## 7. Build, CI e deploy

{{Hospedagem, variáveis por ambiente, headers de segurança.}}

## Escolhas feitas na spec

{{Decisões que não vieram do pedido original. As grandes viram ADR.}}

## Pendências que não bloqueiam

- {{...}}
