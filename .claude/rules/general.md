# Regras gerais

Regras que valem em todo projeto criado deste template. O que é só deste projeto (domínio, backend, branches) fica em `project.md`.

Use o vocabulário do `GLOSSARY.md` em código, nomes e textos.

## Antes de integrar: o contrato do backend

Antes de escrever código que fala com o servidor (contrato, API, query, mutation, tempo real ou tela que mostra o dado), leia o contrato atual do backend. O endereço está em `project.md`.

- Confira caminho, método, corpo, resposta, campos opcionais e códigos de erro contra os contratos em `features/<feature>/api/` e a API http. O caminho e o formato que já estão no código podem estar velhos.
- Veja o que os dados permitem: que campos existem, quais podem faltar, o que a tela consegue mostrar e o que ela não tem como saber. A tela nasce do contrato, não o contrário.
- Confira também a resposta real no ambiente de teste, não só o schema: campo opcional que nunca vem esconde bug.
- O contrato do backend é a fonte da verdade. Se ADR, spec, ticket, regra ou código divergirem dele, o front se ajusta, e o dev é avisado do que mudou.

## Contrato e tipagem

- O schema Zod é a única fonte do tipo: `type X = z.infer<typeof xSchema>`. Interfaces paralelas à mão divergem do schema.
- Todo dado que entra no processo (config, payload do servidor, evento do WebSocket, env) passa por `.parse()` na fronteira. Dentro do app, confie no tipo.
- Conjuntos fechados de valores: string enum do TypeScript (`enum Status { Open = "open" }`) ou `z.enum([...])`. Para validar um enum do TS, `z.enum(MeuEnum)`. Nunca `const enum` (quebra com `isolatedModules`) nem `z.nativeEnum` (deprecated no Zod 4). Enum numérico também não: serializa como número e tem mapeamento reverso.
- `switch` sobre união ou enum trata todos os casos e termina com verificação exaustiva (`const unreachable: never = value`).
- Tipos fracos são bloqueados: `any`, asserções `as` (exceto `as const`), non-null `!`, `@ts-ignore`/`@ts-expect-error`. Precisa de um? Justifique no PR.

## SOLID nas fronteiras, YAGNI dentro delas

- **SRP**: cada componente, hook, slice ou módulo tem uma responsabilidade nomeável numa frase.
- **DIP**: API HTTP, transporte em tempo real e config externa ficam atrás de interfaces, com implementação mock e real intercambiáveis.
- Interface ou abstração nova só com 2+ usos concretos. Duplicação local pequena é aceitável.

## Verificação

- Arquivo editado passa por Prettier e ESLint. Erro de tipo, lint ou teste nunca fica para depois.
- Antes de concluir: `pnpm verify` (tipos + lint + testes + build).
- E2E local: durante o trabalho, rode só os specs da feature (`pnpm test:e2e e2e/<fluxo>.spec.ts`). A suíte completa roda uma vez, no fim. O CI só roda e2e em PR para `homolog`; antes disso o local é a única barreira.
## Testes

Código bom aqui é código verificável: dá para quebrar e ver um teste ficar vermelho. Quem lê e altera o código quase sempre é um agente, e ele confia no que os testes provam, não no que o código parece fazer.

- **O teste pega a quebra.** Diff com lógica (condição, retorno, mapeamento de erro, transição de estado): quem implementa e quem revisa quebram de propósito de 1 a 3 dessas linhas, uma de cada vez, rodam os testes ligados e algum deles tem que ficar vermelho. Depois desfazem a quebra. Se nada ficar vermelho, é achado de revisão: falta teste ou o teste não confere o que diz. Diff só visual fica isento.
- Lógica nova ou alterada (hooks, slices, transporte, utils, schemas): teste unitário Vitest escrito antes da implementação (TDD), cobrindo o caso principal e o de falha. O teste fica ao lado do arquivo testado (`use-orders.test.ts`).
- Fluxo com vários passos (login, criar, editar, reconectar): spec Playwright em `e2e/` com auditoria axe.
- Componente puramente visual dispensa teste unitário.
- Todo request (HTTP ou WebSocket) tem teste unitário e de integração, nos dois caminhos:
  - **Unitário**: a função da API com o cliente http falso injetado (ou socket falso). Confere URL, método, corpo, `.parse()` do schema e mapeamento de erro.
  - **Integração**: o hook renderizado com `QueryClient` + API http real + cliente http ou socket falso injetado. Confere o que a tela recebe. Sem MSW.
  - **Caminho feliz** e **caminho errado**, sempre. Erro mínimo no HTTP: 401 (leva à sessão expirada), 404, 5xx, rede caída (o request rejeita) e payload fora do schema. No WebSocket: fechamento inesperado, mensagem inválida e mensagem fora de ordem.
  - Duplicação e vazamento: ver `integration.md`.
- Toda feature, visual ou de integração, é conferida no navegador antes de dar a task como concluída, com o **MCP `playwright`**: execute o caminho feliz e um caso de falha ou vazio, leia `browser_console_messages` e `browser_network_requests` (zero erro no console, nenhum request duplicado) e tire 1 screenshot do estado final. Com a implementação mock não há HTTP de API: lá a ausência de request duplicado fica provada pelo teste de integração do hook em StrictMode.
- Tela nova ou com vários componentes: no fim, pergunte ao dev se ele quer passar a skill `impeccable` para revisar a UI. Não rode sem ele pedir.

## Git

- Commit e push em `homolog` ou `main` só com permissão explícita do dev naquela conversa. Permissão anterior não vale para o próximo commit.
- Conventional Commits com descrição em PT-BR (`feat: ...`, `fix: ...`, `docs: ...`).
- Branch sai de `develop`; o PR diz o que mudou e por quê.
- O PR continua revisável por uma pessoa: até ~400 linhas de diff, sem contar arquivo gerado (`route-tree.gen.ts`, lockfile). Passou disso? Divida o PR ou explique na descrição por que ele não se divide.
