# Arquitetura do Design System do Teka

**Data:** 20 de Novembro de 2026 · **Estado:** primeira base

O Teka é um aplicativo de desktop para **Mac e Windows**. Este projeto é só a **camada visual**: os componentes, os fundamentos (cor, fonte, espaço, forma) e a página de Style Guide que os mostra. É um sistema novo e independente. Nada aqui depende de outro projeto.

## A stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Build | Vite 8 | Escolha do Carlos. Rápido e serve a interface de um app de desktop, que não precisa de servidor |
| Interface | React 19 com TypeScript | Escolha do Carlos para as telas novas. É para o que o shadcn foi feito |
| Estilo | Tailwind 4, com os tokens em variáveis CSS | O shadcn gera os tokens assim, e tema claro e escuro saem do mesmo arquivo |
| Componentes | shadcn, estilo `radix-maia`, sobre Radix UI | Escolha do Carlos: preferência por componentes e padrões do shadcn |
| Ícones | Tabler | Vem do preset escolhido |
| Fontes | Outfit nos títulos e Figtree no texto, pelo Fontsource | Vêm do preset. Ficam instaladas no projeto, então a tela é igual no Mac e no Windows |
| Pacotes | npm | O `pnpm` não está instalado. O resultado é o mesmo |
| Animação | GSAP | Movimento orgânico das telas de entrada e do chat: texto que se forma, balões que sobem, barrinhas de voz. Respeita "reduzir movimento" |

Preset do shadcn de origem: `b2w230QNJw`, com base `radix` e template `vite`.

## A estrutura de pastas

| Pasta | O que mora lá |
|---|---|
| `src/components/ui/` | Componentes do shadcn, como chegam do registro |
| `src/components/` | Componentes do Teka que combinam os do shadcn (por exemplo, o balão de fala) |
| `src/lib/` | Utilitários. Hoje só o `cn` |
| `src/hooks/` | Hooks |
| `src/index.css` | Os tokens: cor, raio, fonte. É o arquivo que o harness vigia |
| `src/components/` (peças do TekaFlow) | `model-row`, `onboarding-frame`, `conversa` (palavras, pontinhos e barrinhas de voz) e `marcas` (logos de marca) |
| `src/style-guide/` | A página de Style Guide, com as escalas de cor e as peças do TekaFlow |
| `src/prototipo/` | Protótipo clicável do onboarding, telas 1 a 7, na rota `#/prototipo` |
| `src/prototipo-app/` | Protótipo do app depois do onboarding, na rota `#/app` |
| `src/assets/marca/` | Logo e gato da marca, copiados de `marca/logo/` |
| `.harness/` e `.harness.json` | Inventário do harness e a indicação de onde mora o Style Guide |

## As convenções de nome

- **Arquivos:** minúsculas com hífen (`toggle-group.tsx`), como o shadcn gera.
- **Componentes:** PascalCase (`ToggleGroup`).
- **Hooks:** `use-` no arquivo e `use` no nome (`use-platform.ts`, `usePlatform`).
- **Tokens:** nome pelo papel, nunca pela cor (`--primary`, não `--verde`).

## As regras que não se quebram

1. **Componente do shadcn primeiro.** Botão é o `Button` do shadcn. Só se constrói do zero o que o shadcn não tem, e antes se pergunta ao Carlos.
2. **Nada solto no componente.** Cor, medida e raio vêm de token. Valor escrito direto numa classe (`p-[13px]`, `bg-[#fff]`) não entra.
3. **Espaçamento em base 4.** Só os degraus 4, 8, 12, 16, 20, 24, 32, 36, 40 e 48. **O 28 não existe.** Os valores são sempre múltiplos de 4.
4. **Tamanhos de fonte em múltiplos de 2 ou 4.**
5. **Nada assume um sistema operacional.** Atalho de teclado (⌘ no Mac, Ctrl no Windows) e controles de janela mudam entre os dois. Ficam em um ponto só, em `src/lib/platform`, e nenhum componente escreve "⌘" direto.
6. **Sistema independente.** Documento, comentário ou nome neste projeto não aponta para outro produto.

## O que este sistema não resolve

| Fora do escopo | Por quê |
|---|---|
| Captura de áudio, transcrição e IA | Isso é a lógica do aplicativo, não a interface |
| A casca do aplicativo: janela, bandeja, instalador | Depende do Mac e do Windows e vem depois, junto com o app |
| Tradução ao vivo | Está sem decisão do Carlos. Entra só quando ele decidir |
| Escrita da direita para a esquerda | Está desligada no preset. Nenhuma das línguas do produto usa |
| Dados salvos e conta de usuário | Este projeto não tem servidor |
