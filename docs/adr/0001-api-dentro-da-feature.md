# API dentro da feature, sem import entre features

No projeto de onde este template saiu, todo o acesso ao servidor vivia em `shared/api/`: uma interface com todos os métodos e um arquivo http único que chegou a 29 KB. Cada feature nova mexia nos mesmos dois arquivos. Decidimos (10/11/2026) que **o contrato Zod, as funções http, o mock e o `queryOptions` de um domínio ficam em `features/<domínio>/api/`**, e que uma feature não importa outra. Em `shared/api/` fica só o que é comum: cliente http, erro de API e a escolha entre mock e http.

## Considered Options

- `shared/api/` global com contratos e queries de todos os domínios: rejeitado pelo arquivo único que cresce sem fim e pelo conflito de merge entre features.
- `services/` global, uma classe por domínio: rejeitado porque separa a chamada do schema e do `queryOptions` que mudam junto com ela.
- `index.ts` como API pública de cada feature: rejeitado. Sem import entre features não há consumidor para proteger, e o knip já acusa export sem uso.

## Consequences

- Apagar uma feature é apagar a pasta e a rota.
- Contrato que duas features precisam sobe para `shared/api/contracts/`. O lint `no-cross-feature-imports` força essa subida.
- Não existe um lugar único que liste todos os endpoints do app: a busca é por `features/*/api/`.
