---
paths:
  - "src/app/**"
  - "eslint.config.js"
---

# Dados pessoais

Quem decide o que o usuário vê é o servidor; o front só exibe.

1. **O servidor manda o dado já mascarado.** O front nunca mascara dado completo: exibe o que chegou.
2. **Dado revelado é efêmero.** Quando o usuário pede o dado completo, ele fica em `useState` da tela, fora dos caches de query e de mutation, e some ao sair da tela.
3. **Dado pessoal e conteúdo escrito por usuário nunca vão para:** URL, `localStorage`/`sessionStorage`/IndexedDB, `console.*`, analytics, ferramenta de erros, atributos do DOM (`title`, `data-*`), `document.title`. Na URL só ids opacos e estado de navegação.
4. **Devtools** do Zustand e do TanStack Query só com `import.meta.env.DEV`.
5. **ESLint barra** `console`, `localStorage`, `sessionStorage`, `indexedDB` e `document.title`. Exceção só com `// workaround:` justificado na linha.
6. **Conteúdo escrito por usuário é texto.** Renderize via JSX (escapado pelo React). `dangerouslySetInnerHTML` é proibido. Links só `http:`/`https:`, com `rel="noopener noreferrer"`.
7. **Variáveis `VITE_*` vão para o bundle público.** Nelas, só URLs e ids públicos. Segredo nunca entra no frontend; sessão é cookie `HttpOnly`, e o front nunca vê o token.
