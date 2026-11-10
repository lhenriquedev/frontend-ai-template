# Teste unitário ao lado do código

No projeto de onde este template saiu, os testes ficavam todos em `tests/` na raiz: mais de 400 arquivos soltos numa pasta só, longe do que cobriam. Decidimos (10/11/2026) que **o teste unitário e o de integração ficam ao lado do arquivo testado** (`use-orders.ts` e `use-orders.test.ts`). O apoio a teste que não pertence a um arquivo só (dados de exemplo, API falsa) fica em `features/<feature>/testing/`. Os specs Playwright continuam em `e2e/` na raiz, um por fluxo.

## Considered Options

- `tests/` na raiz espelhando `src/`: rejeitado porque o espelho não se mantém e o teste some de vista de quem edita o código.
- Uma pasta `tests/` dentro de cada feature: rejeitado porque repete o mesmo problema em escala menor.

## Consequences

- Arquivo sem teste ao lado fica visível na listagem da pasta.
- O build ignora `*.test.*`; a cobertura exclui testes e `src/test/`.
- E2E não segue a regra: um fluxo atravessa várias features.
