# Inventário de componentes

**Data:** 20 de Novembro de 2026 · **Base:** o protótipo em HTML (v5, 18 telas), guardado em `../prototipos/html-v5/`. Ele é a referência do que vai ser construído, e os componentes do shadcn substituem as peças dele.

## Como foi feito

Contei as peças que o protótipo realmente desenha: 44 funções de montagem e as classes que aparecem nas 18 telas. A coluna **telas** diz em quantas das 18 a peça aparece. O harness conferiu os 16 componentes já instalados, e os apelidos em português estão em `.harness/aliases.json`.

Cada peça fica em uma de quatro situações:

| Situação | Quer dizer |
|---|---|
| **Instalado** | Já está no projeto e serve como está |
| **Instalar** | O shadcn tem e ainda não está no projeto. Instala-se por comando |
| **Adaptar** | Existe, mas o protótipo pede uma variação. A diferença está escrita |
| **Criar** | O shadcn não tem. Compõe-se a partir de peças dele ou se constrói do zero |

## Atualização: instalado em 20 de Novembro de 2026

Você autorizou instalar. Os **11 componentes da lista "Instalar"** entraram, mais `sheet`, `textarea` e um hook (`use-mobile`), que o `sidebar` e o `input-group` exigem. O projeto passou de 16 para **29 componentes** do shadcn.

| O que se confirmou | Resultado |
|---|---|
| O `bubble` aceita um balão dentro de outro? | **Sim.** O conteúdo do balão é um bloco livre, então o insight é um segundo `Bubble` dentro do primeiro |
| Existe uma variante verde para o insight? | **Sim, a `tinted`**, que pega o tom da cor primária. Ela escrevia a cor direto no componente, e o harness barrou (8 achados). Virou o token `tint`, que muda sozinho com o tema |
| O `attachment` serve de pasta tracejada? | **Em parte.** Ele serve para os arquivos, com os estados feito, lendo (`processing`) e erro. A zona tracejada para escolher a pasta é o **`empty`**, que já traz a borda tracejada |
| O pacote novo funciona? | O `@shadcn/react` (rolagem de conversa) entrou. O Vite carregava uma segunda cópia do React por causa dele, e a configuração agora força uma só |

Os componentes novos passaram pela mesma regra: **40 trocas** para a grade de 4 (meios degraus de 6, 10 e 14 px e o 28 px) e os textos de leitor de tela em inglês foram para o português.

**Efeito no resumo da seção 4:** o que estava "a instalar" agora está **instalado**. Seguem sem resposta a decisão das 7 peças compostas e a dos logos de marca.

---

## 1. A peça do protótipo e o que a substitui

Em ordem de quantas telas usam.

| Peça do protótipo | Telas | Vira no shadcn | Situação | O que muda |
|---|---|---|---|---|
| Botão (principal, secundário, texto, perigoso, pequeno, largo) | 15 | `Button` | Instalado | "Texto" é o `ghost`. "Perigoso" é o `destructive`. O botão largo é uma classe de largura fixa |
| Cartão (com estado selecionado) | 12 | `Card` | Adaptar | Falta o estado "selecionado", com borda na cor primária |
| Selo de estado, com ícone (Conectado, Ativo, Pendente) | 10 | `Badge` | Adaptar | Variantes de feedback (sucesso, alerta, informação) e um ponto antes do texto |
| Selo de rótulo (Recomendado, Mais rápido, Mais preciso, Mais pesado) | 9 | `Badge` | Instalado | Usa as variantes que já existem |
| Moldura do onboarding: progresso em 5 segmentos, título numerado, rodapé de ponta a ponta | 9 | `Progress`, `Badge`, `Button`, `Separator` | **Criar** | Uma peça só, composta |
| Linha de modelo: ícone, nome com selos, detalhe, barras de precisão e velocidade, ação | 8 | `item`, `Badge`, `Progress`, `Button` | **Criar** (composta) | A peça mais repetida do fluxo |
| Avatar (reunião, participante) | 8 | `Avatar` | Instalado | |
| Chip (idioma, aba compacta, pergunta sugerida) | 6 | `Select`, `Tabs`, `Button` | Adaptar | Tamanho compacto nos três |
| Bloco com título (título a 16, itens a 8, seções a 24) | 6 | Classes de espaçamento | Regra | Não vira componente. Vira a regra do `architecture.md` |
| Campo de pergunta: texto, microfone e enviar lado a lado | 6 | `input-group` | **Instalar** | |
| Balão de fala (Eles, Você, IA) | 4 | `bubble` e `message` | **Instalar** | |
| Insight "Diga isso", balão dentro de balão, em verde | 3 | `bubble` | Adaptar | Variante aninhada. **A confirmar ao instalar** |
| Linha de Configurações (em uso, outras opções, subopções) | 4 | `item`, `RadioGroup`, `collapsible` | **Instalar** | |
| Barra de nível e medidores recolhíveis | 4 | `Progress` e `collapsible` | Adaptar | O valor muda ao vivo, e o painel abre e fecha |
| Cartão de reunião e grupo por dia | 4 | `item`, `Avatar`, `Badge` | **Criar** (composta) | Modelo do Fireflies |
| Cartão de provedor (logo, nome, estado, botão) | 4 | `Card`, `Badge`, `Button` | **Criar** (composta) | Seis por tela |
| Abas Ouvir e Responder, com ícone | 4 | `Tabs` | Instalado | |
| Menu lateral da janela principal e das Configurações | 4 | `sidebar` | **Instalar** | |
| Atalho de teclado | 4 | `Kbd` | Instalado | O valor vem do ponto único de plataforma |
| Janela flutuante do chat: cabeçalho, conversa, rodapé, 90% de opacidade | 4 | `Card`, `ScrollArea`, `message-scroller` | **Criar** | É da casca do aplicativo. Gruda no canto, minimiza em pílula |
| Botão de parar no canto | 4 | `Button` | Instalado | `destructive`, só ícone |
| Confirmação (Encerrar a sessão, Escolher uma IA) | 2 | `AlertDialog` | Instalado | |
| Conversa que rola sozinha até o fim | 4 | `message-scroller` | **Instalar** | Traz um pacote novo, `@shadcn/react` |
| Pasta antes de escolher (borda tracejada) e estado vazio | 3 | `attachment` e `empty` | **Instalar** | O `attachment` tem um estado tracejado. A confirmar |
| Linha de teste: check ou X, nível, botão | 1 | `item`, `Progress`, `Button` | **Criar** (composta) | |
| Cartão de permissão ilustrado | 1 | `Card` | **Criar** (composta) | |
| Interruptor, caixa de marcação, escolha única | 3 | `Switch`, `Checkbox`, `RadioGroup` | Instalado | |
| Transição do Início para as Configurações | 1 | Transição de tela | **Criar** | Movimento que desliza. Pode ser só CSS |
| Moldura da janela do app, com os controles do Mac e do Windows | 18 | Nada | **Criar** (do zero) | É da casca. Muda entre os dois sistemas |

## 2. O que o protótipo tem e **não vira componente**

| Peça | Por quê |
|---|---|
| Desktop falso (barra de menu, Dock, "fundo placeholder") | É só o cenário do protótipo |
| Texto pequeno, apagado, título grande | Já são os tokens de fonte e de cor |
| Logo do Teka | Aguarda o nome e o desenho da logo |

## 3. Componentes do shadcn que o protótipo ainda não pede, mas faltam

| Componente | Para quê |
|---|---|
| `spinner` e `skeleton` | O feedback de "processando" que você pediu para o Contexto |
| `field` | A linha de configuração com rótulo e descrição, se o `item` não bastar |
| `dialog` | Uma janela maior que a confirmação, se aparecer |

## 4. Resumo em números

| | Quantidade |
|---|---|
| Instalados e servindo | 8 peças do protótipo |
| A instalar do shadcn | 8 componentes (`bubble`, `message`, `message-scroller`, `input-group`, `collapsible`, `sidebar`, `empty`, `attachment`), mais `item`, `spinner` e `skeleton` |
| A adaptar | 6 peças |
| A criar | 9 peças, das quais **7 por composição** e **2 do zero** (a moldura da janela e a janela flutuante) |

## O que preciso que você decida

1. ~~Instalar os 11 componentes novos do shadcn.~~ Feito.
2. **As 7 peças criadas por composição:** monto a partir de peças do shadcn (recomendado)? As 2 da casca só fazem sentido do zero.
3. **Logos de marca.** OpenAI, Claude, Gemini, Ollama e Apple não vêm no conjunto de ícones do projeto (Tabler). O protótipo usa um conjunto aberto de logos. Aceita manter?

---

## Atualização: fechamento do primeiro protótipo (20 de Novembro de 2026)

O sistema passou de 29 para **35 componentes**. O harness (`.harness/manifest.json`) confere que **34 dos 35 aparecem no Style Guide**. O que sobra é o `theme-provider`, que é infraestrutura (guarda o tema escuro ou claro) e não tem aparência própria.

| Peça | Origem | Onde está no Style Guide |
|---|---|---|
| `dialog` | shadcn | Peças do TekaFlow |
| `sheet`, `textarea` | shadcn, já instalados | Peças do TekaFlow |
| `model-row` (linha de modelo) | Criada, composta de `item`, `badge` e `button` | Peças do TekaFlow |
| `onboarding-frame` (moldura do onboarding) | Criada, composta de `separator` e `button` | Peças do TekaFlow |
| `conversa` (palavras, pontinhos e barrinhas de voz) | Criada, com o texto e os pontos que o GSAP anima | Peças do TekaFlow |
| `marcas` (OpenAI, Claude, Gemini, Ollama) | Logos Simple Icons, em uma cor | Peças do TekaFlow |

**Variantes novas** (decididas depois que o harness apontou o mesmo remendo repetido):

| Componente | Variantes novas |
|---|---|
| `badge` | `success`, `warning`, `soft`, `muted` |
| `card` | `variant`: `interactive` (hover na borda) e `selected` (contorno da marca). `padding`: `none`, `sm`, `md`, `lg` |
| `progress` | `size`: `thin` (4 px) |

**Fora do shadcn e sem componente próprio:** o cubo (`IconCube`) é o ícone genérico dos modelos sem logo; a barra de rolagem fina e o negrito em 600 são regras do `index.css`.

## Atualização: padronização de ícones e variantes (20 de Novembro de 2026)

| Peça | O que mudou |
|---|---|
| `item` (`ItemMedia`) | Variante nova `box`: a caixinha neutra de 40 px que guarda o ícone nas linhas de modelo, permissão, teste e reunião |
| `bubble` (`BubbleContent`) | Propriedade `size="sm"` para o texto de 12 px do chat flutuante |
| `dialog` | O topo de todo modal tem uma linha divisória embaixo |

**Ícones padronizados:**

| Para quê | Ícone |
|---|---|
| Modelo sem logo próprio, em qualquer lugar (lista de modelos, "Modelos" no menu de Configurações, "Modelo local" e "Modelos locais") | Cubo (`IconCube`) |
| Reconhecimento de voz (permissão) | Orelha (`IconEar`) |
| Apple Speech | Símbolo da Apple preenchido, no onboarding e em Configurações |
| Modo fantasma | Fantasma (`IconGhost`) |

**Harness em 20 de Novembro de 2026:** 35 de 36 componentes aparecem no Style Guide (a exceção é o `theme-provider`, infraestrutura sem aparência); contraste em AA em todos os pares; `shadow-components` sem remendo repetido; `token-lint` só com avisos em dois componentes do shadcn (`scroll-area`, `sidebar`) e com 14 reprovações em `gato-animado.tsx`, que é da outra sessão da marca (máscaras em preto e branco puros). O `api-lint` marca `ItemMedia variant` como se fosse `Item`, falso alarme porque o inventário guarda uma variação por arquivo.

