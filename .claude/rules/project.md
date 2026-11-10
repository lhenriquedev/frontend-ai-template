# Regras deste projeto

Preencha ao criar o projeto. Tudo que é específico de {{PROJECT_NAME}} entra aqui; as outras regras ficam genéricas.

## Domínio

{{Uma frase: o que o produto faz e para quem. Os termos estão no `GLOSSARY.md`.}}

## Backend

- Contrato HTTP: {{URL do OpenAPI}}
- Contrato de tempo real: {{URL, ou "não há"}}
- Ambiente de teste: {{URL da API de homolog}}
- Formato de resposta: {{ex.: envelope `{ success, data }`}}

## Branches

- Fluxo de branches: `develop` → `homolog` → `main`.

## Regras só deste projeto

{{Ex.: multi-tenant, tempo real, dados sensíveis específicos. Uma regra grande vira arquivo próprio em `.claude/rules/` com `paths:` no frontmatter.}}
