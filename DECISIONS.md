# Decisões e respostas do Carlos

Tudo o que o Carlos decide ou responde sobre o TekaFlow entra aqui, em ordem. Quando uma decisão muda, a nova é acrescentada e a antiga fica marcada como substituída. Nada se apaga.

Legenda: **Decidido** · **Em aberto** · **Premissa minha** (preciso que ele confirme).

---

## 1. Produto e jornada (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| O que é | Versão para Mac do Teka (antes OpenPerssua). Concorrente do Perssua e do Parakeet AI. |
| Foco | Interface mais amigável. Ouvir a voz do sistema e a do microfone, e gerar respostas. |
| Estrutura | Três partes: onboarding, chat ao vivo e configurações (como no Perssua). |
| Chat ao vivo | Chat pequeno que ocupa cerca de 30% da tela e pode ser minimizado. Mostra perguntas e respostas. |
| Primeiro momento de uso | Entrevista e chamada de venda. Cenários: Entrevista técnica, Cold call, CEO apresentando, Call em inglês. |
| Transcrição | Apple Speech onde o Mac tiver. Como nem todo Mac tem, o passo precisa funcionar com modelos locais baixáveis, como a lista do Handy. |
| Idioma da chamada | A pessoa escolhe o idioma no início de cada gravação, para ajudar a escolher o modelo. |
| Créditos ou plano pago | **Fora.** Só a conta que a pessoa já tem. |
| Tradução ao vivo | **Em aberto.** Ele respondeu sobre o idioma, mas não sobre a tradução. Fora do desenho por enquanto. |
| Contexto | Primeira versão com arquivos: a pessoa escolhe uma pasta, faz uma pergunta e vê se a resposta saiu certa com base nos arquivos. |
| Front | shadcn com Vite, Radix UI sugerido, TypeScript nas telas novas. |
| Janelas | Duas: chat flutuante e janela principal (início e configurações). |
| Como o front entra no projeto | **Em aberto.** Por enquanto só mapear. |
| Direção visual definitiva | **Em aberto.** Ele define depois. Por ora vale a identidade atual do Teka, com um botão para ver em azul. |
| Antes de construir | Mapear tudo e fazer tudo em HTML primeiro, para revisar o fluxo. |
| Documentação | Toda resposta e decisão dele deve ser registrada neste arquivo. |

## 2. Rodada 1 do fluxo (página de 21 telas)

| Etapa | Escolha |
|---|---|
| Chegar | Gostou da A, mas depois pediu outras opções (ver rodada 3). |
| Transcrição | A (lista com precisão e velocidade), com selos Recomendado e Mais pesado. |
| Cérebro | Não gostou de nenhuma. Pediu a A mais enxuta, com os ícones das empresas. |
| Permissões | B, e depois mudou para a **A** (cartões ilustrados). |
| Testar tudo | A. |
| Contexto | A (a pessoa pergunta e vê a resposta, marca certo ou errado) e também gostou da B (pasta à esquerda, pergunta por voz ou texto). |
| Primeiro uso | C, o botãozinho no canto, com opção de encerrar a sessão. |

## 3. Referências do Wispr Flow (20 de Novembro de 2026)

- **Um único tamanho de janela para todas as telas do app.** Ele disse que isso é importante.
- Faltava a tela inicial e a de configurações. A inicial mostra as reuniões recentes, misturando a tela do Wispr com a do Notetaker.
- Quer ver tudo em HTML primeiro, depois construir.

## 4. Rodada 2: ajustes sobre a versão 2 (20 de Novembro de 2026)

### Geral
- **Espaçamentos:** estavam arbitrários. Usar um padrão único (escala de 8). Ele deixa o refino visual fino para depois.
- **Títulos e descrições centralizados** em todas as telas de onboarding.
- **Etapas numeradas:** 1 Transcrição, 2 Cérebro, 3 Permissões, 4 Testar tudo, 5 Contexto.
- Botões com **hover** visível.

### Chegar (tela 1)
- Não gostou da versão atual. Pediu outras opções.
- **Centralizada, sem as coisas à direita.** (Mensagem seguinte.)

### 1. Transcrição ("Como o Teka vai ouvir você")
- Título e descrição centralizados.
- Usar os **ícones reais** dos produtos.
- Texto como "Whisper, vários idiomas" alinhado à esquerda e equilibrado.

### 2. Cérebro ("Conecte a IA que vai responder")
- Título e descrição centralizados.
- Selo **Recomendado** do ChatGPT **à direita** do cartão.
- **Todos os botões dizem "Conectar"**, com hover.
- Quando a pessoa clica em **Modelo local**, aparece abaixo uma subdivisão com os modelos para baixar, como na tela de transcrição.

### 3. Permissões ("Libere o que o Teka vai precisar")
- Inclui **Acessibilidade**.

### 4. Testar tudo
- No microfone, opção de **testar de novo**.
- Na transcrição, o app **pede para a pessoa falar algo** e mostra o que entendeu.

### 5. Contexto
- Pasta ao lado, à esquerda. À direita, um **chat simulado como o WhatsApp**: a pergunta da pessoa é um balão à direita e a resposta vem à esquerda, com as fontes.
- Mais espaço entre os elementos.

### 7. Tela inicial
- Escolheu a **A**.
- Um **botão evidente de gravar**.
- **Linhas divisórias mais claras**.

### 8. Configurações
- **Não é uma janela sobreposta.** Segue o modelo **C** (cartões por função).
- Ao clicar em Configurações, o conteúdo **desliza para dentro** (move-in). A pessoa volta ao Início e volta à home.
- Botões da direita **do mesmo tamanho**.
- Poder **selecionar outros modelos para baixar** (transcrição) e **outros modelos locais para responder**.

### 9. Chat ao vivo
- **9A aprovado** como base. O estado **Encerrar a sessão faz sentido**.
- **Fixar em um canto não precisa.** Ao arrastar, a janela gruda sozinha no canto mais próximo.
- Conversa em **balões de fala**: os de "Eles" ficam à esquerda e os de "Você" à direita. Dentro do balão da pergunta dos outros fica o **insight "Diga isso"**, ou seja, **um balão dentro de um balão**.
- Sem sublinhado verde em "Ver de onde veio": só o **nome do arquivo, bem pequeno**.
- **Opacidade da janela: 90%.**
- **Tirar a aba Sessão.** Ele não entendeu o que faz por enquanto. Abas são botõezinhos, como no Perssua.
- **Botão de encerrar é parar**, no canto superior direito.
- **Botão fantasma** em cima.
- **Seletor de idioma embaixo.**
- **Medidores de áudio** embaixo, **ocultos por padrão** e abrem ao clicar.
- **Durante a sessão ao vivo não se manda voz.** A pessoa só digita uma pergunta e aparece um balão com a resposta da IA.

### Entregue em resposta a esta rodada
- `jornada/fluxo-v3.html`: onboarding com títulos centralizados e etapas numeradas, escala de espaçamento de 8, hover, ícones reais, tela de modelo local, Permissões com Acessibilidade, Testar tudo com ações próprias, Contexto em balões, Tela inicial A com botão Gravar, Configurações no modelo C com movimento de entrada e downloads de modelos, chat ao vivo em balões a 90% de opacidade.
- **Chegar:** três versões centralizadas e sem coluna à direita (só a promessa; promessa com cinco passos em linha; mostra o produto).

## 4b. Rodada 3: ajustes sobre a versão 3 (20 de Novembro de 2026)

### Padrão visual (vale para tudo)
- **Fontes em múltiplos de 2 ou 4** (escala: 12, 14, 16, 20, 24, 28, 40).
- **Espaçamentos em múltiplos de 2 ou 4**, entre todos os elementos. Ele disse que estava tudo grudado.
- Usar o **Impeccable** para refinar. Refino visual mais fino fica para depois.
- A linha que separa **Voltar e Continuar chega às extremidades** da janela.

### Chegar (tela 1)
- **Escolheu a A (só a promessa).**
- **Tirar o texto "Dá para pular qualquer passo".**

### 1. Transcrição
- Está boa. Mais espaço entre "Disponível neste Mac", o primeiro modelo e entre os modelos.
- **Pode ter rolagem** nessa tela.

### 2. Cérebro
- Está ok. Mais espaço entre os modelos locais.
- **Não dá para pular a etapa.** Se a pessoa clicar em Pular, aparece um modal: sem escolher um modelo, ela não terá respostas ao vivo.

### 3. Permissões
- O espaço entre o título e a descrição ficou grande demais. Usar o padrão.

### 4. Testar tudo
- Botões **do mesmo tamanho** (arredondar para o maior).
- Mais espaço entre as linhas.
- **Ícone do ChatGPT** na linha da IA.
- O botão principal é **Continuar** (não "Testar tudo de novo"). Não dá para pular a etapa.

### 5. Contexto
- **Menos alto:** estava encostando na margem de baixo.
- Divisão **40% / 60%**: 40% a pasta, 60% o chat.
- **Duas versões:** antes de enviar (a pasta é um input) e depois de enviar a pergunta.
- Botão de **falar ao lado do botão de enviar**, como em chat.
- Precisa de **feedback de processamento**. Não é preciso mostrar no protótipo, mas o produto precisa.

### Tela inicial
- O botão **Gravar vira Iniciar**.
- "Reuniões recentes" está pouco visual. Serve como ideia e fica para o refino.

### Configurações
- Estado 2 (Ouvir aberto) está ok, só espaçamento.
- Cada categoria tem **nome, descrição, uma divisória que vai até a borda e a opção selecionada**. O ChatGPT também é uma opção e aparece selecionado.
- **Modelos locais** vem recolhido por padrão, como uma opção (igual Claude Code e Gemini). Ao clicar, expande as subopções.

### Chat ao vivo
- O estado ao vivo está ok. O balão de fala está certo.
- **O insight ("Diga isso") ganha uma cor mais verde.**
- Medidores de áudio: no lugar de "Clique para mostrar", **"Expandir" com uma setinha para cima**.
- **Encerrar a sessão:** o botão quebrava a linha. Pôr **um botão embaixo do outro**.

### Entregue em resposta a esta rodada
- `jornada/fluxo-v4.html`, 19 telas. Conferido no navegador: todas as fontes na escala 12, 14, 16, 20, 24, 28 e 40, e todos os espaçamentos em múltiplos de 4.

### Premissas minhas desta rodada
- O modal de "pular" vale para o passo do Cérebro, porque a mensagem fala de escolher um modelo. Mantive "Pular" só no Contexto, que é opcional.
- "Não precisa ter esse estado de..." ficou cortado nas Configurações. Mantive o estado com Modelos locais recolhido e acrescentei o expandido.
- O estado de processamento do Contexto fica documentado, sem tela.

## 4c. Rodada 4: ajustes sobre a versão 4 (20 de Novembro de 2026)

### Aprovado
- Chegar (tela 1), Cérebro estados 1 e 2, o chat ao vivo ("perfeito") e Encerrar a sessão ("é isso mesmo").

### Padrão de espaçamento entre blocos (vale para todas as listas)
- **Do título da seção até o primeiro item: 16.**
- **Entre os itens: 8.**
- Ele pediu que o título "Disponível neste Mac" e o título "Para baixar" sigam exatamente a mesma regra. Entre uma seção e a seguinte usei **24** (premissa minha).

### 1. Transcrição
- Aprovada, com o padrão de espaçamento acima.
- Ele perguntou se o logo do ChatGPT no Whisper está certo. **Verificação:** o Whisper é um modelo da OpenAI, e o logo usado é o da empresa (o mesmo da marca do ChatGPT). Mantive e acrescentei "No seu Mac" na linha de detalhe para não parecer que usa a nuvem.

### 2. Cérebro
- O aviso ao tentar pular tem **duas saídas**: a principal "Escolher uma IA" e a secundária **"Ok, pular"** (a pessoa fica sem respostas ao vivo). Isso **substitui** a regra anterior de que não dava para pular.

### 3. Permissões
- Título, descrição e etiqueta com o **mesmo espaçamento (8)**, mais próximos entre si.
- Cartões arredondados no topo, com o **botão no pé do cartão**.

### 4. Testar tudo
- O **microfone testa ao vivo**. O **som do computador só quando clica em "Testar de novo"**.
- Cada linha tem as **duas coisas**: um **check** de que está ok e o botão **"Testar de novo"**.

### 5. Contexto
- Aprovado. As **perguntas sugeridas** ficam **alinhadas ao topo à esquerda**, respeitando a margem, e são **mais genéricas** (a pessoa pode estar numa entrevista ou em outra coisa). Botão **Concluir**.

### Tela inicial
- Aprovada, mas a lista de reuniões recentes "está esquisita". Refazer **como o Fireflies** (referências no Figma, telas 1:99 e 1:101): **grupos por dia** (Hoje, Ontem, depois as datas) e **um cartão arredondado por reunião**. Ele gostou do formato quadrado, mas não da diagramação das informações.
- Usar o Impeccable para refinar.

### Configurações
- **Estado 1 era igual ao Início.** Removido.
- Em Modelos, um **seletor com abas (Ouvir e Responder), com ícones**. Em cada aba, **o que está em uso fica separado do que dá para baixar ou escolher**.
- No **estado 4** ele não via nada: as subopções de Modelos locais ficavam fora da área visível. Agora a tela rola até elas.

### Chat ao vivo
- Ícone no campo "Pergunte algo à IA", e o campo **maior**.
- Idioma **menor**: só a bandeira e "PT-BR".
- **Sem os ícones à direita** dos medidores ("não sei para que serve").
- **Redução de eco:** pode ficar, mas **ele não sabe se aparece de cara**. Em aberto.

### Entregue em resposta a esta rodada
- `jornada/fluxo-v5.html`, 18 telas. Conferido no navegador: do título ao primeiro item 16 e entre os itens 8 (medido), fontes na escala e espaçamentos em múltiplos de 4.

## 4d. Próxima fase: reconstruir no shadcn (20 de Novembro de 2026)

- Carlos pediu para **salvar** a versão 5 e **reconstruir o protótipo no shadcn, já encaminhando para o produto**.
- A v5 (`jornada/fluxo-v5.html`) e este registro são a base. As pendências abertas continuam valendo (Redução de eco, tradução, direção visual).
- **Fontes:** ele perguntou qual fonte do shadcn combina mais com a marca e qual é a atual. A atual é **Bricolage Grotesque nos títulos e a fonte do sistema (SF Pro no Mac) no texto**. A lista do shadcn tem 26 fontes e **não inclui a Bricolage**. Decisão **pendente**.
- **Teste de fontes:** Carlos quer testar combinações só com as fontes da lista do shadcn e escolher depois. Conceito dele: gato, sussurro, algo mais discreto (ver `naming/`). Preferência já registrada: tipografia do Perssua, minúscula, redonda e geométrica. Montei `jornada/fontes.html` com **A** Outfit + Figtree, **B** Manrope + Source Sans 3, **C** Instrument Serif + Inter, e a atual para comparar. **Decisão pendente.**
- **Correção minha:** eu disse que a Nunito Sans tem pontas arredondadas. Quem tem é a Nunito; a Nunito Sans não.

## 8. Design System: primeira base (20 de Novembro de 2026)

Plano salvo em `specs/pendentes/002-base-design-system.md`, aguardando aprovação.

| Tema | Decisão |
|---|---|
| Pedido | Primeira base do Design System com style guide super resumido, em cima do shadcn. Harness sempre conferindo o uso. Depois, adaptar o que é do Robert ao visual novo |
| Onde mora | **Projeto Vite novo e separado.** As peças do Robert entram aos poucos, e o resultado vai para o app depois |
| Como roda | **npx** no lugar do pnpm, que não está instalado |
| Preset `b2w230QNJw` | **Já traz a fonte e as cores** que ele escolheu. Vale como direção inicial |
| Espaçamento | **Base 4:** 4, 8, 12, 16, 20, 24, 32, 36, 40, 48. **Sem o 28.** Sempre múltiplos de 4 (de 2 só em exceção) |
| Fontes | Múltiplos de 2 ou 4 |
| Plano | Ele pediu que o plano mostre a **coluna de skills** de cada etapa. Incluída |
| Harness por projeto | O harness geral é o **motor e o padrão**. **Cada projeto tem a sua própria skill de harness**, derivada da geral, com as regras de gate e as regras visuais daquele projeto. A estrutura da skill geral muda para ter um molde disso |
| Em aberto | Todos os componentes do shadcn ou só os usados? Instalar o gancho de commit? Onde mora a skill do projeto? |

### Execução do plano 002 (20 de Novembro de 2026)

- **Mac e Windows:** o produto é para os dois sistemas, como o original. O Design System não assume nenhum deles.
- **Independência:** o sistema novo **não referencia o antigo**. Ele se baseia nele, mas nada nos arquivos do projeto novo aponta para o antigo.
- **Ordem:** ele quer **ver a partir da etapa 4**, a página de Style Guide resumida.
- **shadcn primeiro:** botão é o botão do shadcn. Na dúvida, pergunta. Se faltar algo, avisa.
- Criado o projeto em `design-system/`. Respostas dele: **só escuro por enquanto, com o claro como opção inativa** (depois ele pediu que a página de Style Guide tenha o seletor **Escuro e Claro**, e foi feito); **raios 4, 8, 12 e 16**; **ajustar os meios degraus dos componentes do shadcn**; **só os componentes que o Teka usa**.
- Registro completo, com princípios, no `DECISIONS.md` do próprio projeto novo.

### Continuação do plano 002 (20 de Novembro de 2026)

- **Histórico:** o protótipo em HTML atual (v5) foi salvo como histórico em `historico/prototipo-html-v5/`, com o caso de erros e um LEIA-ME.
- **Cores de feedback:** ele aprovou **derivar** sucesso, alerta e informação **do tom da cor principal**. Feito. O contraste continua em AA nos 26 pares.
- **Inventário:** feito em `design-system/inventario-componentes.md`.
- **Ele pediu** que o inventário leia **principalmente o protótipo em HTML**, porque ele é a base do que será construído, e que **o shadcn substitua as peças dele**. O inventário foi refeito em cima do protótipo.
- **Lista do que mexer:** `migracao/lista-do-que-mexer.md`, com a ordem de construção, as telas, o que o protótipo só desenha e o Mac e o Windows.
- **Achado:** o shadcn já tem balão de fala, mensagem e rolagem de conversa. Só a casca do aplicativo (moldura da janela e janela flutuante) é construída do zero.

- **Instalação:** ele autorizou ("Sim, instalar"). Os 11 componentes entraram e a página de Style Guide ganhou a seção **Conversa, listas e menus**. Detalhes no `DECISIONS.md` do `design-system`.

### Protótipo interativo das telas 1 a 7 (20 de Novembro de 2026)

Plano salvo em `specs/pendentes/003-prototipo-interativo-telas-1-a-7.md`, aguardando aprovação.

- **Pedido:** protótipo **final e interativo** (clica, vai e volta, como no Figma), só front e tudo simulado, **telas 1 a 7**. Tela 3 em 3 estados, tela 5 só como **demonstração**, tela 6 em 3 estados. Com **animação**, **janela de tamanho fixo**, **componentes e ícones do shadcn**, **cores e Style Guide novos**.
- **Regra dele:** **na dúvida, pergunta. Não infere e não cria nada sem ter certeza.**
- **Marcas nos ícones:** o Tabler tem Apple, OpenAI, Google e Meta, e não tem Claude, Ollama nem Qwen. **Decidido pelo Carlos: pegar os logos deles na internet.** Uso o conjunto aberto Simple Icons, em preto e branco. Onde não houver logo do modelo, uma imagem genérica no mesmo formato.
- **Idioma (a dúvida dele):** o Whisper detecta o idioma sozinho, mas erra com frases curtas, sotaque ou línguas misturadas. O Apple Speech trabalha com um idioma escolhido de antemão. Sugestão: manter a escolha no início de cada gravação, já preenchida com o último idioma. Na tela 2, o seletor é o "Idioma padrão" e filtra os modelos. "Automático" só para Whisper. **A conferir na prática.**
- **Entrega:** **HTML único que abre com duplo clique, mais o projeto.** Decidido.
- **Mac e Windows:** **seletor no protótipo** para ver os dois. Decidido.
- **Painel de simulação e casos de erro:** **pendência.** Ele avalia o visual de cada tela depois de criadas e refinadas e então decide.
- **Em aberto:** texto exato do título da tela 1.

## 5. Em aberto

- A Redução de eco aparece de cara no chat ao vivo ou fica em Configurações?

- Tradução ao vivo na v1?
- Como o front entra no projeto (atual ou novo).
- Direção visual definitiva.
- Tamanho de pasta que o contexto precisa aguentar.
- Teste do Apple Speech ao vivo no Mac dele.

## 6. Premissas minhas a confirmar

- A frase sobre o Cérebro "scrollando para baixo, tem que ter..." ficou cortada. Assumi que é a subdivisão de modelos locais que aparece abaixo.
- "Me dá mais 3 versões": assumi que são **3 novas versões da tela Chegar**, todas centralizadas, e que o resto é ajuste direto.
- O botão fantasma é o modo que deixa a janela fora da gravação e deixa o clique passar, como já existe no Teka.
- Dentro do chat ao vivo, no lugar de "Traduzir" fica só a **Redução de eco**, já que a tradução está em aberto.

## 7. Novo nome e logo do gato (20 de Novembro de 2026)

Plano salvo em `specs/pendentes/001-nome-e-logo.md`, aguardando aprovação.

| Tema | Decisão |
|---|---|
| Pedido | Naming turbo em inglês, preservando o Teka (nome do gato do Robert). Benchmark rápido dos concorrentes só consolidado. Ver as logos dos concorrentes lado a lado. Ideia de logo: silhueta de gato ligada à fala, sutil e cauteloso. |
| Grafia | **Decidido:** Teka. |
| Preservar o Teka | **Decidido:** dentro do nome novo, combinado com uma palavra em inglês. |
| Logo nesta rodada | **Decidido:** só o briefing. O desenho espera o nome fechado. |

### 7b. Preferências de logo e tipografia (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Logos que ele gosta | **Verve AI, Cluely e Interview Coder.** |
| Tipografia que ele gosta | **A do Perssua, e só ela.** |
| Premissa minha | As três logos são símbolos sozinhos, então leio como "ícone de gato sozinho mais nome na tipografia do Perssua". Ele confirma. |
| Registro | Entrou em `naming/briefing-logo.md`. |

### 7c. Estado do naming (20 de Novembro de 2026)

Escritos: `naming/benchmark.md`, `naming/nucleo.md` (rota Simbólica proposta, três Cenários pendentes), `naming/briefing-logo.md` e a prancha `referencias/prancha-logos-concorrentes.html`. Aguardam a decisão dele: rota, Cenários, teto e critérios de corte.

### 7d. Decisões do naming (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Formato do nome | **Teka + uma palavra** (exemplos dele: Teka Wispr, Teka Flow). Ele perguntou qual rota eu sugiro: Simbólica. |
| Cenários | Aprovados o **1 (O gato que escuta primeiro)** e o **3 (O gato lá de casa)**. O 2 (O sopro no ouvido) não foi selecionado, mas não está cortado. |
| Teto | 24 |
| Critérios de corte | Sonoridade, Memorização, Conceito, nessa ordem |
| Aviso meu | Wispr e Flow ecoam o Wispr Flow, que ele usa como referência de produto. Tratei como colisão, não como corte dele. |
- **Atualização do naming (20 de Novembro de 2026):** primeiro ciclo fechou com 2 nomes em Atenção (Teka Trill e Teka Purr) e 6 cortados pelo revisor. Ele respondeu que não precisa ir longe: as ideias são **Teka + palavra ligada a fala**. Gerei uma lista rápida, sem revisão independente, em `naming/lista.md`.

### 7e. Nome fechado (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Nome | **TekaFlow**, escolhido por ele entre as opções da lista rápida. Grafia: T e F maiúsculos, junto. |
| Aviso meu | "Flow" lembra o Wispr Flow, referência de produto dele. Disponibilidade (domínio, INPI, loja de apps) não foi checada. |
| Próximo | Logo do gato: o briefing está pronto e agora o nome já existe para o desenho começar. |

### 7f. Estudos de logo (20 de Novembro de 2026)

Ele pediu a logo do TekaFlow no padrão das últimas do Zanuve. Gerei 12 estudos (3 silhuetas por 4 variações) e a assinatura em `logo/index.html`. Ele ainda escolhe quais ficam.

### 7g. Símbolo na malha (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Foco | Primeiro o símbolo, construído em malha de quadrados, com círculos e triângulos. Fontes ficam para depois. |
| Feedback na primeira versão em 8×8 | Os rostos ficaram felizes demais e a boca ficou muito grande, e a forma se afastou dos estudos originais. |
| Ajuste | Voltei às cabeças dos primeiros estudos, em malha 16×16, com olhos só levemente felizes e boca pequena em onda de voz. Página: `logo/simbolo-16.html`. |
| Fontes | Em aberto. Do Afold dele entram Fontshare e Collletttivo como fontes de pesquisa. No Fontshare conferi que carregam: Clash Display, Cabinet Grotesk, Chillax, Satoshi, General Sans, Supreme, Synonym, Switzer e Ranade. |

### 7h. Escolha do C e oito variações (20 de Novembro de 2026)

Ele escolheu a **1C** (cabeça de frente, olhos felizes e boca pequena). Pediu olhos levemente menos curvados e um pouco mais altos, e boca que pareça barra de voz, mais perto dos estudos originais. Gerei oito variações em `logo/oito-variacoes-c.html`.

### 7i. Refino do C: doze variações (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Feedback | Traços da boca ainda grossos. Prefere a boca com três risquinhos, no estilo do Wispr Flow, e quer uma com cinco. A C1 está boa, só com olhos mais finos. A C4 está boa, com a grossura dos olhos igual à da boca. Voltar o detalhe branco por dentro das orelhas. |
| Entrega | Doze variações em `logo/doze-variacoes.html`, com traço fino, olhos com a mesma espessura da boca e orelha por dentro. |
| Premissa minha | "Testa código séries" leu como testar cores. Mostrei as doze em quatro cores. Ele confirma o que quis dizer. |

### 7j. Escolha dos favoritos e novas referências (20 de Novembro de 2026)

Ele gostou da **V2, da V4 e da V5**, e diz que os internos são a V2 e a V5. Falta melhorar o **formato do rosto**. Pediu dez referências de logos de gato, silhuetas, para testar novos formatos. Entreguei `referencias/prancha-gatos-referencias.html`, a partir do roundup do Hongkiat.

### 7k. Trinta referências de rosto (20 de Novembro de 2026)

Ele não gostou das dez primeiras (não servem) e pediu cerca de 30 referências focadas só no rostinho do gato, numeradas, sem seleção na tela: ele diz o número. Entreguei `referencias/prancha-gatos-30.html`.

### 7l. Referências de rosto: as 30 foram recusadas (20 de Novembro de 2026)

Ele recusou `referencias/prancha-gatos-30.html`: logos genéricas e antigas, de roundups de templates. Quer **projetos modernos**, de identidade de marca, e não imagens soltas de busca. Behance responde 403 e Dribbble pede verificação nas ferramentas de busca, então a fonte precisa ser a conta dele no navegador, ou links que ele mande.

### 7m. Trinta referências modernas (20 de Novembro de 2026)

Ele pediu para usar o navegador do app (Dribbble, Pinterest) em vez de roundups. Busquei no Dribbble por data, só 2025 em diante, e montei `referencias/prancha-gatos-modernos.html`: 30 rostos numerados, com link para cada projeto. Pinterest não foi usado.

### 7n. Referências escolhidas e nove variações (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Gostou | **1, 2 e 3** (ícone de app com rosto de gato recortado, são a mesma família), **4** (gato espiando pela borda do ícone) e **9** (rosto de gato que é um balão de fala; gosta da ideia e do formato do rosto). |
| Pedido | Três variações de cada família, no formato dos anteriores. |
| Entrega | `logo/nove-variacoes-referencias.html`: A1 a A3 (rosto recortado), B1 a B3 (gato espiando), C1 a C3 (rosto em balão de fala). |

## Pesquisa de modelos de transcrição (20 de Novembro de 2026)

**Pedido do Carlos:** descobrir os modelos mais populares e gratuitos, os melhores para português do Brasil e o tamanho de cada um, com base na realidade, sem placeholder na tela 2.
**Feito:** `design-system/pesquisa-modelos-transcricao.md`, com tamanhos reais, números de português e fontes.
**Em aberto:** quais modelos entram na tela 2; Apple SpeechTranscriber (pt-BR e tamanho) a confirmar no Mac; modelos Whisper refinados para pt-BR não foram pesquisados.
**Também:** servidores `teka-style-guide`, `teka-prototipo-v5` e `teka-jornada` cadastrados no `.claude/launch.json` do workspace.

## Aprovações do plano 003 (20 de Novembro de 2026)

**Aprovado pelo Carlos:** o plano 003 (protótipo clicável das telas 1 a 7).
**Modelos da tela 2:** os 6 sugeridos, Whisper Small, Medium, Large v3 Turbo, Large v3, Parakeet v3 e Apple Speech (só no Mac, com tamanho e pt-BR a confirmar).
**Título da tela 1:** "Seu copiloto para chamadas e entrevistas".

### 7o. A1 fechado, tipografia e cor (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Símbolo | **A1** escolhido, "perfeito como está". Único ajuste: o gato desce 0,25 de célula (cerca de 4 pixels a 240 pixels) dentro do ícone, para compensação óptica. Arquivo: `logo/TekaFlow-simbolo-A1.svg`. |
| Pedido | Ver a tipografia já aplicada ao lado do símbolo, com cor de fundo: três tons de verde, em fundo verde e em fundo escuro. Ele avisou que isso já define as cores da marca. |
| Entrega | `logo/tipografia-e-cor.html`: oito tipografias do Fontshare e três verdes (Limão #C5EF6B, que é o atual, Verde vivo #8BE04E e Verde folha #3FCB6B), com tinta #161A0C. |
| Em aberto | Qual tipografia e qual verde. A tipografia do Perssua continua sem arquivo de fonte. |

## Peças compostas (20 de Novembro de 2026)

**Decidido pelo Carlos:** as 7 peças compostas saem da composição de componentes do shadcn já instalados. A moldura da janela e a janela flutuante saem do zero.

### 7p. Cor, tipografia e novo pedido de marca (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Cor | **Limão #C5EF6B**, o primeiro verde. |
| Tipografia | **Satoshi** e **Chillax**. Os próximos testes usam só essas duas. |
| Pedidos de teste | Cabeça do gato em branco sobre o grafite, e a logo em fundo claro depois de escolhida a tipografia. Entrega: `logo/cabeca-branca-e-fundo-claro.html`. |
| Novo frente | Definir o posicionamento da marca, o tom de voz e como ficam os textos, incluindo o texto inicial do app. Ele quer perguntas interativas com caminhos, pelo fluxo da `brand-skills`. |

### 7q. Correção da comparação de fundos (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Rejeitado | `logo/cabeca-branca-e-fundo-claro.html`: tirei a silhueta interna do gato em parte dos testes, e ele não gostou. |
| Volta ao anterior | Uma linha por tipografia (Satoshi e Chillax), com três fundos lado a lado: verde, escuro e claro. Sem descrições. Entrega: `logo/comparacao-fundos.html`. |
| Regras | No fundo escuro o ícone é sempre verde. Olhos e boca um pouco mais grossos em todos (de 0,5 para 0,65 de célula). No fundo claro, a cabeça do gato é branca e os olhos e a boca são verdes. |
| Aviso meu | Olhos e boca em limão #C5EF6B sobre a cabeça branca têm contraste de cerca de 1,3 para 1 e quase somem. |

### 7r. Chillax, fundo claro e cor do Teka (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Tipografia | **Chillax** (ele escreveu "Shylax"). Ajustar o espaçamento entre as letras. |
| Fundo claro | O ícone com contorno preto ficou ruim. Quer o ícone em verde também, com um verde mais escuro. |
| Novo teste | Mudar a cor da palavra "Teka" dentro de "TekaFlow". |
| Entrega | `logo/comparacao-fundos-2.html`: três verdes escuros do mesmo tom do limão (#6E9816, #5C7F10, #4A650C), duas versões de cor do Teka por fundo e quatro espaçamentos (de -0,04 a +0,02 de em). |
| Brand | As perguntas de posicionamento, tom de voz e texto inicial não tinham aparecido para ele. Refeitas. |

### 7s. Posicionamento e tom de voz decididos (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Frase | "Para quem está numa reunião ao vivo, o TekaFlow é o copiloto que fica ouvindo ao seu lado e sussurra uma sugestão quando ajuda, usando a IA que você já tem." Descartadas: "Um gato por perto" e "Apoio sem holofote". |
| Tom de voz | **Tranquilo e Despretensioso.** Diretriz dele: o gato é companhia e apoio emocional, ouve e sussurra, sem alarde. |
| Texto inicial | "Ouvindo com você". |
| Rapidez | O app diz o que faz ("sugere durante a conversa") e nunca promete tempo nem resultado. |
| Arquivo | `marca/posicionamento.md`, na raiz do projeto. |

### 7t. Logo: comparação enxuta (20 de Novembro de 2026)

Ele corrigiu: o verde mais escuro vale só para o fundo claro, e a comparação volta ao formato verde, escuro e claro lado a lado. Quer menos opções, e só a palavra "Teka" em outra cor, com o resto igual. Pediu tirar um pouco do peso da fonte. Entrega: `logo/comparacao-fundos-3.html`, com Satoshi no peso 500 e Chillax no 600 (antes os dois no 700), uma linha com a palavra numa cor e uma com só o Teka em outra cor.

## Protótipo: telas 1 e 2 no ar (20 de Novembro de 2026)

**Feito:** casca com janela fixa e seletor Mac e Windows; tela 1 (Chegar) e tela 2 (Transcrição) com os 6 modelos reais. As duas peças compostas usadas ficaram em `src/components/`: moldura do onboarding e linha de modelo.
**Simulado:** o download dos modelos anda de 0 a 100% e depois vira "Usar". Apple Speech só aparece no Mac.
**Sem número inventado:** as barras de precisão e velocidade do v5 não entraram, porque não há medida confiável por modelo. Entraram selos que a pesquisa sustenta (Mais leve, Mais rápido, Mais preciso).
**Servidor:** o `teka-style-guide` usa `--strictPort`; o Vite solto no Terminal ocupava a porta 5180 e impedia o servidor da lista de subir. O Terminal foi fechado.

### 7u. Proporção do símbolo e fundos (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Fonte | Ele disse que o peso tinha caído demais. Fonte final dita: **Satoshi**. Ele também tinha dito que a Chillax era a preferida, então fica a confirmar. A Satoshi só tem os pesos 500 e 700, então o intermediário foi simulado com um traço fino de 0,7 px sobre o 500. |
| Cor da palavra | Sem mudar a cor do Teka: a palavra inteira numa cor só. |
| Fundos | Verde: ícone e palavra em tinta. Escuro: ícone verde (limão), palavra clara. Claro: ícone em verde escuro #5C7F10, com a cabeça branca, para dar contraste. |
| Proporção | Pediu para checar pela aula de dimensionamento do Notion ("Plagiados Identidade Visual", seção Proporção Símbolo - Tipografia). O método: o símbolo ocupa N seções e a palavra fica centrada, cada seção sendo metade da altura das maiúsculas. Entrega: `logo/proporcao.html`, com 2, 3 e 4 seções. |

## Ajustes da tela 2 (20 de Novembro de 2026)

**Pedido do Carlos:** ícone da Apple preenchido, com caixinha em volta, e tudo da linha centralizado na vertical; o mesmo para as demais linhas. Sem o logo da OpenAI nos Whisper: ícone genérico, como o Handy faz. Progresso no rodapé, entre Voltar e Continuar, em versão resumida com pontos e "1 de 5", de tamanho fixo entre as telas. Animação de entrada subindo.
**Feito:** caixinha de 40 px com fundo neutro em todas as linhas de modelo (vale para as próximas telas, porque a peça é a mesma); ícone de onda para os modelos baixáveis; progresso movido para o rodapé da moldura do onboarding, com área de largura fixa; as telas entram subindo e aparecendo, no lugar da deslizada lateral.
**Dúvida do Carlos sobre o fundo escuro:** o fundo do tema escuro é o token `background` do preset (luminosidade 14%, zinc quase preto), não preto absoluto. O cartão é 21%. Mantido; ele decide se a janela do app usa o tom do cartão.

### 7v. Proporção de 4 seções fechada, espaço em teste (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Proporção | **4 seções**, "perfeito de tamanho". |
| Espaço | O espaço entre o símbolo e a tipografia estava distante (era 1,5 seção). Opções: 1, 0,75 e 0,5 seção. |
| Boca do gato | Ele sugeriu aumentar um pouco, para ficar mais distinta. Mostrei a atual e uma maior (barras de 1,1, 2,0 e 1,1 em vez de 0,8, 1,5 e 0,8). |
| Entrega | `logo/espaco.html`. |

### 7w. Espaço, boca e fonte fechados (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Espaço | **1 seção** entre o símbolo e a palavra. |
| Boca do gato | A **maior** (barras de 1,1, 2,0 e 1,1). |
| Proporção | 4 seções. |
| Fonte | **Chillax** ("Shylax"). A Satoshi saiu. Ele pediu um peso abaixo do 700. Comparação: `logo/peso-chillax.html`, com 700, 600 e 500. |
| Erro meu | Na página anterior usei a Satoshi, por ter lido "fonte Satoshi" na mensagem dele. A Chillax é a certa. |

### 7x. Chillax 600 e o quase preto (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Fonte | **Chillax 600** fechada. |
| Pedido | Não quer o preto absoluto. A cor serve de fundo, de texto e de botão, então precisa combinar com o limão e ter bom contraste. |
| Opções | `logo/preto.html`: Oliva escuro #1A2010, Grafite quente #1C1B17, Grafite neutro #1A1B1E e Verde floresta #0F1A12. Todas com contraste de 12,7 a 13,5 para 1 com o limão. |
| Sugestão minha | Oliva escuro #1A2010, que tem o mesmo tom do limão. A alternativa segura é o Grafite quente, que o Teka já usa. A escolha é dele. |

## Ícone dos modelos baixáveis (20 de Novembro de 2026)

**Decidido pelo Carlos:** o cubo (Tabler `IconCube`) é o ícone genérico dos modelos sem logo próprio. Caixa e cubo são o mesmo ícone. Vale para as próximas telas.
**Também:** títulos com 0,5% de espaço entre letras; barra de rolagem fina; progresso em barrinhas de 16 por 4 px.

### 7y. Logo fechada e marca exportada (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Logo | **Fechada.** Símbolo A1, boca maior, 4 seções, espaço de 1 seção, Chillax 600, palavra numa cor só. |
| Cor do "preto" | **Grafite neutro #1A1B1E.** Sem preto absoluto. |
| Fonte | Chillax só na palavra da logo. As fontes testadas nesta rodada não alteram as fontes da marca, e a tipografia da interface do app não muda. |
| Exportado | Pasta `marca/`: 10 SVGs (símbolo e logo horizontal em escuro, limão, claro e uma cor, mais a palavra em contornos), `cores/cores.css` e `cores.json`, `README.md` com as diretrizes e `previa.html`. |
| PRODUCT.md | A seção Brand Commitments foi atualizada com o nome TekaFlow e as cores. |
| Em aberto | Área de respiro, tamanho mínimo (a 16 pixels a boca some), ícone do macOS e da barra de menu, versão vertical e a cor da superfície escura #25262A, que foi proposta por mim. |

## Espaço entre título de seção e primeiro modelo (20 de Novembro de 2026)

**Pedido do Carlos:** aproximar "Já está no seu Mac" e "Para baixar" do primeiro modelo de cada grupo.
**Feito:** de 16 para 8 px na tela 2. Reabre a regra anterior (título a 16, itens a 8) só nesta tela; as demais seguem a regra até ele pedir.

### 7z. Fundo escuro, proporções e área de respiro (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Fundo escuro | Ele sugeriu o ícone e o gato todos em branco no fundo escuro e pediu o teste. Entrega: `logo/fundo-escuro-branco.html`, com o limão atual, o branco puro #FFFFFF e o off-white #F1EFE9. **Ainda não aplicado nos arquivos da marca**, que seguem em limão até ele escolher. |
| Proporções | Verificadas nos SVGs horizontais: ícone com 2 vezes a altura das maiúsculas, espaço de 1 seção, ícone centrado, razão de 4,601, sem largura nem altura fixas. |
| Área de respiro | Ele pediu para definir, entre 1 seção, 2 seções e um símbolo inteiro (4 seções). Defini **2 seções**, com 4 seções para peças grandes. Desenhos em `marca/logo/area-de-respiro.svg` e `_construcao/area-de-respiro.html`. |

### 8. Fundo escuro consolidado (20 de Novembro de 2026)

Ele manteve o **limão** no ícone do fundo escuro e escolheu **branco puro** para a palavra e o texto sobre o grafite, no lugar do off-white. O off-white #F1EFE9 saiu da paleta. Regenerei os SVGs (`palavra-branco.svg` no lugar de `palavra-off-white.svg`), as cores, a prévia e o guia. Ele pediu mais perguntas de posicionamento e a definição da frase.

### 9. Frase, tagline, público e diferencial (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Frase de posicionamento | "Para quem está numa reunião ao vivo, o TekaFlow é o copiloto que fica ouvindo ao seu lado e sussurra uma sugestão quando ajuda, com a IA que você já usa." |
| Tagline | "Ouve junto e sussurra quando precisa." (as palavras dele) |
| Público | Qualquer reunião ao vivo. |
| Diferencial | Local, direto e mínimo, simples de usar, amigável, sem mil configurações. Fica por perto como um gato. Configurou, está ali, ajuda, funciona e é de graça. |
| Aviso meu | "Totalmente local" e "de graça" não valem ao pé da letra: com ChatGPT, Gemini ou chave de API a conversa vai para o serviço, e a conta de IA da pessoa pode ter custo. O texto da marca usa "roda no seu Mac" e "sem assinatura nem créditos próprios". Tabela em `marca/posicionamento.md`. |

## Tela 1 refeita e tela 3 no ar (20 de Novembro de 2026)

**Pedido do Carlos:** tela 1 mais criativa, na linha do Jitter (diagramação diferente), do Sweatpals (texto grande) e do Artlist (texto à esquerda, visual à direita), com o botão no rodapé à direita, como nas outras telas.
**Feito, tela 1:** texto grande à esquerda; à direita uma cena com degradê verde e azul, uma pergunta, uma onda de voz animada e a resposta "Diga isso" em balão verde; botão Começar no rodapé, à direita. O título usa 40 px, o teto da escala de fontes do sistema.
**Feito, tela 3 (Cérebro):** seis provedores em cartões (ChatGPT, Claude Code, Gemini, Ollama, Modelo local, Chave de API), com logos reais exceto no modelo local e na chave. Conectar é simulado (1,6 s e vira "Pronto"). Escolher o modelo local abre a lista de modelos com download simulado. Pular, ou continuar sem nada escolhido, abre a confirmação "Escolha uma IA para continuar".
**Em aberto:** os mini-fluxos reais de cada provedor (login com espera e cancelar, campo da chave, busca do Ollama) seguem como pendência a propor; os tamanhos dos modelos locais são de exemplo, porque a pesquisa de modelos de linguagem não foi feita; Ollama aparece como "Não encontrado" fixo.

### 10. Posicionamento consolidado (20 de Novembro de 2026)

Correções dele: o app é para o computador (Windows também), não só para o Mac, e o gato sussurra "quando precisa", não "quando ajuda". Frase, tagline e texto inicial foram ajustados. O posicionamento foi enxugado ao essencial e movido para `marca/posicionamento.md`, e o guia `marca/README.md` foi reduzido a logo, cores, tipografia e uso, sem bastidor. O PRODUCT.md ainda descreve o produto como app de Mac, e isso precisa de revisão. Em aberto, fora do guia: tamanho mínimo, ícone do app no sistema e na bandeja, versão vertical e a superfície escura #25262A.

### 11. PRODUCT.md atualizado para Mac e Windows (20 de Novembro de 2026)

Plataforma, público, propósito e posicionamento do `PRODUCT.md` agora dizem Mac e Windows e reunião ao vivo como contexto principal. Entrevista e chamada de venda ficam como casos dentro dela. As permissões e a transcrição nativa do Windows ainda não foram mapeadas, e isso está escrito no arquivo.

## Cores da marca TekaFlow no Design System (20 de Novembro de 2026)

**Pedido do Carlos:** usar as cores e a logo novas da marca, criar a escala de cores a partir do novo verde e trocar o neutro pelo da marca; mostrar o Style Guide.
**Fonte:** `marca/README.md` e `marca/cores/` (limão #C5EF6B, grafite neutro #1A1B1E, verde escuro #5C7F10, superfície escura #25262A, branco).
**Feito:**
- Duas escalas de 50 a 950, nos tokens: `brand` (o limão é o 300, o verde escuro é o 700) e `grafite` (a superfície escura é o 900, o grafite neutro é o 950).
- Tema escuro: fundo grafite neutro, cartão na superfície escura, primária limão com texto grafite. Tema claro: fundo branco, primária verde escuro com texto branco, como a marca define no "uso por fundo".
- Sucesso, alerta e informação foram derivados de novo, porque a primária mudou, um conjunto por tema. Todos os 26 pares de contraste passam em AA.
- Style Guide com a logo no topo (versão escura ou clara conforme o tema), as duas escalas com o valor hexadecimal lido direto dos tokens e o texto de cores atualizado.
**Observação:** a superfície escura #25262A está marcada como proposta, não aprovada, no README da marca. Foi usada como cartão do tema escuro e como passo 900 do grafite.
**Em aberto:** trocar "Teka" por "TekaFlow" no título da janela e nos textos do protótipo, e pôr a logo na tela 1.

### 12. Companheiro discreto (20 de Novembro de 2026)

Ele pediu para trazer a ideia de ficar invisível como **discreto**: o TekaFlow é o companheiro discreto que ouve junto e sussurra quando precisa. Orientou que isso vale para a marca, ou seja, posicionamento, tom de voz e textos, e não para o funcionamento do produto.

| Tema | Decisão |
|---|---|
| Frase | "Para quem está numa reunião ao vivo, o TekaFlow é o companheiro discreto que fica ouvindo ao seu lado e sussurra uma sugestão quando você precisa, com a IA que você já usa." |
| Tagline | "Seu companheiro discreto que ouve junto e sussurra quando precisa." |
| Tom | O discreto entra dentro do Tranquilo, como voz baixa e sem alarde. Os dois tons seguem Tranquilo e Despretensioso. |
| Invisível | A marca nunca diz "invisível" nem "indetectável". Diz discreto. |

## Ajustes das telas 1 e 2 com a marca nova (20 de Novembro de 2026)

**Pedido do Carlos:** tela 1 mais parecida com o que já existia (pergunta de "Eles" com a resposta dentro), nas cores novas, com o verde mais claro, menos sóbria e com um pouco de ruído. Tela 2: botão Usar do mesmo tamanho do Baixar, barra de download mais baixa, hover no cartão inteiro, descrição em cada modelo, estado de selecionado mais claro. Feedback ajustado às cores novas. Nome do app: TekaFlow em tudo.
**Feito, tela 1:** o balão "Eles" traz a pergunta e, dentro dele, o balão verde "Diga isso"; fundo em degradê do limão ao verde médio, com ruído fino e uma onda de voz; logo horizontal da marca no lugar do selo "Para Mac e Windows".
**Feito, tela 2:** todas as ações da linha (Baixar, Usar, Em uso, progresso) têm a mesma largura de 112 px; o progresso virou uma barra de 4 px com a porcentagem; hover muda borda e fundo do cartão; cada modelo tem uma descrição de uma frase mais uma linha de dados; o selecionado ganha borda e anel na cor da marca, ícone preenchido e um "Em uso" cheio.
**Descrições baseadas na pesquisa:** Small, "o mais leve"; Medium, "mais preciso, pede mais memória"; Turbo, "cerca de 8 vezes mais rápido que o Large, melhor com placa de vídeo"; Large v3, "o mais preciso em português entre os medidos"; Parakeet v3, "25 idiomas europeus, incluindo português". A frase "No seu computador" saiu da linha de dados.
**Feedback:** sucesso, alerta e informação reajustados (verde mais próximo da marca, azul um pouco mais frio); todos os 26 pares seguem em AA.
**Nome:** TekaFlow no título da janela, na tela 1, na tela 2 e na dica da tela 3.
**Dúvida:** "deixa o loading menor, o baixar, menor em altura" foi lido como a barra de progresso; o botão Baixar manteve a altura.

### 13. Frases curtas, concorrentes e moodboard (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Frases curtas | Ele quer ver o nome seguido de um descritivo (assistente, companheiro ou copiloto de reuniões), como o título de um resultado de busca. Entrega: `marca/frases-curtas.html`, com doze opções numeradas e os concorrentes como aparecem hoje. Ele escolhe pelo número. |
| Concorrentes salvos | `referencias/concorrentes.md` guarda título e descrição de cada um, com o caminho das logos. O Parakeet AI não foi capturado do site oficial, porque a página abriu num gerador de currículo. O Sensei AI não tem logo salva. |
| Moodboard | Primeira versão em formato bento, com o que já está decidido (logo, cores, tipografia da logo, tom de voz, texto inicial, sugestão na tela). Elementos gráficos, fotografia e ícones ficaram como espaços a definir. Entrega: `marca/moodboard.html`. Ele vai mandar referências. |

## Telas 4 a 7 do protótipo (20 de Novembro de 2026)

**Feito:** as sete telas do pedido estão navegáveis, com a janela fixa e o seletor Mac e Windows.
- **4, Permissões:** quatro cartões com faixa de cor e ícone (Microfone, Gravação de tela e áudio, Reconhecimento de voz, Acessibilidade). Permitir é simulado e vira "Concedido". No Windows, Reconhecimento de voz não aparece. A gravação de tela traz o aviso de reiniciar o app.
- **5, Testar tudo:** demonstração. Quatro linhas com marca de estado, nível do microfone ao vivo, Testar de novo (1,4 s de teste) e Reconectar na IA, que vira "Conectado e respondendo".
- **6, Contexto:** três estados no mesmo lugar. Sem pasta, com a pasta e os arquivos marcados, e com a pergunta respondida e as fontes. O arquivo grande demais fica desmarcado e travado.
- **7, Tela inicial:** menu lateral com a logo, boas-vindas, cartão "Pronto para a sua próxima chamada" com Iniciar e o atalho, números do uso e reuniões recentes por dia. Dados de exemplo. Iniciar, Sessões, Contexto e Configurações ainda não levam a lugar nenhum.
**Verificação:** as sete telas foram abertas no navegador sem erro no console. token-lint com dois avisos amarelos, ambos em componentes do shadcn (`scroll-area` e o trilho de 2 px do `sidebar`). 26 pares de contraste em AA.
**Pendências:** passo 3 (Cérebro) sem os fluxos reais de login; descrições dos modelos locais; janela de chat ao vivo, Configurações e casos de erro, que ficam fora das telas 1 a 7; revisão independente e exportação em HTML único (passo 8 do plano 003).

## Rodada de ajustes das telas 1 a 5 (20 de Novembro de 2026)

**Pedido do Carlos e o que foi feito:**
- **Tela 1:** o fundo verde claro não agradou. Voltou ao degradê escuro de antes, agora com o verde da marca, azul e verde de apoio e o ruído mais discreto. A onda de voz ficou em verde da marca.
- **Peso dos títulos:** menos 100. Os títulos principais passaram de 600 para 500 e todo texto em negrito de 700 para 600, no sistema inteiro.
- **Tela 2:** a caixinha do ícone não muda de cor quando o modelo é selecionado (o destaque fica na borda, no fundo e no "Em uso"). O círculo numerado saiu do título das etapas, em todas as telas do onboarding.
- **Tela 3 (Cérebro):** cada provedor tem uma descrição; dá para conectar mais de um e escolher qual responde. O escolhido ganha contorno verde e a etiqueta "Selecionado"; os outros conectados mostram "Conectado" e o botão "Usar esta". Clicar em Conectar abre a janela de conexão do provedor: entrar no navegador com espera e cancelar (ChatGPT e Gemini), conferir o login do terminal (Claude Code), procurar o Ollama com opção de baixar, campo da chave de API. Tudo simulado. Para isso entrou o componente `dialog` do shadcn.
- **Tela 4 (Permissões):** cores trocadas pelas da marca. Faixa com um brilho suave do verde e ícone verde numa caixa neutra, em vez de quatro cores diferentes.
- **Tela 5 (Testar tudo):** microfone e áudio do computador só ficam "Ao vivo", com a barra, enquanto o teste roda (4 s). Fora disso mostram o ícone de certo e a etiqueta "Funcionando".
**Dúvida:** o Carlos escreveu "tela 1" e "Biblioteca Flow ali, a etapa 3"; foram lidos como a tela de modelos e a tela de permissões, na ordem do onboarding.
**Corrigido no caminho:** um temporizador que cancelava a conexão simulada antes de terminar.

### 14. Moodboard 16:9, cor secundária, grafismos e degradês (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Moodboard | Passou para 1920 por 1080, só a imagem com respiro, sem texto em volta, como o do Soma. Cores ordenadas por uso: grafite neutro, branco, limão, superfície, verde escuro, com a secundária e os degradês como espaços a definir. Arquivos: `marca/moodboard.png` e `marca/moodboard.html`. |
| Cor secundária | Ele sugeriu uma cor em contraste com o verde, já que a marca usa dois tons de verde. Opções em `marca/cor-secundaria.html`: violeta #7B61FF, coral #FF6B4A, azul céu #5BC0FF e rosa #FF7AB6. |
| Degradês | Quatro degradês com as cores atuais na mesma página. |
| Referências | Behance devolveu os mesmos projetos genéricos para qualquer busca, então as treze referências de grafismos e degradês vêm do Dribbble: `referencias/prancha-grafismos.html`. |
| Elementos gráficos | Pelo método da brand-grafismos: três mecanismos propostos (sussurro, orelhas, penumbra), a explorar depois do corte dele. |

### 15. Pasta renomeada e chats organizados (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Nome da pasta | `Projects/Teka Mac` passou a `Projects/TekaFlow`. Atualizei o nome nos textos em Markdown, o `.claude/launch.json` (três caminhos de servidor local) e a memória do projeto. |
| Revisão de escrita | Varredor de cacoetes rodado nos textos do projeto. Dois achados corrigidos (um título e uma frase em gerúndio). Nenhum travessão. |
| Chats | Seção "🐈 TekaFlow" criada na barra lateral com os dois chats do projeto que encontrei: "Naming e logo para produto" e "Arquivo para Mac". Um terceiro chat não apareceu na busca. |
| Próximo | Busca de cerca de 40 referências de imagem e fotografia no estilo de marcas digitais modernas, como o Wispr Flow. Só depois da autorização dele. |

## Links de localhost sempre clicáveis (20 de Novembro de 2026)

**Regra do Carlos:** todo link de servidor local do protótipo e do Style Guide aparece como link clicável, de fácil abertura no navegador, porque o navegador interno às vezes não abre.
**Feito:** tabela "Links para abrir no navegador" no `README.md`, regra no `design-system/CLAUDE.md` e memória global.

### 16. Azul céu, referências escolhidas e conceitos visuais (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Cor secundária | **Azul céu #5BC0FF**, incorporada à paleta (`marca/cores`, README e moodboard). Os degradês combinam limão e azul céu. |
| Referências escolhidas | Das treze da prancha de grafismos: 1 (padrão de pixels), 5, 10 (faixas em ângulo), 11 e 13 (vidro), 12, 8 (névoa) e 4. Traços em comum: vidro, degradê, pixel que se dissolve e faixas em ângulo. |
| Pedido | Como as ideias da marca viram grafismo e elemento visual, usando semiótica. Entrega: `marca/semiotica-tekaflow.md` e o moodboard `marca/conceitos-visuais.png` (1920 por 1080), com oito conceitos: sombra de orelhas, olhos no escuro, duas formas de vidro, barras de sussurro, balão de vidro, linhas de relevo, faixa de orelhas e cartão com orelhas. |
| Busca de imagens | Autorizada por ele para cerca de 40 referências de fotografia e imagem no estilo do Wispr Flow e de marcas digitais modernas. |

### 17. Conceitos de grafismo, em bruto (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Feedback | Ele não gostou dos exemplos do moodboard de conceitos. Gostou das **orelhas**. A barra de som vai existir de qualquer jeito, mas ele quer outro elemento gráfico, com linhas diferentes. Não quer cara de IA nem de degradê, como no Wispr Flow (barras e texto em arco) e no Parakeet AI (degradê verde com grão). Pediu conceitos em HTML, mais brutos, e não moodboard. |
| Entrega | `marca/conceitos-grafismo.html`, com nove conceitos chapados em limão, azul céu e grafite: eco de orelha, cartões com orelhas, bigodes, cauda, olhos entreabertos, abas com orelha, serrilha de orelhas, barras com orelha e duplo contorno. |
| Busca de imagens | Pausada. Foram levantadas cerca de 30 imagens de sites de marcas digitais (Wispr Flow, Dia, Cluely, Krisp, Raycast, Granola e outras), ainda não montadas em prancha. |

## Ajustes: ícone, números, seleção e Permissões em três opções (20 de Novembro de 2026)

**Pedido do Carlos e o que foi feito:**
- **Ícone da aba:** o símbolo da marca (gato em limão) no lugar do ícone do Vite; título da aba "TekaFlow".
- **Linha do selecionado:** o anel de fora saiu; sobra só a borda de 1 px na cor da marca, nos modelos de transcrição e nos cartões do Cérebro.
- **Números dos títulos:** voltaram, como texto simples e sem o círculo: "1. Como o TekaFlow vai ouvir você", "2. Conecte a IA que vai responder" e assim por diante.
- **Permissões:** sem o degradê de cima; começa como se nada tivesse sido configurado (tudo pendente); o microfone tem um seletor de qual microfone usar, que fica travado com "Permita o acesso para escolher" até liberar; os cartões têm tamanho fixo e não mudam ao permitir. Medi as alturas antes e depois de liberar nas três opções, e nenhuma mudou.
- **Opções para testar:** a casca mostra "Opção A, B, C" abaixo da janela nas telas que têm variantes. A: quatro cartões na mesma altura. B: uma linha por permissão, com o controle à direita. C: grade de dois por dois com o ícone ao lado do texto.
**Aguardando:** o Carlos escolher a opção de Permissões. Os microfones da lista são de exemplo.

## Tela 1: conversa que se monta sozinha (20 de Novembro de 2026)

**Pedido do Carlos:** a cena da direita deve aparecer como uma conversa, com carregamento entre as falas: eles perguntam, a IA sugere a resposta e a pessoa responde complementando. O degradê deve se mexer levemente, bem devagar.
**Feito:** linha do tempo de 12,5 s que recomeça sozinha. Eles digitam (0,7 s), a pergunta aparece (2 s), dentro do balão a sugestão "Diga isso" carrega (2,9 s) e aparece (4,2 s), depois "Você" digita (6,2 s) e responde com a sua versão (7,4 s). As manchas de cor do fundo derivam em ciclos de 28, 34 e 40 s. Com "reduzir movimento" ligado no sistema, a conversa aparece pronta e parada.
**Texto da resposta do "Você":** "Na migração do checkout, defendi manter a fila até medir a latência. O time revisou o plano e entregamos sem queda." É texto de exemplo.

## Tela 1 com GSAP (20 de Novembro de 2026)

**Pedido do Carlos:** a animação por tempo ficou inorgânica e grossa. Pôr o gatinho no topo, ouvindo, com menos barras; usar GSAP, com movimentos de subida; na sugestão "Diga isso", um pequeno carregamento com um ícone de IA pensando e o texto se formando aos poucos, não de uma vez.
**Feito:** o GSAP entrou como dependência do projeto (`gsap`). No topo, o gato da marca respira devagar, com três anéis de escuta que se expandem e cinco barras (no lugar de catorze) que mudam de altura e de ritmo a cada ciclo. As balões sobem com desaceleração; cada texto se forma palavra por palavra. Em "Diga isso", o ícone de brilho gira e pulsa enquanto os pontinhos carregam, e só depois a sugestão se forma. As manchas do fundo andam por caminhos aleatórios de 14 a 22 s. Com "reduzir movimento" ligado, tudo aparece pronto e parado.
**Verificação:** a sequência foi vista em três momentos, e as palavras se formam aos poucos. Não foi avaliado o ritmo em movimento; o Carlos ajusta vendo.

## Espaçamentos padronizados, cores do escuro e animação só no conteúdo (20 de Novembro de 2026)

**Pedido do Carlos e o que foi feito:**
- **Espaçamentos do onboarding:** título e descrição passaram de 8 para 4 px (metade). Da descrição ao primeiro conteúdo ficou em 32 px em todas as etapas, e o topo em 48 px. Medi nas etapas 1 a 4 e os três valores são iguais.
- **Etapa 2 (Cérebro):** saiu a dica "Sem conta de IA? Escolha Modelo local".
- **Etapa 3 (Permissões):** mais espaço dentro dos cartões (20 px de margem interna, 16 px entre o ícone e o título, 8 px entre título, motivo e aviso); etiqueta Pendente, Opcional ou Concedido no canto superior direito; o seletor de microfone ficou menor (32 px de altura, texto de 12 px). A opção C também recebeu a etiqueta no canto.
- **Etapa 4 (Testar tudo) e feedback no escuro:** o vermelho e o verde chapados foram trocados por fundo transparente de 15% com o ícone na cor. No tema escuro, os tons de erro, sucesso, informação e alerta ficaram mais suaves (erro `#E47C75`, sucesso `#6DC799`, informação `#6EB7E6`, alerta `#EBBC63`). Contraste em AA nos 26 pares.
- **Animação de passar:** só o conteúdo interno sobe e aparece; o rodapé com Voltar, o progresso e Continuar fica parado. Vale para todas as telas.
**Dúvida:** "1" e "2" foram lidos como as etapas numeradas do onboarding (1 Transcrição, 2 Cérebro).

## Tela 1: sem o gato no topo, fala em barrinhas e resposta mais humana (20 de Novembro de 2026)

**Pedido do Carlos:** tirar o gato do topo; ele aparece no lugar da IA, em "Diga isso". Quem fala (eles e a pessoa) mostra primeiro cinco barrinhas de voz e só depois o texto. A resposta da pessoa deve soar humana, sem copiar a sugestão. Depois de uma pausa, a animação recomeça.
**Feito:** o topo ficou só com a conversa. As barrinhas de voz aparecem em "Eles" e em "Você" antes do texto. Em "Diga isso", o gato da marca no lugar do ícone de brilho pulsa enquanto os pontinhos carregam. A resposta passou a ser: "Teve sim. Na migração do checkout eu achava arriscado trocar a fila sem medir antes, então levei um teste de carga pro time. Eles revisaram o plano e a gente entregou sem queda." A pausa antes de recomeçar subiu para cerca de 5 s.

## Permissões: opção A escolhida (20 de Novembro de 2026)

**Decidido pelo Carlos:** a opção A da tela de Permissões, quatro cartões de altura fixa. As opções B e C saíram do código; o seletor de opções da casca continua disponível para outras telas, e hoje está vazio.
**Ajuste pedido:** o seletor de microfone sobe, logo abaixo do motivo; o texto "Permita o acesso para escolher" desce, centralizado, junto do botão Permitir.
**Espaçamento:** a margem de cima do título e o espaço entre a descrição e o primeiro conteúdo são ambos de 32 px em todas as etapas. Confirmei no código; a medida pelo navegador veio 16 px maior por causa da animação de entrada ainda em curso. Se visualmente o topo parecer maior, o Carlos diz e eu baixo.
**Tela 2:** aprovada como está.

## Coerência das animações e "Configurar depois" (20 de Novembro de 2026)

**Pedido do Carlos:** o chat da etapa 5 deve ter as mesmas animações da tela 1 (a IA pensa, a resposta se forma), e a etapa 5 precisa de uma saída para configurar depois.
**Feito:** a pergunta enviada sobe; a IA aparece com o gato da marca e os pontinhos de "pensando" (cerca de 1,5 s); a resposta se forma palavra por palavra; depois sobem as fontes e o "Respondeu certo?". As peças da animação (palavras, pontinhos e barrinhas de voz) viraram componente compartilhado entre a tela 1 e o Contexto. O botão "Pular" da etapa 5 passou a se chamar "Configurar depois". Nas demais etapas continua "Pular".
**Observação:** "ChatGPT 5" e "página 5" foram lidos como a IA que responde no chat da etapa 5 de Contexto.

## Balões que crescem e arquivos citados (20 de Novembro de 2026)

**Pedido do Carlos:** no "Diga isso" da tela 1, mostrar embaixo da sugestão, bem pequenos, os arquivos que ela cita (um .md e um .docx); os balões devem crescer conforme a pessoa fala, e isso vale para o primeiro também.
**Feito:** abaixo do texto da sugestão sobem duas etiquetas pequenas: `briefing-vaga.md` e `historico-projetos.docx`. As palavras agora só ocupam espaço quando aparecem, então todos os balões (Eles, Diga isso, Você e a resposta do chat da etapa 5) crescem a cada palavra, em vez de nascer no tamanho final.
**Verificado:** em quatro capturas seguidas o balão de Eles cresce, o "Diga isso" cresce dentro dele e as etiquetas aparecem no fim.

## Rosto final do gato e logos finais (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Logo final | **Duas formas valem como logo final, com a marca quadrada como principal.** A logo principal e o símbolo principal são sempre os com o quadradinho em volta (gato dentro do ícone). O gato sem o quadrado é a **logo versão 2**: entra só quando o contexto pede e quando o Carlos disser. Na dúvida, usar a quadrada. |
| Olhos | Expressão **Contente**: arcos para cima. Ele gostou de toda a primeira fila da grade de olhos (Contente com as cinco bocas). |
| Boca | **Boca 1**: três barras de 1,0, 1,7 e 1,0 de altura. É a boca de "não falando" aumentada, perto do "falando" (1,1, 2,0 e 1,1). Mantém os três risquinhos. Os outros estados da boca (falando, quieta, sem boca) ficam para a animação. |
| Traço | 0,55 nos olhos e na boca (antes 0,65), igual nos dois. No fundo escuro ele quer tirar 0,05 (0,50), o que cria uma diferença visual entre os dois fundos; **a testar**, ainda não aplicado nos SVGs. |
| Orelhas | **Triângulo** pequeno dentro de cada orelha (entre o risquinho e o triângulo, ficou o triângulo). Volta o detalhe que existia no estudo original. |
| Gato sem o quadrado | Silhueta preenchida e rosto vazado, com a palavra a 1 seção de distância, centrado nas maiúsculas. Cores: limão no escuro, verde escuro no claro, grafite no limão. |
| Arquivos | `marca/logo/` agora tem 18 SVGs: os 10 anteriores com o rosto novo, mais 4 do gato sozinho (`gato-*.svg`) e 4 do gato com a palavra (`logo-gato-*.svg`). O gerador é `_construcao/exportar.py`, com as peças em `_construcao/gato.py`. |
| Documentos | `marca/README.md` atualizado (tabela de arquivos e medidas). |
| Provas | `marca/expressoes-gato.html` (grade de olhos por boca), `marca/logos-finais-teste.html` (boca e orelha em teste) e `marca/teste-rosto.html` (pixels reais). Abaixo de 32 px o rosto vira mancha nas duas formas; a silhueta ainda lê como gato até 16 px. |
| Em aberto | O traço 0,50 no fundo escuro; tamanho mínimo e versão para o ícone da barra de menu; versão vertical. |

## Fechamento do primeiro protótipo e início do segundo (20 de Novembro de 2026)

**Pedido do Carlos:** fechar a primeira versão do protótipo do onboarding, usar o harness para garantir consistência, e começar em paralelo as demais telas num protótipo separado, com um atalho no primeiro para pular direto ao fim.
**Feito no primeiro protótipo:** gato sem o quadrado como avatar da IA em "Diga isso" (arquivo novo `gato-fundo-escuro.svg`, da pasta `marca`); a animação da tela 1 fica 9 s parada antes de recomeçar; atalhos no topo: seletor "Ir para a tela", botão "Pular para o final" (tela inicial) e link "Protótipo do app".
**Harness:** o harness não achava o Style Guide porque faltava o arquivo `.harness.json`; criado. Resultado: 34 de 35 componentes no Style Guide (o `theme-provider` é infraestrutura); token-lint com 2 avisos amarelos, ambos em componentes do shadcn; contraste em AA; o remendo repetido de Card, Badge e Progress virou variantes. Detalhes em `design-system/inventario-componentes.md` e `design-system/DECISIONS.md`.
**Segundo protótipo:** rota `#/app`, em outra sessão ([protótipo do app](http://localhost:5180/#/app)), só em `src/prototipo-app/`: janela principal, Configurações em duas abas, chat ao vivo em quatro estados e Sessões. Referência: protótipo v5.

## Playground do gato e orelhas mais suaves (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Olhos no playground | O olho padrão é o **Contente** (arcos), e ele pisca normalmente: é a animação idle. O "atento" não é um estado à parte: é o olho aberto que o gato usa **quando está falando**, e a troca entre os dois acontece numa piscada. |
| Olhos atentos | Mais juntos que o Contente (centros em 6,45 e 9,55, contra 6 e 10), porque ele achou que estavam muito separados. |
| Fundo | Só o escuro. A variação de fundo saiu do playground. |
| Animações principais | Idle, Falando, Lendo (o olhar acompanha o texto que alguém escreve) e Pensando (olhar para cima e pontinhos que crescem em onda, como carregando). Olhar para os lados, piscar, forçar um olho, a boca e o lado do texto ficam em "Avançado". |
| Orelhas | O pedido era outro: o encaixe da orelha com o rosto, que chega reto no triângulo. Ele quer o **rosto mais circular, com a orelha saindo dele**, e não só o vale suavizado. Primeira rodada (vale suave) descartada. Segunda rodada em `marca/refino-orelhas.html`: A atual, B cantos maiores, C rosto abaulado, D rosto circular com orelhas, E orelhas abertas, F orelhas altas. **Aguardando a escolha.** |

## Correção: o protótipo do app é feito aqui, não em outra sessão (20 de Novembro de 2026)

**Regra do Carlos:** nunca abrir sessão subordinada, aquela que aparece embaixo da sessão do TekaFlow. Tudo do TekaFlow se faz dentro da sessão principal.
**Feito:** a sessão separada foi apagada e a construção do protótipo do app passou para cá. O que ela tinha deixado em `src/prototipo-app/` foi descartado.
**Protótipo do app, em [localhost:5180/#/app](http://localhost:5180/#/app):**
- Janela principal com menu lateral (Início, Sessões, Contexto, Configurações, Ajuda), reaproveitando a tela inicial do onboarding.
- Sessões: reuniões por dia, com busca.
- Configurações: menu lateral próprio e transição que desliza. Em Modelos, abas Ouvir e Responder, "Em uso" separado do que dá para baixar, escolha de qual IA responde e modelos locais num bloco que abre. Geral e Atalhos têm conteúdo; as demais seções mostram "ainda não desenhado".
- Chat ao vivo sobre uma videochamada de mentira, com os quatro estados: aberto, medidores abertos, minimizado em pílula e a confirmação "Encerrar a sessão". Iniciar na tela inicial abre o chat; encerrar leva às Sessões.
**Pendente:** estados de erro, as seções de Configurações ainda vazias, Contexto no menu lateral, conferir o lado Windows e a revisão independente.

## Playground: falando, lendo e loading no rosto (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Falando | O gato pisca de vez em quando e mexe um pouquinho (leve balanço e giro). |
| Lendo | Também **fala**: a boca faz os risquinhos enquanto o olhar acompanha o texto, e ele pisca e mexe. |
| Pensando | Precisa de um **loading no rosto**. Três tentativas em "Avançado": olhos girando (padrão), pontinhos na boca em onda e barra que enche na boca. **Aguardando qual ele prefere.** |

## Protótipo do app: fluxo de início, controles embaixo e gato contente (20 de Novembro de 2026)

**Pedidos do Carlos e o que foi feito:**
- **Controles:** o seletor de Mac e Windows saiu; o protótipo usa o sistema de quem abre. Em cima ficam só as abas "Onboarding" e "App", o fluxo macro. Embaixo ficam todos os controles de cada fluxo: Voltar, a lista para pular direto a uma tela, Avançar e, no app, "Simular pergunta deles". Vale para os dois protótipos.
- **Fundo do chat:** sem a videochamada desenhada; só uma superfície lisa, com contraste baixo. A janela do chat ficou menor, com texto de 12 px.
- **Antes de iniciar:** o Iniciar abre uma tela de instruções. Em "Ok, abrir o chat", o chat pede um teste de microfone (botão "Simular fala"), depois uma pergunta de teste para a IA, que responde com o texto se formando, e, se tudo der certo, a gravação começa sozinha, com cronômetro e medidores animados.
- **Parar:** o botão agora tem a palavra "Parar", no chat e na pílula minimizada. A pílula usa o gato sem o quadrado.
- **Sugestão:** o rótulo "DIGA ISSO" virou "SUGIRO DIZER" em todo o sistema; o gato desse rótulo ficou menor (16 px).
- **Medidores:** só animação. A redução de eco saiu por enquanto, porque ainda não se sabe se entra.
- **Perguntas:** o botão "Simular pergunta deles" faz "eles" perguntarem algo e a sugestão aparecer; também dá para escrever uma pergunta à IA.
- **Tela inicial do app:** o gato contente, com os olhos que seguem o mouse, ao lado das boas-vindas. Usa o `GatoAnimado`, o gato com estados que outra sessão da marca criou em `src/components/gato-animado.tsx`; a minha primeira versão, `GatoOlhos`, foi removida para não duplicar.
**Pendente, a pedido do Carlos:** a animação do gato falando na pílula minimizada fica para o próximo pedido; o `GatoAnimado` já tem os estados `falando`, `lendo` e `pensando` prontos para ligar. Aviso do harness: o `token-lint` reprova `gato-animado.tsx` por cores `#000` e `#fff` nas máscaras; o arquivo é da outra sessão e não foi alterado aqui. Também em aberto: a redução de eco e os estados de erro.

## Animações salvas para o app e opções de loading (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Salvo para o app | O gato animado virou componente: `<GatoAnimado estado="falando" />`, com os estados idle, falando e lendo prontos. O motor de animação não depende de React (`src/lib/gato-animacao.ts`), então serve para outras camadas do app. Está no Style Guide, em `#gato`. Documentado em `marca/animacao-gato.md`. |
| Loading | Ele pediu várias opções: doze em `marca/rascunhos/loading-gato-opcoes.html`. Ver a decisão logo abaixo. |
| Cabeça | A forma da cabeça (orelhas) ainda não foi decidida. O componente guarda o contorno em uma constante, para trocar num ponto só. |

## Loading padrão: pontinhos na boca (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Escolhido | **Pontinhos na boca** (opção 2): os olhos abertos passeiam devagar para cima e para os lados, e os três pontinhos da boca crescem em onda. |
| Quando usar | É a animação de loading padrão do gato: quando ele **está pensando** e quando **está escrevendo**. No componente, os estados `pensando` e `escrevendo` fazem a mesma coisa. |
| Rascunhos | As outras onze opções ficam guardadas em `marca/rascunhos/` (`loading-gato-opcoes.html`, com `LEIA-ME.md`). Não são descartadas: ficam como rascunho. As variantes "olhos girando" e "barra na boca" também seguem no Avançado do playground, marcadas como rascunho. |

## Configurações, busca, gato da barra lateral e modelos locais reais (20 de Novembro de 2026)

**Pedidos do Carlos e o que foi feito:**
- **Gato:** o gato animado fica na barra lateral, ao lado da palavra TekaFlow, sem o quadrado. Os olhos seguem o mouse e, ao clicar, ele se agita de contente. Saiu do cabeçalho "Bem-vindo de volta".
- **Ícone do aplicativo:** continua o símbolo com o quadradinho verde, o padrão da marca (é o ícone da aba).
- **Busca na tela inicial:** a lupa abre a caixa de busca, que cresce de lado; ao digitar, a lista de reuniões filtra embaixo, sem diferenciar acento nem maiúscula. A busca de Sessões também filtra.
- **Configurações:** sem o "Testar de novo" e o "último teste". Idioma da interface com Português e English. Abas Ouvir e Responder com ícones. Áudio e tela só com o seletor de microfone. Permissões com os mesmos cartões do onboarding, já liberados. Contexto com uma pasta só. Sobre com o texto da marca. Modo fantasma com o ícone de fantasma, em Configurações e no chat.
- **Barra de rolagem:** as áreas que rolam reservam o espaço da barra, e o conteúdo não anda mais quando ela aparece.
- **Download:** o carregamento, a barra e a porcentagem ficam numa linha só, centralizados, no mesmo componente em todas as telas.
- **Modelos locais:** os que eu tinha posto estavam errados. Qwen3 não tem versão de 2B nem de 7B. A lista agora é a real, da biblioteca do Ollama: Qwen3 1.7B (1,4 GB), Llama 3.2 3B (2 GB, português entre os idiomas oficiais), Qwen3 4B (2,5 GB), Gemma 3 4B (3,4 GB, mais de 140 idiomas, lê imagem) e Qwen3 8B (5,2 GB). Cada um tem descrição e etiqueta. Os tamanhos são do download padrão, e a página não diz qual a quantização.
- **Sobre:** texto no tom Tranquilo e Despretensioso: base do Robert (OpenPerssua), nome Teka em homenagem à Tesla, gratuito, sem créditos, local, sem mensalidade por algo essencial; com a nota de que a conta de IA do usuário pode ter custo no serviço dela. Sem a palavra "de graça" cravada, como o posicionamento pede.
**Para o Carlos conferir:** o texto sobre a Tesla (a gatinha é do Robert, pelo README da marca) e a leitura de "ajuste da tag" nos modelos, que virou tirar a repetição entre a etiqueta "Conectado" e a linha de baixo.
**Deixado para depois, a pedido:** a página de detalhes da entrevista; o clique numa reunião não abre nada ainda.

## Grafismos, de novo: referências e caminhos (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Pedido | Voltar aos grafismos com **mais referências e menos criação**: como o mundo, com trabalho feito por gente, representa voz, escuta e transcrição sem repetir os concorrentes. Pinterest e Behance foram pedidos. |
| Fontes | O Pinterest não abriu no navegador do painel (página em branco). O Behance devolve os mesmos resultados qualquer que seja a busca. As referências vieram de estudos de caso publicados (Pentagram, Creative Boom, It's Nice That, Contra, páginas das próprias marcas). |
| Entrega | `marca/moodboard-grafismos.html`, com 49 referências reais em oito caminhos: a fala escrita, dois pontos viram um rosto, o som como relevo e círculos, pontos que se dissolvem, peças que se encaixam, a letra como grafismo, o gato sem o clichê e ouvir por desenho. Imagens guardadas em `referencias/grafismos-2/`. O gerador é `marca/_construcao/moodboard-grafismos.py`. |
| Fica de fora | Barrinhas de onda de áudio, degradê e vidro, mascote 3D e qualquer ilustração gerada por IA. |
| Em aberto | Quais caminhos ele quer seguir. As perguntas foram feitas a ele em seguida. |

## Rodada de ajustes: seletores, menu, Sobre, nova versão e Contexto (20 de Novembro de 2026)

**O que foi feito:**
- **Seletores:** a lista que abre tinha a largura do conteúdo e ficava menor que o campo; agora tem pelo menos a largura do campo.
- **Configurações, Geral:** abrir ao ligar o computador ganhou ícone numa caixa, como o Modo fantasma; cada linha de Geral, Áudio e Atalhos tem ícone.
- **Descrição dos modelos:** no máximo uma linha, e os textos foram reescritos para soar como gente ("Da OpenAI. Leve, roda em qualquer computador.", sem o "Feito pela" repetido).
- **Permissões em Configurações:** em linhas horizontais, uma por permissão, com o seletor de microfone na linha do microfone.
- **Contexto:** saiu de Configurações e virou página do menu, com a mesma pasta e o mesmo chat de conferência do onboarding.
- **Sobre:** versão no título, texto maior, tom de "quem somos" com o posicionamento da marca, foto placeholder de gato, links para o GitHub do Robert e o do Carlos; o nome do projeto original não aparece.
- **Menu lateral:** sem Ajuda e sem o Carlos (login, por enquanto não existe). Ficam Início, Sessões, Contexto e Configurações. A caixa verde "Nova versão" aparece acima de Configurações.
- **Modal da nova versão:** no padrão de nota de release do JobRelay: título com a mudança principal, três linhas de abertura, Destaques, Novidades, Melhorias e Correções, itens "Nome curto: Descrição" começando com Adicionamos, Alteramos, Criamos ou Corrigimos. Os títulos de seção usam ícones do sistema no lugar dos emojis do padrão. O conteúdo é de exemplo. Está na lista de cenas como "Nova versão (modal)".
- **Padronização:** o Apple Speech usa o mesmo ícone no onboarding e em Configurações.
- **Cérebro:** os seis cartões têm a mesma altura, com o conteúdo no topo e o botão no pé. O defeito estava no cartão: a margem interna do componente sobrescrevia a variante.
- **Gato:** o gato da barra lateral ganhou a mesma margem dos itens do menu. A logo da tela 1 e a do Style Guide passaram para a versão sem o quadrado, e o ícone da aba também.
- **Ícone de reconhecimento de voz:** trocado provisoriamente pela orelha. As sete opções estão em [localhost:5180/#/icones](http://localhost:5180/#/icones) para o Carlos escolher.
**Pendente:** Privacidade e dados ainda não foi desenhada; clicar numa reunião não abre nada, de propósito.

## Grafismos: o que ele escolheu e a primeira aplicação ao TekaFlow (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Escolhidos | **A fala escrita** (pílulas, fotos em pílula, uma letra dentro de uma bolinha, marca-texto), **o som em círculos, mas em ondinhas que perdem cor** (sem o relevo de papel) e **a letra como grafismo**. |
| Descartado | **Dois pontos viram rosto**: "nada a ver". Fica guardado no moodboard, riscado. |
| Entrega | `marca/moodboard-grafismos.html` reorganizado: seis conceitos aplicados ao TekaFlow (fala em pílulas, letra em bolinha, ondinhas que perdem cor, a letra como cartaz, adesivos de estado e os três juntos), depois as referências dos caminhos escolhidos e os outros caminhos guardados. As imagens agora ampliam ao clicar. |
| Em aberto | Quais dos seis conceitos ele mantém e como as cores e a fonte entram. O desenho é rascunho. |

## Modal de versão maior, detalhe em breve e Contexto com pasta (20 de Novembro de 2026)

**Confirmado pelo Carlos:** a Tesla era a gatinha do Robert, e faleceu. O texto do Sobre está certo.
**Feito:**
- **Reunião:** clicar numa reunião, no Início ou em Sessões, abre uma página de espera com o título e "Em breve", com botão Voltar.
- **Modal da nova versão:** quase do tamanho da janela do app (896 px de largura, 36 rem de altura). Topo com versão e data, o título e uma linha divisória; Destaques, Novidades, Melhorias e Correções separados por linhas; rodapé com divisória e um só botão, Atualizar. Saíram o botão Depois e a frase "reabre sozinho".
- **Padrão do topo dos modais:** o `DialogHeader` agora tem a linha divisória embaixo, o que vale para todos os modais do sistema (a janela de conexão do Cérebro também).
- **Barra de rolagem:** fica verde, na cor da marca, ao passar o mouse e ao arrastar.
- **Contexto no menu:** mostra a pasta já escolhida, "Entrevista Acme", com os arquivos marcados, "4 de 5 arquivos selecionados" e o botão Trocar, mais o chat de conferência. O Contexto do onboarding continua como estava.

## Grafismos escolhidos entram no moodboard visual (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Gostou | **A letra como cartaz** ("muito massa"), **os adesivos de estado** e **as ondas**. |
| Ajuste nas ondas | Elas estavam saindo de dentro do personagem. Agora o gato fica dentro de um **círculo de proteção escuro**, e as ondinhas saem **de trás** dele, abrem e perdem a cor (limão, azul céu, sumir). |
| Moodboard visual | `marca/moodboard.html` e `marca/moodboard.png` (1920 por 1080) refeitos com a logo atual (rosto final), a letra em cartaz no lugar da amostra de tipografia, as ondas com o disco, os adesivos de estado e a fala em pílulas. Os dois espaços "a definir" (elementos gráficos e degradês) saíram: não há degradê, por decisão dele. |
| Moodboard de grafismos | `marca/moodboard-grafismos.html` recebeu o mesmo ajuste nas ondas. |

## Ícones padronizados e harness (20 de Novembro de 2026)

**Decidido pelo Carlos:** o ícone de reconhecimento de voz é a orelha. Para modelos, a caixa, que é o cubo, fica no lugar do chip e do outro ícone de caixa.
**Feito:** o cubo é o ícone de modelo no menu de Configurações, no cartão "Modelo local" do Cérebro, no botão "Modelos locais" e nas linhas de modelo. A orelha é o ícone da permissão de reconhecimento de voz, no onboarding e em Configurações. A página com as opções de ícone saiu, porque a escolha foi feita.
**Harness:** rodado de novo. As medidas fora da grade que eu tinha escrito (largura do cartão de instruções, do chat e altura do modal) viraram degraus da escala. O remendo repetido do texto pequeno do balão virou `size="sm"` e o da caixinha de ícone virou a variante `box` do `ItemMedia`. Sobram só o aviso do `theme-provider`, que é infraestrutura, e os avisos em arquivos do shadcn ou da outra sessão, listados em `design-system/inventario-componentes.md`.
**Dúvida:** "ícone chat, caixa, chip" foi lido como os ícones de modelo. Os ícones de transcrição (onda de som) e de chat (balão) ficaram como estavam.

## Moodboard em grade, sem legenda, e ondas em quadradinho (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Feedback | Sem legenda nos quadros. Ícone do app com **selo vermelho**, como notificação de verdade. Na letra em cartaz, a pílula "ouvindo" sobe para o **topo**. Cores misturadas, escuras e claras alternadas, e não as escuras em cima e as claras embaixo. A logo principal anterior não funcionou. A fala em pílulas do canto ("Como você lidaria com um prazo...") saiu: não era entre as que ele gostou. |
| Diagramação | Segue o moodboard da marca pessoal do César: grade de quadrados lado a lado, sem legenda, misturando logo, frase curta, padrão, cor lisa e fotografia. Aqui: 8 colunas por 4 linhas, 20 quadros, em `marca/moodboard.html` e `marca/moodboard.png`. |
| Ondas | **Em quadradinho, no formato do ícone**, e não em círculo. Saem de trás de um quadrado escuro de proteção, com o ícone da marca no centro, e perdem a cor. Valem para `marca/moodboard.html` e `marca/moodboard-grafismos.html`. Peça comum em `marca/_construcao/ondas.py`. |
| Logo no moodboard | A logo horizontal e o símbolo entram como quadros na grade (a quadrada é a principal), e o gato sem o quadrado aparece uma vez, em azul céu. |

## Modal de atualização: mais estreito e com a atualização por dentro (20 de Novembro de 2026)

**Pedido do Carlos:** modal menos largo; a tag de versão abaixo do título e só a data em cima; menos espaçamento; textos de Destaques, Novidades, Melhorias e Correções um pouco maiores e sem as linhas entre eles; e a atualização acontecendo pelo próprio modal, com o gato falando e um carregamento, até o app fechar.
**Feito:**
- **Modal:** largura de 672 px (antes 896). Em cima a data, depois o título e, abaixo, a tag da versão. As seções ficam sem divisão e o texto passou de 14 para 16 px. A divisória do topo e a do rodapé continuam.
- **Atualizar pelo modal:** o botão Atualizar troca a nota pelo gato animado no estado falando, com o carregamento, "Baixando a atualização" e a barra com a porcentagem. Depois vem "Atualizando o TekaFlow", com "O app vai fechar sozinho", e então o app fecha. Enquanto atualiza, o modal não fecha pelo X, pelo Esc nem por clique fora.
- **App fechado:** a janela do app fica escura com "O TekaFlow fechou para atualizar" e o botão "Reabrir o TekaFlow". Ao reabrir, a caixa de nova versão do menu some.
**Observação:** o gato é o `GatoAnimado` da outra sessão da marca, no estado `falando`, como já existia.

## Barra de rolagem verde, de verdade (20 de Novembro de 2026)

**Pedido do Carlos:** a barra deve ficar verde quando ele clica e seleciona.
**Causa:** o estilo verde que eu tinha posto não aparecia no Chrome. As propriedades padrão `scrollbar-width` e `scrollbar-color`, que eu usava para deixar a barra fina, desligam o estilo por `::-webkit-scrollbar`. O verde nunca era aplicado.
**Feito:** essas duas propriedades agora só valem no Firefox, que não tem o `::-webkit-scrollbar`. No Chrome e no Safari a barra é fina, cinza do tema e **verde na cor da marca ao passar o mouse e ao arrastar**. No Firefox ela é fina e cinza, sem o verde, porque ele não permite estilizar o estado.

## Moodboard volta ao bento arredondado, no padrão do quadro final do César (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Correção | A grade de quadrados lado a lado era o rascunho do moodboard do César. O quadro final dele é a "marca em uso" (slide 25 da apresentação): **bento arredondado**, seis quadros grandes sobre fundo branco, sem legenda. O TekaFlow continua no formato bento arredondado. |
| Moodboard | `marca/moodboard.html` e `marca/moodboard.png` (1920 por 1080), seis quadros: logo principal em limão com formas suaves ao fundo, letra em cartaz (com a pílula "ouvindo" no topo), tom de voz em azul céu, ícone do app em verde escuro com selo vermelho, as ondas em quadradinho com os adesivos de estado por cima (pílulas com borda branca, como no do César) e o texto em círculo ("Ouve junto, sussurra quando precisa"). |
| Mantido | Sem legendas, sem a fala em pílulas do prazo, ondas em quadradinho saindo de trás do quadrado escuro de proteção, cores misturadas (escuros e claros alternados). |

## Moodboard: ordem nova, só as cores da marca e o gato com as ondas no centro (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Cores | Só as cores da marca: grafite, superfície, limão e azul céu (o selo vermelho do ícone ficou, a pedido dele). Saíram o **verde escuro** de fundo ("o verde chato"), o **branco e o cinza-gelo** dos quadros, as formas de fundo em um limão inventado e o grafite mais escuro do disco. |
| Ordem | Fugiu da ordem do quadro do César. Em cima: ícone do app, ondas (grande, no centro), letra em cartaz. Embaixo: tom de voz, logo principal (grande) e adesivos. |
| Elemento central | **Só o símbolo do gato e as ondas em quadradinho em volta**, sem o contorno escuro: o fundo é o grafite, a cor mais escura que a marca tem. |
| Letra em cartaz | O "Flow" do canto saiu. Agora o quadro é limão com "Tek" em grafite e a pílula "ouvindo…". |
| Ícone do app | Fundo superfície (não mais o verde), com quadradinhos em volta nas cores da marca no lugar das formas que eu tinha inventado. |
| Saiu | O quadro do texto em círculo, para caber no bento de seis quadros. Está no gerador e volta se ele quiser. |

## Tamanho do modal de atualização (20 de Novembro de 2026)

**Regra do Carlos:** o modal de atualização tem 20% a menos que a largura e a altura do app; a tela de atualizar tem 20% a menos que o próprio modal. O conteúdo da nota pode rolar por dentro.
**Feito:** o modal tem 832 por 512 px (80% da janela de 1040 por 640). Quando começa a atualizar, ele encolhe com uma transição para 666 por 410 px (80% do modal). Os tamanhos saem da medida da janela do app, então acompanham se ela mudar. A nota rola por dentro, com a barra de rolagem do sistema.
**Verificado:** medi o modal aberto e o modal atualizando; os números batem com 832 por 512 e 666 por 410, já considerando a animação de entrada que começa em 95%.

## Moodboard: só o que ele pediu mudar (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Correção | A versão anterior mexeu em cores já aprovadas. **Regra:** o que ele aprovou não se recolore; só muda o que ele pede. Valeu para este pedido: trocar o **verde de fundo** (verde escuro), trocar o **branco** (o quadro cinza-gelo do texto em círculo), tirar o **"Flow"** do quadro "ouvindo" e **mudar a ordem**. |
| Voltou ao aprovado | Logo principal em limão com as formas ao fundo, letra em cartaz escura com "Tek" em limão, tom de voz em azul céu com as etiquetas Tranquilo (grafite) e Despretensioso (limão), adesivos com borda branca. |
| Mudou | O quadro do ícone do app, que era verde, virou o elemento central: **o símbolo do gato com o selo vermelho e as ondas em quadradinho em volta**, sobre o grafite, sem contorno escuro. O texto em círculo passou do branco para a cor de superfície (#25262A), com o texto em limão, e voltou ao bento. Os adesivos ganharam o fundo limão. |
| Ordem | Em cima: cartaz, tom de voz, ondas (grande). Embaixo: logo principal (grande), texto em círculo, adesivos. |

## Início da implementação (20 de Novembro de 2026)

**Pedido do Carlos:** passar o harness, conferir pelo DS Skill e escrever a spec para começar a implementar, por partes, primeiro para Mac e rodando local. A primeira parte é a tela inicial.
**Feito:** spec `specs/pendentes/004-app-mac-tela-inicial.md`, aguardando aprovação. O harness foi rodado de novo: contraste em AA; Style Guide com todos os componentes, menos o do tema; sem remendo novo. Restam o aviso do `theme-provider` (infraestrutura), os 14 achados de cor no gato animado da outra sessão da marca, os 2 avisos de medida em componentes do shadcn, o falso alarme do `api-lint` sobre `ItemMedia` e 8 avisos do `usage-consistency`, dos quais 6 são de altura de botão no celular, que não se aplica a um aplicativo de Mac.

## Moodboard: retângulos, quadro novo, adesivos sem sombra e frase curta (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Logo principal | As formas redondas de fundo viraram **retângulos de cantos arredondados**, como no resto do app. |
| Texto em círculo | Ele não gostou da frase "Ouve junto, sussurra quando precisa". O quadro foi trocado por **letras em quadradinhos** (T, e, k, a, F, l, o, w no formato do ícone), com o símbolo no meio. |
| Adesivos | **Sem sombra.** Contorno branco puro, sem o cinza que a sombra dava. |
| Tom de voz | As etiquetas Tranquilo e Despretensioso saíram. A frase ficou curta: "Seu companheiro discreto de reuniões." |

## Estrutura da pasta em três frentes (20 de Novembro de 2026)

**Pedido do Carlos:** organizar a pasta do TekaFlow em protótipos, aplicativo real e a base do Robert.
**Feito:** `historico/prototipo-html-v5/` virou `prototipos/html-v5/`; `jornada/` virou `prototipos/jornada/`; o projeto original saiu de `Projects/openPerssua` e passou a `robert-openperssua/`, dentro do TekaFlow, com o repositório próprio intacto; nasceu `app/` para o aplicativo real. Os servidores `teka-prototipo-v5` e `teka-jornada` da lista de preview apontam para os caminhos novos. Os protótipos clicáveis em React continuam dentro do `design-system/`, porque usam os mesmos componentes; o `README.md` e o `prototipos/README.md` explicam o mapa. As entradas antigas deste arquivo mencionam os caminhos de antes, de propósito, porque registram o que era verdade na época.
**Escolhas da spec 004, pelo Carlos:** Electron; código da interface dentro do `design-system/` e janela em `app/`; tela inicial com dados de verdade, num banco local.

## Moodboard: quadro das letras sai e o tom de voz volta à diagramação anterior (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Letras em quadradinhos | "Não ficou legal." O quadro saiu. No lugar, o símbolo do gato sozinho, grande, sobre a superfície (#25262A). |
| Tom de voz | Volta a **diagramação de antes**: frase no alto e etiquetas embaixo, fundo azul céu. Só as **etiquetas** mudaram: de Tranquilo e Despretensioso para "Mac e Windows" (grafite) e "No seu computador" (limão). A frase segue a curta que ele pediu: "Seu companheiro discreto de reuniões." |

## Moodboard aprovado: é o que vai ser (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Aprovado | "Está perfeito. O que está nessas telas é o que vai ser." O moodboard `marca/moodboard.html` e `marca/moodboard.png` é a fonte dos grafismos. **Nada além disso.** |
| Últimos ajustes | O selo vermelho saiu das ondas e foi para o quadro do símbolo. Nas ondas, o gato é a **versão sem o quadrado**. As etiquetas "Mac e Windows" e "No seu computador" ganharam mais espaço entre si. A frase do tom de voz ficou em duas linhas sem viúva nem órfã: "Seu companheiro" e "discreto de reuniões." |
| Documentado | `marca/grafismos.md`, com cada elemento, suas regras, o que não existe e as cores. |

## O aplicativo começa pelo onboarding (20 de Novembro de 2026)

**Correção do Carlos:** a primeira parte do aplicativo é o onboarding, não a tela inicial. Ele quer testar e configurar por ali.
**Feito:** o aplicativo em Electron (`app/`) abre no onboarding, lembra a etapa em que parou (banco local) e, ao concluir, mostra a tela inicial com as sessões do banco. As seis etapas ainda são as simuladas do protótipo; a próxima a tornar real, sugerida na spec, é Permissões. O menu **Desenvolvimento** pula para qualquer etapa e refaz o onboarding. A spec 004 foi reescrita para esse escopo.
**Verificado:** o aplicativo abre pelo comando de desenvolvimento e pelo `TekaFlow.app` empacotado (292 MB, Mac com chip Apple), e o banco foi criado com as quatro sessões de exemplo. Conferi a janela por uma foto tirada pelo próprio app, que mostrou a etapa 2 do onboarding (a etapa em que você parou). Não cliquei pelo fluxo todo.
**Tamanho:** o aplicativo tem janela fixa de 1040 por 640, como no protótipo.

## Onboarding de verdade: spec e perguntas (20 de Novembro de 2026)

**Pedido do Carlos:** o onboarding tem que funcionar de verdade: baixar e ativar modelos, conectar as IAs, liberar permissões, testar. Pensar antes nos casos difíceis, perguntar o que for decisão dele, documentar e avisar das telas a mais.
**Feito:** spec `specs/pendentes/005-onboarding-real.md`, com o que se conferiu no Mac dele (macOS 26.2 com chip Apple; o Apple Speech suporta `pt_BR` e já o tem instalado; o `whisper-server` existe pelo Homebrew; o `claude` está em `~/.local/bin`; o Ollama e o CMake não estão), o funcionamento real de cada etapa, 48 situações difíceis com uma proposta cada, 8 telas a mais e 12 perguntas, 5 delas de decisão.
**Aguardando:** as respostas do Carlos.

## Tela 1 com os grafismos do moodboard, em três opções (20 de Novembro de 2026)

**Pedido do Carlos:** aplicar os elementos do moodboard à tela 1 do protótipo, em três opções, sem destoar muito do que já é.
**Feito (opções A, B e C na casca do protótipo):** a estrutura da tela não mudou (texto à esquerda, cena da conversa à direita, botão no rodapé). Em todas, o painel da direita perdeu o degradê, o ruído e as manchas de cor (o moodboard não tem degradê), e a logo da esquerda passou para a **marca quadrada**, que é a principal.
- **A, Ondas:** painel na cor de superfície, com o gato sem o quadrado no canto e as ondas em quadradinho saindo dele atrás da conversa, perdendo a cor.
- **B, Letra em cartaz:** "Teka" gigante em limão, cortado pela borda, embaixo do texto da esquerda, e a pílula "ouvindo…" no topo. O painel da direita fica na superfície, sem enfeite.
- **C, Adesivos:** painel em limão, balões escuros por cima, e dois adesivos de estado ("ouvindo" e "diga isso") com contorno branco, sem sombra.
**Onde está:** `design-system/src/prototipo/telas/chegar.tsx` e `chegar-grafismos.tsx`. Com "reduzir movimento", as ondas ficam paradas.
**Aguardando:** ele escolher uma das três opções.

## Permissões em três cartões, Acessibilidade em faixa desligada (20 de Novembro de 2026)

**Pedido do Carlos:** na tela de permissões ficam três cartões em cima (Microfone, Gravação de tela e áudio, Reconhecimento de voz) e a Acessibilidade embaixo, numa faixa horizontal maior, desligada por enquanto. No app final, o microfone já escolhe o dispositivo de verdade e o app pede as autorizações ao Mac. O mesmo vale para o passo 4: traz o real. Escolher pasta abre o Finder. A tela inicial fica zerada por enquanto, sem dado nenhum.
**Feito no protótipo:** os três cartões e a faixa "Acessibilidade, Em breve" (`telas/permissoes.tsx`).
**Falta (app real):** pedidos de permissão ao Mac, seletor de microfone real, Finder na pasta de contexto, tela inicial vazia.

## Tela 1 fechada: opção A, só no lado esquerdo (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Escolha | **Opção A** (ondas), mas só no **lado esquerdo**. O lado direito volta a ficar **como estava**: degradê, manchas de cor e ruído, balões sem mudança. Ele quer o degradê ali, mesmo sem ele no moodboard. |
| Logo | Na esquerda, a **versão sem o quadrado** (gato com a palavra), como antes. |
| Ondas | Saem do gato da logo, em quadradinho, **com bem menos opacidade** (no máximo 30%). Ficam atrás do texto. |
| Destaques | **Três pontos de destaque do app** embaixo do texto da esquerda: "Ouve a reunião toda", "Sugere na hora" e "Sem assinatura", cada um com ícone e uma linha. Textos de rascunho, a revisar. |
| Opções | As opções A, B e C saíram da casca: a tela 1 tem uma versão só. |

## Tela 1: ondas mais finas, destaques mais juntos e degradê nas cores da marca (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Ondas | Metade da opacidade (no máximo 15%) e metade da espessura (traço de 2,5 para 0,75 px, conforme abrem). |
| Destaques | Os três pontos ficaram mais próximos entre si: menos espaço entre as linhas. |
| Degradê da direita | Passou a usar **só as cores que a marca tem**, pelos tokens do app: limão (`primary`), azul (`info`) e o grafite do fundo. Saíram o verde-oliva (`brand-500`) e o verde-menta (`success`) que davam o tom esverdeado. O degradê, as manchas e o ruído continuam. |
| Nota | O azul do app (`info`, #6EB7E6) é um pouco mais suave que o azul céu da marca (#5BC0FF). Se ele quiser o azul céu exato, entra como token antes. |

## Tela 1: gato animado na logo, textos do posicionamento e três diagramações dos destaques (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Ondas | Ainda mais suaves: 60% da opacidade anterior (no máximo 9%). |
| Gato da logo | Agora **animado**. O gato (sem o quadrado) vira o componente `GatoAnimado` com a boca da logo no repouso, e a palavra fica ao lado. Ele alterna em ciclo entre três animações: **parado e piscando** (olhos Contente), **falando** (olhos abertos e boca em risquinhos) e **pensando** (os pontinhos em onda). As ondas continuam saindo dele. Parado quando o sistema pede menos movimento. |
| Tagline | Criada **a versão curta** da tagline do posicionamento: **"Seu companheiro discreto de reuniões."** Fica embaixo da logo na tela 1 e foi anotada em `marca/posicionamento.md`. A tagline longa continua valendo. |
| Textos da tela | Vêm do posicionamento (o gato que acompanha, discreto). Título: "Fico por aqui, ouvindo com você." (o texto inicial do app). Parágrafo: "O TekaFlow escuta a sua reunião e sussurra uma sugestão quando você precisa. Vamos deixar tudo pronto antes da próxima." Saiu o "copiloto para chamadas e entrevistas". |
| Destaques | "Fica por perto" (ouve a reunião ao seu lado, sem alarde), "Sussurra quando precisa" (a sugestão aparece no meio da conversa, se você quiser) e "Roda no seu computador" (sem assinatura: você traz a IA que já usa). Título colado na descrição. |
| Opções | Três diagramações dos destaques na casca do protótipo: **A** três colunas sem cartão, **B** três cartões lado a lado, **C** uma linha por destaque, com título e texto emendados. **Aguardando a escolha.** |

## Tela 1: volta à lista vertical dos destaques (20 de Novembro de 2026)

**Decisão do Carlos:** as três diagramações horizontais saíram. Fica a **lista vertical** de antes (ícone à esquerda, título e descrição empilhados), com o título **colado na descrição** e os itens mais próximos entre si. As opções A, B e C saíram da casca do protótipo. Tudo o mais da rodada anterior fica: gato animado na logo, tagline curta, textos do posicionamento e ondas suaves.

## Tela 1: tagline sobe para o título da página e as ondas aceleram quando o gato fala (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Tagline | A linha "Seu companheiro discreto de reuniões." **saiu de baixo da logo**. Ela vira a descrição do app no nível macro: o **título da página** passou a ser "TekaFlow, seu companheiro discreto de reuniões" e há uma descrição para quem compartilha ou busca o app. Leitura a confirmar com ele. |
| Ondas | Ficam lentas no repouso (uma volta a cada 8 s) e, **quando o gato começa a falar ou pensar, aceleram um pouco** (5,5 s) e voltam a desacelerar depois, de forma suave, sem pular. |

## Tela 1: ondas mais discretas no repouso e mais presentes quando o gato fala (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Parado | **Metade da opacidade e metade da velocidade** (uma volta a cada 16 s, opacidade máxima de 4,5%). |
| Falando ou pensando | **50% mais rápido e 50% mais opaco** do que antes (uma volta a cada 5,4 s, opacidade máxima de 13,5%), com um **fade curto**, de cerca de meio segundo, na troca, sem pular. Medido no navegador: velocidade 0,6 parado e 1,37 falando; opacidade máxima 13,5% falando. |
| Revisão de escrita | Os textos da tela 1 passaram pela revisão formal de escrita, contra o padrão de escrita e o tom de voz da marca (Tranquilo e Despretensioso). O parecer apontou quatro ajustes, **a aprovar por ele**: repetição de "sussurra uma sugestão" em quatro textos, descrição do app que repete o título, o destaque "Roda no seu computador" cuja descrição fala de preço, e "Sem assinatura" solto, que pode soar como "de graça". |

## Tela 1: reescritas aprovadas e destaques horizontais e curtos (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Textos | As reescritas da revisão de escrita foram **aprovadas**. A descrição do app agora é "O TekaFlow ouve a reunião ao seu lado e sugere durante a conversa, no Mac e no Windows. Roda no seu computador, com a IA que você já usa." O título do destaque 2 virou "Sugere durante a conversa" (na tela, "Sugere na conversa"). O título da tela e o parágrafo seguem como estavam. |
| Destaques | Ele não gostou da lista. Agora são **três etiquetas horizontais, super curtas**, só com ícone e título, sem descrição: "Fica por perto", "Sugere na conversa" (encurtado de "Sugere durante a conversa" para caber em uma linha) e "Roda no seu computador". As descrições da revisão deixaram de ser usadas. |

## Modais de conexão escolhidos (20 de Novembro de 2026)

**Decisão do Carlos:** ChatGPT, versão "uma ação no centro"; chave de API, versão "descobre sozinho" (só OpenAI, Anthropic e Google Gemini); Ollama, versão "um estado e um botão" (desligado por enquanto, ele testa depois). Todos com o tamanho do modal do ChatGPT. Regra geral dos modais: Cancelar sempre à esquerda, ação principal sempre à direita, no máximo dois botões.
**Feito:** `design-system/src/prototipo/modais.tsx` ficou só com os três escolhidos, no mesmo tamanho, visíveis lado a lado em `#/modais`. As outras versões foram apagadas. Falta ligar `ModalDeConexao` ao Cérebro quando a conexão for real.
**Padrão de trabalho:** opção para escolher aparece já na tela, sem precisar clicar.

## Rodada do app real: IA conectada, pasta real, gato falando (20 de Novembro de 2026)

**Pedidos do Carlos e o que foi feito:**
- Tela 1: o gato fala do começo ao fim de cada resposta que se escreve e pausa entre elas. Logo, título e descrição no topo à esquerda, mais espaço entre eles; as três tags empilhadas, do mesmo tamanho.
- Tela 4: a descrição de cada permissão (para que serve) voltou. Ele pediu para manter.
- Tela 3: ordem dos cartões com Ollama em penúltimo e Modelo local por último. Conexão real: ChatGPT por login no navegador, Claude Code (confere se está instalado e logado) e chaves de API (OpenAI, Anthropic, Google Gemini, testadas de verdade e guardadas cifradas no Keychain). A IA em uso fica salva.
- Etapa de pasta: lista os arquivos reais (PDF, MD, TXT). A resposta da IA ainda não existe.
- O app agora fica em `/Applications/TekaFlow.app`.
**Pendências:**
- Modal extra, mostrando como adicionar o TekaFlow em Gravação de tela no Mac. A gravação de tela ainda não apareceu na lista dos Ajustes; depois ela vira obrigatória.
- Tela 5 (Testar tudo), transcrição real, Ollama, Modelo local, tela inicial: ainda sem implementação, aparecem como "Ainda não implementado".
- ChatGPT usa o client id público do Codex CLI, o mesmo da base do Robert. Conferir se isso é aceitável para um app publicado.

## Tela 1: três opções com destaques horizontais com descrição curta (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Pedido | Ele prefere os destaques **horizontais com descrição**, como nas primeiras versões, mas curtos. Pediu três opções, considerando duas ideias: horizontal curto, e vazio com o texto embaixo e o TekaFlow alinhado à esquerda. |
| Textos curtos | "Fica por perto: Ouve sem alarde." · "Sugere durante a conversa: Você olha se quiser." · "Roda no seu computador: Com a IA que você já usa." |
| Opção A | **Horizontal curto:** logo no alto, texto logo abaixo, três colunas de destaques embaixo, cada uma com ícone, título e descrição colados. |
| Opção B | **Vazio:** sem destaques. Logo no alto e à esquerda, texto (título e parágrafo) ancorado embaixo. |
| Opção C | **As duas juntas:** logo no alto e à esquerda, e embaixo o texto com os três destaques horizontais logo depois. |
| Nota | Outra frente de trabalho mexeu em `chegar.tsx` e `chegar-grafismos.tsx` no meio da conversa: o gato da logo agora fala junto com a conversa da direita, em vez de seguir um ciclo próprio. Mantive essa mudança. **Aguardando a escolha.** |

## Tela 1 fechada na opção B, gato do "sugiro dizer", tela de sucesso e consolidação (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Tela 1 | **Opção B** fechada: logo no alto à esquerda, texto embaixo, sem destaques. As opções saíram da casca. |
| Sugiro dizer | O gato ao lado do rótulo tem o tamanho do texto, **fala enquanto a sugestão é escrita** e depois fica **parado, sorrindo**, sem piscar nem respirar. O motor do gato ganhou o modo `parado`. O gato da logo, à esquerda, já estava certo e não mudou. |
| No aplicativo | O app importa a tela 1 do mesmo arquivo do protótipo (`design-system/src/prototipo/telas/chegar.tsx`), então a substituição vale nos dois. A interface foi gerada de novo (`build:app`) sem erro. Falta abrir o app para ver. |
| Tela de sucesso | `app/electron/sucesso.html` refeita com o Impeccable: gato, uma onda em quadradinho que sai uma vez, "Pronto. Pode voltar ao TekaFlow." e "Você já pode fechar esta aba." Sem dependência externa. |
| Consolidação | `marca/consolidado.md`: o que está certo, o que foi descartado e o que está em aberto. |
| Não feito | Os itens sobre o teste de sons no onboarding (gato miando a 25%), pasta de exemplo em Downloads, voltar pelos pontos de progresso, tela de erro com troca de modelo e a coordenação dos multiagentes. Chegaram misturados na mensagem e parecem ser do chat do aplicativo, que "cuida disso". |

## Tela 1: margem de cima da logo dobrada (20 de Novembro de 2026)

No app, a logo ficava muito perto dos botões de fechar da janela. A margem de cima da coluna esquerda dobrou, de 40 para **80 px**. É a única mudança. A lista de itens do aplicativo (ícone verde, teste de sons com miado real, permissões que não repetem, aviso do chaveiro, pontos de progresso, pasta de exemplo e tela de erro) foi enviada ao chat "Aplicação".

**Aprovado pelo Carlos (20 de Novembro de 2026):** tela 1 na opção B, com a margem de cima da logo em 80 px, o gato do "sugiro dizer" e a tela de sucesso do navegador.

## Tela de testes e modelos (20 de Novembro de 2026)

**Decisões do Carlos:** os testes só rodam quando ele clica em Testar no microfone; a transcrição usa a fala gravada nesse teste, sem falar duas vezes; o teste da IA sorteia um de três pares de perguntas prontas (capital e conta); a linha da IA se chama "Modelo de análise" com o nome da IA; o balão de cada teste fica dentro da caixa, alinhado ao ícone; resposta do chat na etapa de pasta curta, humana e funcional.
**Pendente (protótipo em `design-system/public/modelos-direcao.html`):** tela para escolher o submodelo depois de conectar uma IA (duas direções, A e B). Falta ele escolher.
**Cofre de senhas:** o pedido do Mac para "TekaFlow Safe Storage" passa a aparecer na etapa 4 de permissões. Depois de "Sempre permitir" não volta.

## Animações do gato consolidadas em uma página (20 de Novembro de 2026)

`marca/animacoes-gato.html` mostra, ao vivo e com o motor real do app, as animações escolhidas: **idle**, **parado**, **falando**, **lendo**, **pensando e escrevendo** (o loading padrão) e **espiar**, mais as **ondas** nos dois ritmos (parado: 16 s e 4,5%; falando: 5,4 s e 13,5%). No alto, um gato para trocar de estado. Gerador: `marca/_construcao/animacoes-gato.py`.

## Idle consolidado como padrão e pensando que pisca feliz (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Idle | É o padrão **onde houver a logo**. Juntou o idle com o "espiar" em um só: o gato sorri com os olhos em arco e respira; de tempos em tempos **pisca, abre os olhos e olha em volta (cerca de 3,7 s), pisca duas vezes e volta a sorrir**. O estado "espiar" deixou de existir como estado à parte. |
| Pensando e escrevendo | O olho normal é o **aberto**; **de vez em quando pisca para o olho feliz** (por 1,3 a 2 s) e volta. |
| Verificado | No navegador: o idle faz aberto, duas piscadas, feliz; o pensando alterna aberto e feliz; o parado fica só feliz. A página `marca/animacoes-gato.html` foi atualizada. |

## Idle segue o mouse e pensando pisca normal (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Idle | Os olhos **seguem o mouse**: quanto mais longe o cursor, mais os olhos vão para o lado dele, até um limite. Vale onde houver o gato em idle. O gato parado (o do "sugiro dizer") não segue. Medido: o arco do olho vai de 5,2 (cursor no centro) para 4,8 (à esquerda) e 5,6 (à direita). |
| Pensando e escrevendo | **Sem o olho feliz.** Os olhos abertos piscam normalmente de vez em quando, como no lendo. Medido: zero quadros com olho feliz em 12 s. |

## Idle mais devagar e loading com o gato estático (20 de Novembro de 2026)

| Tema | Decisão |
|---|---|
| Idle | O olhar segue o mouse **mais devagar e com um pequeno atraso**: leva cerca de 1,2 s para chegar a 63% do caminho (antes, uma fração de segundo). |
| Loading (pensando e escrevendo) | **É o loading padrão.** O gato fica **estático**: sem balanço nem giro. Só os olhos e a boca se mexem. Medido: o corpo não muda de posição em 3 s; falando continua se mexendo. |
| Fechado | Ele encerrou o assunto das animações com "se fechou". |

## Telas internas do app (20 de Novembro de 2026)

**Decisões do Carlos:**
- Início e Sessões ficam vazios enquanto não houver sessões, com estado vazio. Três versões em HTML para ele escolher (`design-system/public/estados-vazios.html`); até lá vale a opção A.
- Contexto fica como está (pasta e chat reais).
- Configurações: menu Geral, Modelos, Permissões, Atalhos e Sobre. "Áudio e tela" some e vai para Permissões, que usa a lista vertical e pede a permissão ao clicar. "Privacidade e dados" sai do menu. Botão "Atualizar" no rodapé do menu lateral.
- Modelos: duas abas, Transcrição e Análise, cada uma com uma frase do que serve, e o mesmo conteúdo do onboarding (tamanhos e ícones iguais). Sem modelos locais na tela interna. Ollama e Modelo local seguem como "Em breve" no onboarding.
**Pendente:** escolher o estado vazio; "Atualizar" e "Iniciar sessão" ainda mostram "Ainda não implementado".

## Estado vazio A e regra do "Indisponível" (20 de Novembro de 2026)

**Decisão do Carlos:** estado vazio A (mensagem simples) no Início e em Sessões, com o botão secundário no centro. No app real nada pode ser de mentira: o que ainda não existe mostra o aviso "Indisponível" ao clicar. Vale para Iniciar sessão, Testar de novo, Atualizar, interruptores e idioma de Geral, e atalhos.

## Contexto pré-carregado e protótipo "Em reunião" (20 de Novembro de 2026)

**Requisito do Carlos (a implementar):** quando houver pasta de contexto, o app já deixa o conteúdo carregado e pronto, para as respostas saírem mais rápidas quando a reunião começar. Configuração própria, ligada à pasta escolhida.
**Ideia de como fazer (a decidir):** ler e extrair os arquivos ao escolher a pasta e guardar o texto pronto; montar o início fixo da pergunta uma vez só; reaproveitar o cache de prompt dos serviços que têm (Anthropic, OpenAI, Gemini); e, no Claude Code, manter a conversa aberta.
**Protótipo:** terceira aba "Em reunião" (`#/reuniao`): "Antes de iniciar" com a lista de conferência (contexto carregando, microfone, transcrição, modelo) e o chat ao vivo com o contexto, o modelo, as ondas de áudio e o tempo da resposta.
**Pendente:** microfone gravando (ondas), com 5 opções em `design-system/public/microfone-ondas.html`; nome "sessões" ou "reuniões" (recomendado: reuniões).

## Salvar as reuniões sem perder nada (20 de Novembro de 2026)

**Requisito do Carlos:** transcrição da reunião inteira (a dele e a dos outros) salva aos poucos, a cada minuto no mínimo, só acrescentando. Arquivos em `Documentos/TekaFlow` ou em pasta autorizada. Modelo enxuto, a partir do que o Fireflies e o Wispr Flow guardam.
**Feito:** spec `specs/pendentes/006-salvar-reunioes.md`, com a pasta de cada reunião, os cinco arquivos, o ciclo de salvamento e a recuperação se o app cair. Falta implementar.

## Conferência ao iniciar a reunião (20 de Novembro de 2026)

**Decisão do Carlos:** o chat lateral abre ao clicar em Iniciar e confere no pé do chat (Som, Transcrição e Modelo, com troca rápida para cima); o som usa o padrão do sistema; o gato chega feliz quando tudo passa; a conferência nunca para a reunião, mesmo em erro grave (sem som). Chat de cima para baixo, com a linha divisória em cima.
**Feito:** protótipo interativo `reuniao-iniciar.html` e a spec `specs/pendentes/007-conferencia-ao-iniciar.md`. Falta implementar no app.

## Conferência ao iniciar: ajustes e implementação (20 de Novembro de 2026)

**Decisão do Carlos:** o protótipo `reuniao-iniciar.html` está aprovado. Ajustes: sem as mensagens do gato sobre o status; sem os ícones de tipo (microfone, transcrição, modelo) nas linhas, só o ícone de estado; se os três passam, a conferência some sozinha; erro ou aviso fica no chat e some depois de 10 segundos; o chip "Ouvindo" sai.
**Feito:** `design-system/src/app/reuniao.tsx`, ligado ao botão Iniciar do app. Confere o microfone (grava 4 s e mede o som), a transcrição (transcreve essa gravação) e o modelo (pergunta de teste). Trocar microfone, transcrição ou modelo manda uma mensagem e confere de novo. Nada para a reunião.
**Ainda não existe:** transcrição ao vivo, salvamento a cada minuto (spec 006), pasta de contexto na reunião.

## Reunião aberta, salvamento e detalhes (20 de Novembro de 2026)

**Decisão do Carlos:** ouvir você e os outros (microfone e som do computador, como no original); a sugestão de resposta sai sozinha quando os outros fazem uma pergunta e usa a pasta de contexto quando houver; salvar em Documentos/TekaFlow.
**Feito no app:** `app/electron/reunioes.cjs` (pasta por reunião, `reuniao.json`, `transcricao.jsonl`, `transcricao.md` refeito a cada 60 s, `sugestoes.jsonl`, recuperação de reunião interrompida ao abrir); captura do som do computador; detecção de pergunta e filtro de eco portados do original; `reuniao.tsx` com falas de Você e Outros e sugestão.
**Wireframe:** `design-system/public/reuniao-detalhes.html` (detalhes da reunião, com estados Concluída, Interrompida e Gerando resumo). Falta implementar no app, junto com resumo e e-mail de follow-up.
**Não testado em chamada real:** a captura do som do computador e a transcrição ao vivo em trechos de 6 s.

## Reunião mais rápida e animada (20 de Novembro de 2026)

**Pedido do Carlos:** transcrever e mostrar quase na hora, sem cortar falas, com animação; conferência tenta por até 20 s até os três dar positivo; ícone do gato nas mensagens; mostrar a pasta de contexto escolhida.
**Feito:** detector de fala (portado do original) fecha cada fala no silêncio de 0,7 s, em vez de cortar a cada 6 s; enquanto a pessoa fala, um rascunho se atualiza a cada ~1 s (só com Apple Speech) e vira o texto final no fim da fala; palavras entram animadas, com pontinhos enquanto escuta; gato no cabeçalho, nos Outros e na sugestão; conferência de até 20 s, com microfone, transcrição e modelo em paralelo; chip com a pasta de contexto (passada pelo banco, porque a reunião é outra janela).
**Atenção:** a pasta só chega à reunião depois de escolhida na aba Contexto com esta versão do app. Transcrição com Whisper não tem rascunho ao vivo (é lenta); só o resultado final.

## Chat da reunião: um balão por pessoa (20 de Novembro de 2026)

**Pedido do Carlos:** não criar vários balões da mesma pessoa; ir montando a mensagem em um só, ao vivo (como o chat do Claude), e quebrar só numa pausa de verdade. Balão com no mínimo umas 4 linhas antes de abrir outro. O chat desce sozinho, mas se ele rolar para cima para ler, não puxa de volta. Botão de copiar.
**Feito:** a fala nova entra no balão anterior da mesma pessoa se a pausa for menor que 5 s (ou menor que 8 s enquanto o balão tem menos de ~170 letras); balão só nasce quando já há texto (antes, três pontinhos soltos no fim); o chat só desce se ele estiver no fim; botão de copiar em cada balão (ao passar o mouse) e na sugestão.

## Sugestão em primeira pessoa, com a conversa; pausa de 3 s (20 de Novembro de 2026)

**Pedido do Carlos:** a sugestão sai em primeira pessoa (como se ele falasse), usa também o que ele disse para complementar, 3 s de pausa abrem outro balão, e o chip "Salvando em Documentos" sai do topo (o salvamento continua).
**Pesquisa de texto ao vivo (aplicada):** rascunho em estilo leve e texto final firme; rascunho que encolhe é ignorado para não piscar (estabilidade, linha de pesquisa do Google sobre legendas ao vivo); balões com altura que cresce e rolagem suave; componente de palavras memorizado para não redesenhar o chat inteiro a cada atualização. Ideias para depois: limite de confiança antes de mostrar o rascunho e uma segunda passada com modelo maior só para o final.

## Roadmap, sincronização de documentos e harness (20 de Novembro de 2026)

**Pedido do Carlos:** o roadmap, sincronizar os documentos e configurar o harness do projeto.
**Feito:** `ROADMAP.md` na raiz do projeto; README do projeto e do app com o estado real; specs 004 a 007 com o estado atual; script `npm run harness` em `design-system/` (gate mecânico do `ds-harness`, sem hook de commit nem CI, conforme a decisão de 9 de Outubro de 2026); vínculo do Design System já existia em `.design-system.json`.
**O que o harness acusa hoje:** 34 bloqueios (22 de cor cravada, 5 de variante, 3 de Style Guide, 4 de componente fora do sistema). 14 das cores são da arte do gato animado. Nada foi corrigido nem isentado: falta decidir se as cores do gato entram nos tokens.

## Gate permanente, release do Mac e regras para quem contribui (20 de Novembro de 2026)

**Pedido do Carlos:** um gate que sempre revise com a skill de design e o harness; subir uma nova release no GitHub com a versão para Mac; deixar as regras no repositório para o Robert criar no padrão e subir.
**Decisão sobre a regra de 9 de Outubro:** Carlos pediu o gate explicitamente, então o gancho de pre-commit passa a existir, só no repositório do TekaFlow (`TekaFlow-publico`), nunca no repositório do workspace.
**Feito:**
- `scripts/gate.mjs`: tipos, build, harness (só bloqueia o que for novo, contra `design-system/.harness/baseline.json` com os 34 bloqueios de hoje) e detector de design do impeccable. Testado: reprova cor cravada nova, aprova o estado atual.
- `scripts/instalar-gancho.mjs` (instalado em `Projects/TekaFlow-publico`), `.github/workflows/gate.yml` (tipos e build a cada push) e `.github/workflows/release.yml` (tag `v*` gera o `.zip` do Mac e publica a release).
- Empacotamento sem instalar (`SEM_INSTALAR=1`), assinatura ad hoc (sem conta Apple) e o `.zip` de 136 MB testado.
- `LICENSE` com o aviso do Robert e o de Carlos, seção Créditos no README, `CLAUDE.md`, `AGENTS.md` e `docs/CONTRIBUINDO.md` com as regras que já temos e a instalação das skills.
- `scripts/exportar-publico.sh` gera a cópia limpa em `Projects/TekaFlow-publico` (sem referências de terceiros, sem o clone do Robert, sem protótipos antigos). `RELEASE.md` tem o passo a passo.
**O nome do repositório é TekaFlow** (`caarloshq/TekaFlow`). Não renomeei o repositório do Robert: Carlos tem só permissão de escrita nele.
**Pendências:** assinatura e notarização da Apple; o harness e o detector não rodam na nuvem (as skills são locais), então o gate completo é o do gancho; confirmar o comando de instalação do impeccable.

## README vendedor e gate de escrita e voz da marca (20 de Novembro de 2026)

**Pedido do Carlos:** um README vendedor, no padrão das páginas dos concorrentes, com a imagem do moodboard e os conceitos e formas da marca; gate de escrita e personalidade, local e no git, dentro do harness, e a revisão do pull request deve pegar os dois.
**Feito:** `README.publico.md` (vira o README da cópia pública): logo, frase da marca, moodboard, pílulas de estado em SVG (`docs/img/estados.svg`), passos, benefícios, dados, Mac agora e Windows depois, perguntas rápidas, créditos. Estrutura de página de produto como a dos concorrentes (nome e frase, passos, benefícios, plataformas, perguntas), mas no tom Tranquilo e Despretensioso: sem exclamação, sem prometer tempo ou resultado, sem a linguagem dos concorrentes.
**Gate de voz:** `scripts/voz-da-marca.mjs` confere README, docs, release e as frases da interface: travessão, exclamação, promessa de tempo ou resultado, "sempre" e "garante", "invisível", "indetectável", "#1", "de graça", "totalmente local", urgência, "Teka" sozinho, jargão e "não é X, é Y". Só reprova o que for novo contra `design-system/.harness/voz-baseline.json` (1 ocorrência antiga: a frase do Sobre que conta a origem do nome Teka). Caixa alta e ordem em vez de convite são avisos.
**Integração:** o gate (`scripts/gate.mjs`) agora roda tipos, build, harness, detector de design, voz da marca e a varredura de cacoetes da skill `review` quando instalada. Roda no gancho de commit e na nuvem a cada push (a voz roda na nuvem; harness e detector dependem das skills locais). `.github/pull_request_template.md` leva a revisão (harness, voz, escrita) para cada pull request. `AGENTS.md` e `CLAUDE.md` têm o tom da marca.
**Testado:** a frase "Garantimos o melhor resultado, sempre! Invisível e de graça" reprova com 6 bloqueios; o estado atual aprova, na cópia pública também.

## Novo roadmap a partir das versões do original (20 de Novembro de 2026)

**Pedido do Carlos:** um roadmap novo, com base nas versões anteriores e no que mapeamos.
**Feito:** `ROADMAP.md` reescrito: tabela do que cada versão do Teka (0.4.1 a 0.4.16) ensinou e o que o TekaFlow já tem; quatro releases (0.1 subir o que funciona, 0.2 abrir e reviver a reunião, 0.3 copiloto mais esperto, 0.4 sair do Mac) com esforço P, M ou G.
**Achado importante:** o cofre de senhas de teste (`use-mock-keychain`) não protege as chaves de API de verdade. Entra como bloqueio da release 0.1 para o público.

## A release substitui o repositório original (20 de Novembro de 2026)

**Decisão do Carlos:** o TekaFlow entra no repositório `robertfxbr/openPerssua`, no lugar do Teka, e o repositório passa a se chamar TekaFlow (Carlos é administrador no original; o app do GitHub dele mostra só permissão de escrita, então a troca de nome é feita por ele em Settings).
**Feito:** `scripts/substituir-no-original.sh` clona o original, cria o ramo `tekaflow` com o TekaFlow no lugar, mantendo o histórico do Robert, e não envia nada. `RELEASE.md`, README e guias apontam para `robertfxbr/TekaFlow`. O `AGENTS.md` ganhou a política de créditos do Robert.
**Versão:** a primeira release do TekaFlow é a **1.0.0** (decisão do Carlos; a última do app antigo é a 0.4.16). O roadmap passou a chamar as versões de 1.0, 1.1, 1.2 e 1.3.

## Atualização automática do TekaFlow (20 de Novembro de 2026)

**Pedido do Carlos:** subir como atualização para todo mundo; o Robert está de acordo.
**Decisão:** a atualização automática segue o desenho do original (pacote leve de código, conferido por hash), mas com nomes próprios do Mac (`tekaflow-mac-update.json` e `tekaflow-mac-app-<versão>.asar`) para o app antigo do Windows nunca baixar o pacote do Mac. A release 1.0.0 sai com o `.zip` do Mac e o pacote leve; as versões seguintes chegam sozinhas a quem já tem a 1.0.0.
**Feito:** `app/electron/bootstrap.cjs`, `appBundle.cjs` e `atualizador.cjs` (adaptados do original, créditos mantidos); tela de atualização no app (Configurações, Atualizar, e conferência em silêncio na abertura); `empacotar.mjs` gera o pacote leve e o manifesto; o fluxo da release publica os três arquivos.
**Testado no app empacotado:** abre com o código do instalador; abre com um pacote leve 1.0.1 (versão 1.0.1, leve); um pacote quebrado é descartado e o erro fica em `ultimo-erro.txt`.
**Limites:** o hash vem da mesma release do GitHub (mesma confiança da release); assinatura própria do pacote fica para depois. Quem usa o app antigo do Windows vê só o aviso e a página, sem instalação automática.

## Publicar o Mac sem tirar o Windows (20 de Novembro de 2026)

**Contexto:** o Robert atualizou o README do repositório dizendo que a página de releases entrega o instalador do Windows e que o app antigo se atualiza por ela. Publicar o Mac como última release deixaria o Windows sem caminho de atualização.
**Decisão do Carlos:** publicar o Mac sem tirar o Windows. O código do Windows fica no ramo `windows-legado` (a `main` anterior, com o README do Robert); a `main` passa a ser o TekaFlow. O README e as notas da release explicam onde baixar o Windows (versões 0.4.x).
**Em aberto:** o app antigo do Windows vê a 1.0.0 como versão nova e só abre a página, sem instalar. Para voltar a atualizar sozinho, o Robert precisa publicar uma release do Windows com os arquivos do instalador.

## Próxima etapa: assistentes (20 de Novembro de 2026)

**Decisão do Carlos:** a próxima etapa é trocar a pasta de contexto única por **assistentes**, como no original e no Perssua: dentro de cada assistente, os arquivos e as instruções. Um exemplo é "Entrevista para designer". Cada assistente tem uma regra de resposta marcável: pode completar a resposta ou deve se referir só aos arquivos. Depois vêm as demais funcionalidades do original (gravar e analisar a tela, modo fantasma, teleprompter, MCP): os mecanismos já existem lá, e o trabalho é a interface nova, **sem apagar o código antigo**, que fica guardado (ramo `windows-legado`) para reativar depois. O gate visual e de voz continua mantendo o que for criado dentro do padrão.
**Feito:** `ROADMAP.md` reordenado: 1.1 vira Assistentes, 1.2 vira o resto do original com interface nova.

## ProvenSec adiada e nota de release no padrão do JobRelay (20 de Novembro de 2026)

**Decisão do Carlos:** a segurança com o ProvenSec fica para depois, como spec pendente (`specs/pendentes/008-seguranca-provensec.md`, com o que já foi levantado). O foco é a release.
**Nota de release:** passa a seguir o mesmo padrão do JobRelay (título com a mudança principal, abertura de três linhas, Destaques, Novidades, Melhorias, Correções, itens "Nome: Adicionamos..."). O padrão está em `docs/PADRAO-NOTA-RELEASE.md`, o modelo vivo em `docs/releases/v1.0.0.md`, e o fluxo da release lê `docs/releases/<tag>.md`. A página da 1.0.0 foi atualizada com o novo texto.
