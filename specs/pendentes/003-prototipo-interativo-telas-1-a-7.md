# 003 · Protótipo interativo das telas 1 a 7 (TekaFlow)

**Estado:** aprovado pelo Carlos em 20 de Novembro de 2026 · **Data:** 20 de Novembro de 2026

## Pedido

Construir o protótipo **final e interativo** das telas 1 a 7, no Design System novo, só com o visual e tudo simulado (sem lógica do aplicativo). Ele clica, vai e volta, e as coisas acontecem, como um arquivo do Figma. Com animação, janela de tamanho fixo, cores e Style Guide novos, componentes e ícones do shadcn. **Na dúvida, pergunta. Não infere.**

Telas: 1 Chegar · 2 Transcrição · 3 Cérebro (3 estados) · 4 Permissões · 5 Testar tudo (**demonstração**) · 6 Contexto (3 estados) · 7 Tela inicial.

## Decisões já tomadas

| Tema | Decisão |
|---|---|
| Alcance | Só front. Nada de áudio, IA, permissões ou arquivos de verdade |
| Base | Componentes do shadcn, ícones do Tabler, tokens e fontes do Design System novo |
| Janela | Tamanho fixo e padrão (1040 por 640) |
| Navegação | Dá para ir e voltar entre as telas |
| Animação | Sim, nas telas. Sóbria, de acordo com o princípio "quieto até ser chamado", e que respeita quem pediu menos movimento |
| Tela 5 | Só demonstração, porque a lógica real ainda não existe |
| Tela 1 | Título novo ("Seu copiloto para chamadas, entrevistas e tal"). **Falta o texto exato** |
| Tela 2 | Logos em preto e branco, **pegos da internet** (conjunto aberto Simple Icons, o mesmo do protótipo antigo). Onde o modelo não tiver logo, uma imagem genérica no mesmo formato |
| Entrega | **HTML único que abre com duplo clique, mais o projeto.** Decidido pelo Carlos |
| Mac e Windows | **Seletor no protótipo** para ver os dois |
| Painel de simulação e casos de erro | **Pendência.** O Carlos avalia o visual de cada tela depois de criadas e refinadas. Até lá, o protótipo mostra o caminho normal e os estados que ele listou (tela 3 em 3 estados, tela 6 em 3 estados) |
| Idioma | Escolhido a cada gravação, já preenchido com o último usado. Na tela 2, o seletor é o "Idioma padrão" e filtra os modelos. "Automático" só para os modelos Whisper |

## Decisões em aberto (bloqueiam a parte que depende delas)

1. **Texto exato do título da tela 1.** Bloqueia a tela 1.

**Resolvidas em 20 de Novembro de 2026:** entrega em HTML único mais projeto; logos pegos da internet; seletor Mac e Windows; painel de simulação como pendência.

## Etapas

| # | O que vou mexer | O que muda pra você | Onde | Skill |
|---|---|---|---|---|
| 1 | Casca do protótipo: janela fixa com a barra do Mac e a do Windows (com seletor), navegação com voltar e transição entre telas | Você abre e clica. A janela tem sempre o mesmo tamanho, e um botão troca Mac e Windows | Projeto `design-system`, rota do protótipo | Produto/DS · `ds-skill` → `ds-new-page` + `impeccable` |
| 2 | Peças compostas das 7 telas: moldura do onboarding, linha de modelo, cartão de provedor, cartão de permissão, linha de teste, cartão de reunião e grupo por dia | As peças entram no Design System e aparecem no Style Guide. Antes de cada uma eu pergunto a base (R-043) | Style Guide, seção nova | `ds-new-component` |
| 3 | Tela 1 Chegar e tela 2 Transcrição, com animação e logos em preto e branco | As duas primeiras telas funcionando | Janela do protótipo | `ds-new-page` + `impeccable` |
| 4 | Tela 3 Cérebro, estados 1, 2 e 3 | Conectar, baixar modelo, pular com aviso | Janela do protótipo | `ds-new-page` |
| 5 | Tela 4 Permissões e tela 5 Testar tudo (demonstração) | Pedido de permissão simulado, testes que "acontecem" | Janela do protótipo | `ds-new-page` |
| 6 | Tela 6 Contexto, estados 1, 2 e 3, com a conversa simulada | Escolher a pasta, perguntar, ver a resposta com fontes e marcar certo ou errado | Janela do protótipo | `ds-new-page` |
| 7 | Tela 7 Tela inicial | Reuniões por dia, botão Iniciar | Janela do protótipo | `ds-new-page` |
| 8 | Conferir e exportar: harness, contraste, escala e o HTML único | Um arquivo para abrir e clicar | Pasta do projeto | `ds-harness` (`commit-guard`, `shadow-components`) + `impeccable` (audit e polish) |
| 9 | Registrar decisões e passar pela revisão independente | Um relatório do que passou e do que ficou pendente | `DECISIONS.md` do projeto | `ds-skill` (fechar rodada) → `review` |

## Casos de erro: pendência

Por decisão do Carlos, **não entram agora**. Ele avalia o visual de cada tela depois de criadas e refinadas e então decide quais simular e se haverá o painel. Os casos completos estão em `jornada/casos-de-erro.md`. Esta é a lista que eu proporia simular depois:

| Tela | O que se simula |
|---|---|
| 2 Transcrição | Download falha no meio e retoma; Mac sem Apple Speech (só modelos locais); modelo que não entende o idioma |
| 3 Cérebro | Login cancelado; login expirado; Ollama não encontrado; modelo grande demais para o Mac; chave de API recusada; sem IA e pular (aviso) |
| 4 Permissões | Microfone negado; gravação de tela que pede reiniciar; no Windows, só o microfone |
| 5 Testar tudo | Microfone sem sinal; IA lenta; seguir mesmo com uma falha |
| 6 Contexto | Pasta vazia; PDF sem texto; arquivo grande demais; pergunta sem resposta nos arquivos; "Não respondeu" |
| 7 Tela inicial | Sem sessões ainda; item pendente do onboarding |

## Fora do recorte

Chat ao vivo, Configurações e Sessões (telas 8 e 9). Lógica real, Electron e instalador. O protótipo antigo em HTML fica como está, no histórico.

## Revisão

Mecânica pelo harness e pelo detector do `impeccable`. Aceite por revisor separado da autoria, pelo `review`. Texto pelo `review-escrita`. Commit só pelos rituais de fechamento, e push só se você pedir.
