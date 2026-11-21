# O que vai ter que mexer para construir o fluxo no React com o shadcn

**Data:** 20 de Novembro de 2026 · **Base:** o protótipo em HTML (v5), em `prototipos/html-v5/`. Ele é a referência. Os componentes do shadcn substituem as peças dele.

**Esforço:** P é pequeno (horas), M é médio (dias), G é grande (semana ou mais). São ordens de grandeza, sem prazo.

## 1. As peças, em ordem de construção

O inventário completo, peça por peça, está em `design-system/inventario-componentes.md`. Esta é a ordem de trabalho.

| # | O que fazer | Peças | Esforço |
|---|---|---|---|
| 1 | Instalar os componentes que faltam do shadcn | `bubble`, `message`, `message-scroller`, `input-group`, `collapsible`, `sidebar`, `empty`, `attachment`, `item`, `spinner`, `skeleton` | P |
| 2 | Adaptar o que existe | Selo de feedback, cartão selecionado, seletor e abas compactos, medidor ao vivo, insight aninhado | M |
| 3 | Criar as peças compostas | Moldura do onboarding, linha de modelo, cartão de provedor, linha de teste, cartão de permissão, cartão de reunião e grupo por dia | M |
| 4 | Criar a casca | Moldura da janela do app (Mac e Windows), janela flutuante do chat, pílula minimizada, transição do Início para as Configurações | G |
| 5 | Atualizar a página de Style Guide | Mostrar cada peça nova, com seus estados | M |

## 2. As telas, depois das peças

| Tela do protótipo | Peças principais | Esforço |
|---|---|---|
| Chegar | `Button`, logo | P |
| 1 Transcrição | Moldura do onboarding, linha de modelo, `Select`, rolagem | M |
| 2 Cérebro | Cartão de provedor, linha de modelo, `AlertDialog`, rolagem | M |
| 3 Permissões | Cartão de permissão | P |
| 4 Testar tudo | Linha de teste | M |
| 5 Contexto | Zona da pasta, `Checkbox`, balões, `input-group`, estado vazio | G |
| Tela inicial | `sidebar`, cartão de reunião, grupo por dia, botão Iniciar | M |
| Configurações | `sidebar`, `Tabs`, linha de modelo, `RadioGroup`, `collapsible` | M |
| Chat ao vivo | Janela flutuante, balões com insight, `message-scroller`, medidores, `input-group`, `AlertDialog` | G |

## 3. O que o protótipo só desenha e o React precisa fazer de verdade

O protótipo é imagem. Estes comportamentos precisam ser construídos junto com a tela:

| Comportamento | Esforço |
|---|---|
| Teste real de microfone, áudio do computador, transcrição e IA, com "testar de novo" | G |
| Pedido e verificação das permissões do macOS | M |
| Escolha da pasta e leitura dos arquivos, com busca dos trechos certos | G |
| Idioma escolhido a cada gravação | M |
| Download de modelo com progresso (transcrição e IA local) | M |
| Salvar a sessão, o resumo e agrupar por dia | M |
| Janela que gruda no canto ao arrastar e modo fantasma | G |
| Transcrição com o Apple Speech (um programa nativo do Mac) | G |

## 4. Mac e Windows

| O quê | Esforço |
|---|---|
| Atalhos mostrando ⌘ ou Ctrl, em um ponto só (já existe em `src/lib/platform.ts`) | P |
| Controles de janela de cada sistema | M |
| No Windows o padrão de transcrição vira um modelo local, porque o Apple Speech é só do Mac | M |
| Permissão de gravação de tela só no Mac | P |
| Testar nos dois, incluindo o instalador (`.dmg` e `.exe`) | G |

## 5. O app existente, em uma olhada

O app que já roda é a fonte da lógica (áudio, transcrição, IA, banco). O visual dele não é aproveitado.

| O quê | Tamanho |
|---|---|
| Tela principal | 2.442 linhas em um componente só, com lógica e interface misturadas |
| Estilo | 1.877 linhas, que saem por inteiro no fim |
| Chamadas ao sistema do app | 56 diferentes (configurações 38, IA 20, janela 13, banco 12, voz 11) |
| Janela | Uma só, transparente e sem moldura. O fluxo pede duas |

Antes de trocar o visual, **separar a lógica da tela principal** em partes (escuta, transcrição, respostas, sessões) e criar uma camada única, com tipos, para essas 56 chamadas. Esse é o maior risco, e é esforço G.

## Ordem que eu sugiro

1. Instalar e adaptar os componentes (itens 1 e 2).
2. Montar as peças compostas e a casca (itens 3 e 4).
3. Separar a lógica da tela principal do app.
4. Chat ao vivo, que é o coração do produto.
5. Onboarding com os testes reais.
6. Configurações e Sessões.
7. Contexto por pasta e o Apple Speech.
8. Apagar o estilo antigo e testar nos dois sistemas.
