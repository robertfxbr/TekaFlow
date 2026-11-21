# TekaFlow: regras para quem constrói (pessoa ou agente)

O contrato completo está em [AGENTS.md](AGENTS.md). Leia antes de mexer em tela.

## Em uma frase

Toda tela, componente ou estilo novo nasce **no Design System** (`design-system/`), passa pela skill **impeccable** e só entra se o **gate** passar (`node scripts/gate.mjs`).

## O que não se quebra

- **Tokens primeiro.** Cor, espaço, raio e tipografia saem de `design-system/src/index.css`. Cor nova entra no token antes de entrar na peça. Nada de `#hex` solto.
- **Componente do shadcn primeiro** (`design-system/src/components/ui`). Na dúvida, pergunte antes de criar um do zero.
- **Espaçamento** só nos degraus 4, 8, 12, 16, 20, 24, 32, 36, 40 e 48. Fontes em múltiplos de 2 ou 4.
- **Nome do produto na tela:** sempre "TekaFlow". Nunca "Teka" sozinho.
- **Texto da interface** em português do Brasil, curto, sem travessão, para quem não programa: diga o que acontece na tela, não o nome do arquivo.
- **Tom da marca:** Tranquilo e Despretensioso. Sem exclamação, sem prometer tempo ou resultado, sem "sempre" nem "garante", sem "de graça" nem "totalmente local". A marca diz "discreto". O gate reprova o que for novo (`scripts/voz-da-marca.mjs`).
- **Tela nova** sai do pedido ao código por [design-system/architecture.md](design-system/architecture.md) e [PRODUCT.md](PRODUCT.md).
- **Registro:** toda decisão vai para [DECISIONS.md](DECISIONS.md), só acrescentando.
- **Créditos:** a base é do Robert ([openPerssua](https://github.com/robertfxbr/openPerssua)). Não remova o `LICENSE` nem a seção Créditos do README.

## Antes de subir

1. `node scripts/gate.mjs` precisa aprovar (tipos, build, harness do design system, detector de design, escrita e voz da marca).
2. Peça visual passa pela skill `impeccable` (`/impeccable audit` ou `/impeccable polish` na tela que mudou).
3. Instalação das skills e passo a passo: [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md).
