---
paths:
  - "src/app/**/*.tsx"
---

# Acessibilidade

Meta obrigatória: **WCAG 2.2 nível AA**. `eslint-plugin-jsx-a11y` e axe nos specs e2e pegam parte; o resto é revisão com as regras abaixo.

1. **Leitor de tela.** Conteúdo que chega sozinho (mensagem, notificação) é anunciado por uma região `aria-live="polite"`. Todo controle tem nome acessível; ícone sozinho leva `aria-label` vindo do catálogo de textos.
2. **Foco.** Diálogo prende o foco; `Esc` fecha e devolve o foco a quem abriu.
3. **Teclado.** Tudo funciona só com teclado, com indicador de foco sempre visível. Use elementos nativos (`button`, `a`, `input`) antes de `div` com `role`.
4. **Movimento e escala.** Animações respeitam `prefers-reduced-motion`. O layout aguenta zoom de 200% sem perder conteúdo nem função.
