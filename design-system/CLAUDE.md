# Design System do Teka

Camada visual de um aplicativo de desktop para Mac e Windows. Sistema novo e independente.

- Os **tokens** estão em `src/index.css`. As convenções e as regras que não se quebram estão em `architecture.md`, que manda.
- **Componente do shadcn primeiro.** Na dúvida, pergunte ao Carlos. Se o shadcn não tem o que falta, diga a ele antes de construir.
- Espaçamento só nos degraus 4, 8, 12, 16, 20, 24, 32, 36, 40 e 48 (sem o 28). Fontes em múltiplos de 2 ou 4.
- Peça visual passa pela `ds-skill` e pelo `impeccable`.
- Nenhum arquivo daqui cita outro produto.
- Todo endereço de localhost que o Carlos precisa abrir sai como **link clicável** em markdown, com a rota completa (por exemplo `[protótipo](http://localhost:5180/#/prototipo)`), nunca como texto solto. A lista está no `README.md` do projeto.
