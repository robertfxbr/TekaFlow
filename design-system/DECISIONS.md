# Decisões do Design System do Teka

## Onde paramos

**Etapa:** fundação visual, Style Guide resumido e inventário de componentes, prontos para revisão do Carlos.
**O que o sistema tem hoje:** projeto Vite com shadcn (estilo `radix-maia`), tokens de cor, fonte, raio e escala de espaço, **29 componentes do shadcn** instalados e ajustados à grade de 4, e uma página de Style Guide com seletor de tema escuro e claro e uma seção de conversa, listas e menus.
**O que falta:** montar as 7 peças compostas (depende da resposta do Carlos), a skill de harness do projeto com a regra de escala, e a revisão independente.
**Perguntas em aberto:** ver o fim do arquivo.

## Princípios

Do mais forte para o mais fraco. Quando dois brigam, ganha o que está acima.

### 1. Legibilidade ganha de densidade

**O que ele decide:** quando cabe mais coisa na tela reduzindo o texto, o texto não reduz.
**Perde para:** nada. É o de cima.
**Seguindo:** o selo "Mais pesado" fica em 12 px e a linha quebra, em vez de o texto cair para 10 px.
**Violando:** o rótulo do medidor em 10 px "porque é só rótulo".

### 2. Quieto até ser chamado

**O que ele decide:** a cor de destaque aparece só onde a pessoa precisa agir ou onde a IA fala. O resto fica em neutro.
**Perde para:** 1. Destaque que some o texto não vale.
**Seguindo:** um botão primário por tela.
**Violando:** dois botões primários lado a lado e um selo colorido em cada linha da lista.

### 3. Componente do shadcn primeiro

**O que ele decide:** antes de desenhar um componente, procura-se o do shadcn. Se não existe, pergunta-se ao Carlos.
**Perde para:** 1. Se o do shadcn não passa em contraste ou em tamanho de texto, ajusta-se o token ou a cópia local.
**Seguindo:** o botão da tela vem do `Button` do shadcn.
**Violando:** um `<button>` com classes escritas à mão porque "era mais rápido".

### 4. O espaço anda na grade de 4

**O que ele decide:** padding, margem, gap e caixas usam 4, 8, 12, 16, 20, 24, 32, 36, 40 e 48. O 28 não existe. Espessura de traço (borda, anel de foco, indicador) fica fora da grade.
**Perde para:** 1. O texto não encolhe para caber num degrau.
**Seguindo:** o meio degrau de 6 px do botão virou 8 px.
**Violando:** `p-7` (28 px) ou `p-[13px]` porque "ficou melhor".

### 5. Nada assume Mac ou Windows

**O que ele decide:** atalhos e controles de janela mudam entre os dois sistemas e ficam em um ponto só (`src/lib/platform.ts`).
**Perde para:** 1. Se um rótulo do sistema for mais legível, vale o do sistema.
**Seguindo:** o atalho aparece como ⌘ D no Mac e Ctrl D no Windows.
**Violando:** escrever "⌘D" direto num componente.

## Registro

### 20 de Novembro de 2026 · Projeto e base

**Decidido:** projeto Vite novo e separado, criado com `npx shadcn@latest init --preset b2w230QNJw --base radix --template vite`, em npm.
**Descartado:** criar dentro do app existente; `pnpm`, que não está instalado.
**Por quê:** o Carlos quer construir o sistema novo de forma independente e depois ligá-lo ao app.
**Reabre se:** a integração com o app exigir outro gerenciador de pacotes.

### 20 de Novembro de 2026 · Direção visual

**Decidido:** vale o que o preset trouxe como direção inicial: fonte Outfit (títulos) e Figtree (texto), base zinc, verde como primária, ícones Tabler.
**Por quê:** o Carlos escolheu fonte e cores no shadcn Create.
**Decidido:** sucesso, alerta e informação (o preset não traz) são **derivados do tom da primária**: mesma saturação e luminosidade, com a matiz girada (sucesso 172, informação 245). O alerta (82) é mais claro, porque amarelo escuro vira marrom. O Carlos aprovou derivar assim.

### 20 de Novembro de 2026 · Tema

**Decidido:** o produto abre no **escuro**. O tema claro existe nos tokens e **a página de Style Guide tem um seletor Escuro e Claro** para ver os dois. A escolha fica guardada no navegador.
**Substitui:** a decisão anterior de deixar o claro como opção inativa e travada. A propriedade `lockedTheme` do provider continua disponível, mas não está em uso.
**Descartado:** seguir o tema do sistema por padrão; só claro.
**Reabre se:** o Carlos decidir que o produto também oferece o claro ao usuário final.

### 20 de Novembro de 2026 · Raios

**Decidido:** 4, 8, 12 e 16 px. Os tamanhos 2xl, 3xl e 4xl do Tailwind apontam todos para 16 px.
**Descartado:** manter os 7,2 px do preset.
**Por quê:** segue a mesma base do espaçamento.

### 20 de Novembro de 2026 · Espaço e componentes do shadcn

**Decidido:** espaço em 4, 8, 12, 16, 20, 24, 32, 36, 40 e 48, sem o 28. Os 31 meios degraus (6, 10 e 14 px) e o 28 px que o shadcn escreve nos componentes viraram o múltiplo de 4 mais próximo, com empate subindo, como a regra R-040 manda.
**Exceções:** espessura de traço, como o anel de foco de 3 px e o indicador de 2 px da aba.
**Por quê:** o código do componente fica no nosso projeto, então a regra vale também dentro dele.
**Reabre se:** uma atualização do shadcn trouxer um componente novo. A checagem de escala roda de novo.

### 20 de Novembro de 2026 · Escala tipográfica

**Decidido:** 12, 14, 16, 20, 24, 28, 32 e 40 px, com entrelinha de 16, 20, 24, 28, 32, 36, 40 e 48 px.
**Por quê:** múltiplos de 2 ou 4, como o Carlos pediu. Os tamanhos 18 e 30 px do Tailwind saíram.

### 20 de Novembro de 2026 · Contraste

**Decidido:** o harness mediu 20 pares no preset. Três reprovavam em AA: texto sobre a cor primária da barra lateral nos dois temas (o pior, 2,12:1) e o texto suave no tema claro (4,39:1). Ajustei os tokens, não o critério. Com os tokens de sucesso, alerta e informação são **26 pares, todos dentro do AA**.

### 20 de Novembro de 2026 · Componentes do Style Guide

**Decidido:** só os 16 que o Teka usa agora: botão, selo, cartão, campo, abas, interruptor, progresso, caixa de marcação, escolha única, confirmação, seletor, rolagem, separador, dica, avatar e atalho.
**Descartado:** instalar o conjunto inteiro do shadcn.
**Reabre se:** o protótipo precisar de um componente fora dessa lista. Instala-se por comando, e antes se pergunta.

### 20 de Novembro de 2026 · Inventário

**Decidido:** o inventário parte do **protótipo em HTML (v5)**, que é a base do que será construído. Os componentes do shadcn **substituem as peças dele**. Está em `inventario-componentes.md`.
**Achado:** o registro do shadcn já tem componentes de chat (`bubble`, `message`, `message-scroller`), `input-group`, `collapsible`, `sidebar`, `empty`, `spinner`, `item` e `attachment`. Isso reduz o que se constrói do zero a **2 peças da casca do aplicativo** (a moldura da janela e a janela flutuante).
**Em aberto:** compor as 7 peças a partir do shadcn e manter o conjunto aberto de logos de marca. (A instalação dos 11 componentes foi autorizada e feita.)

### 20 de Novembro de 2026 · Instalação dos 11 componentes

**Decidido:** instalar `bubble`, `message`, `message-scroller`, `input-group`, `collapsible`, `sidebar`, `empty`, `attachment`, `item`, `spinner` e `skeleton`. Autorizado pelo Carlos. Entraram também `sheet`, `textarea` e o hook `use-mobile`, que o `sidebar` e o `input-group` exigem.
**Token novo:** `tint` e `tint-hover`, no tom da primária. O `bubble` escrevia essa cor direto no componente (a variante `tinted`), e o harness barrou. A cor virou token, e o componente usa `bg-tint`. Contraste do texto sobre ele: 12,77:1 no escuro e 16,53:1 no claro.
**Grade de 4:** 40 trocas nos componentes novos. Ficam como exceção, por serem espessura de traço: o indicador de 2 px da aba, o anel de foco de 3 px e o trilho de 2 px do menu lateral.
**Mudanças no que veio do shadcn:** textos de leitor de tela traduzidos para o português; o `-ml-[0.15rem]` do atalho dentro do campo virou `-ml-1`.
**Configuração:** o Vite força uma só cópia do React e não pré-empacota o `@shadcn/react`, porque o pré-empacotamento trazia uma segunda cópia e quebrava a rolagem de conversa.
**Também corrigido:** o script `typecheck` do projeto não olhava os arquivos. Agora olha.
**Reabre se:** uma atualização do shadcn trouxer um componente que escreva cor direto, ou mudar o `message-scroller`.

## Perguntas em aberto

1. ~~Cores de sucesso, alerta e informação.~~ Resolvida: derivadas da primária e aprovadas.
2. **Valores acima de 48 px.** A regra do Carlos para na lista até 48. Os valores maiores seguem múltiplos de 4 enquanto ninguém disser o contrário.
3. **A cor primária no tema escuro** é um verde fechado, que serve de preenchimento de botão mas é escuro demais para texto sobre o fundo. O sistema usa o texto neutro para isso. Vale revisar quando o claro ou o verde-limão do protótipo entrarem.

### 20 de Novembro de 2026 · Cores da marca TekaFlow

**Decidido:** duas escalas de 50 a 950, `brand` (o limão é o 300, o verde escuro é o 700) e `grafite` (a superfície escura é o 900, o grafite neutro é o 950). No escuro, a primária é o limão com texto grafite; no claro, o verde escuro com texto branco. Sucesso, alerta, informação e erro foram derivados de novo e, no escuro, ficaram mais suaves. 26 pares de contraste em AA.
**Reabre se:** a superfície escura `#25262A`, que o README da marca ainda chama de proposta, mudar.

### 20 de Novembro de 2026 · Peças e variantes do TekaFlow

**Decidido:** o que o protótipo repetia à mão virou peça ou variante (ver `inventario-componentes.md`): `model-row`, `onboarding-frame`, `conversa`, `marcas`, selos, cartão e progresso. Todas aparecem no Style Guide, na seção "Peças do TekaFlow".
**Também:** GSAP para o movimento; o gato sem o quadrado é o avatar da IA; texto em negrito é 600 e título principal é 500.
**Aviso do harness que não é erro:** o `api-lint` marca `ItemMedia variant="icon"` como se fosse `Item`, porque o inventário guarda uma variação de componente por arquivo e `item.tsx` tem duas. A variante `icon` existe em `ItemMedia`. O `theme-provider` aparece como ausente do Style Guide por ser infraestrutura.

