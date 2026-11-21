# 005 · Onboarding de verdade: tudo funcionando no aplicativo Mac

**Estado:** implementado no app (permissões, IA, transcrição, pasta, testes) · **Data:** 20 de Novembro de 2026

## Pedido

O onboarding do aplicativo deixa de ser simulado. O Carlos configura como se fosse o app real: **baixa os modelos, ativa, conecta as IAs, libera as permissões, testa e escolhe a pasta de contexto**, e tudo funciona de verdade. Antes de implementar, pensar nos casos difíceis e nos erros possíveis, perguntar o que for decisão dele, documentar tudo e avisar se alguma tela a mais for necessária.

**Como responder:** cada situação difícil abaixo já traz uma **proposta**. Se você não discordar, vale a proposta. Só responda onde quiser outra coisa. As perguntas que mudam a construção estão na seção "Decisões que preciso de você".

## O que já se sabe do seu Mac (conferido hoje)

| Fato | Resultado | Consequência |
|---|---|---|
| Sistema | macOS 26.2, chip Apple | O Apple Speech existe e roda |
| Idiomas do Apple Speech | A lista traz `pt_BR` e `pt_PT`, e os dois **já estão instalados** | O português do Brasil funciona sem baixar nada. Em outro Mac, o idioma pode precisar baixar |
| Whisper | `whisper-server` e `whisper-cli` instalados pelo Homebrew, versão 1.9.5 | O motor existe aqui, mas o app não pode depender do Homebrew de quem o instala |
| Claude Code | Instalado em `~/.local/bin/claude` | Um app do Mac não herda o caminho do terminal, então o app precisa procurar o `claude` por conta própria |
| Ollama | Não instalado | O cartão do Ollama e o de modelo local precisam de uma tela de "instale o Ollama" |
| CMake | Não instalado | Montar o `whisper-server` para embutir no app exige instalar o CMake |
| Projeto original do Robert | Tem os conectores de IA (ChatGPT por login, Claude, Claude Code, Ollama, chave de API) e o gerenciador de modelos; a parte de áudio e de transcrição não veio na versão para Mac | Reaproveito os conectores. A transcrição eu construo |

## Como cada etapa funciona de verdade

### Etapa 1 · Transcrição

- **Apple Speech:** um pequeno programa em Swift, junto do app, usa o reconhecimento do próprio macOS. Lista os idiomas suportados e instalados; se o idioma da pessoa não estiver instalado, baixa pelo sistema, com o andamento na tela.
- **Whisper:** o app baixa o modelo escolhido (Small, Medium, Large v3 Turbo, Large v3) do Hugging Face, com progresso real em MB, velocidade e botão de cancelar. Guarda em `~/Library/Application Support/TekaFlow/modelos/`. **Usar** ativa o modelo; **apagar** libera o espaço.
- **Parakeet v3:** precisa de um motor que o app ainda não tem. Proposta: sai da lista nesta versão e volta quando houver motor (ver D5).
- **Idioma:** escolhido por gravação, já preenchido com o último usado.

### Etapa 2 · Cérebro

| Provedor | Como conecta de verdade |
|---|---|
| ChatGPT | Login no navegador (OAuth), como no projeto original: o app abre o navegador, espera, guarda o acesso |
| Claude Code | O app acha o `claude`, confere se há login e usa o programa por trás |
| Gemini | **A decidir (D3)**: o Google não oferece login de conta para apps de terceiros como o ChatGPT |
| Ollama | O app procura o servidor local do Ollama; se não achar, mostra como instalar. Lista os modelos instalados e baixa novos pelo próprio Ollama |
| Modelo local | **A decidir (D4)** |
| Chave de API | Campo para colar a chave; o app faz uma chamada de teste antes de aceitar; a chave fica no Chaveiro do macOS, nunca em arquivo aberto |

Dá para conectar mais de uma e escolher qual responde, como no desenho.

### Etapa 3 · Permissões

- **Microfone:** o app pede ao macOS; se a pessoa negou antes, o sistema não pergunta de novo e o app leva direto à página certa dos Ajustes.
- **Gravação de tela e áudio:** o macOS só concede depois de o app tentar capturar, e **exige reiniciar o app** depois. O app trata esse reinício sozinho e volta para a mesma etapa.
- **Reconhecimento de voz:** pede ao macOS, para o Apple Speech.
- **Acessibilidade:** opcional, para ler o texto selecionado.
- **Microfone em uso:** lista os microfones do computador e avisa quando um fone entra ou sai.

### Etapa 4 · Testar tudo

Mede o nível do microfone e do áudio do computador de verdade; grava alguns segundos e transcreve com o motor escolhido; manda uma pergunta curta à IA escolhida. Cada linha mostra certo, errado ou testando, e dá para testar de novo.

### Etapa 5 · Contexto

Escolher a pasta pelo seletor do macOS, listar os arquivos que o app sabe ler (texto, Markdown, PDF), marcar quais entram, mostrar quantos e quão grandes. O chat de conferência pergunta de verdade à IA escolhida, com o conteúdo da pasta, e mostra de quais arquivos veio a resposta.

## Situações difíceis e o que proponho

Cada linha tem uma proposta. Responda só onde quiser outra.

### Em todas as etapas

| # | Situação | Proposta |
|---|---|---|
| C1 | Sem internet no meio de um download, de um login ou de um teste | Mostrar "Sem internet" na própria linha, parar e oferecer "Tentar de novo". O que já foi baixado continua |
| C2 | A pessoa fecha o app no meio do onboarding | Voltar à etapa em que parou, com o que já estava feito |
| C3 | A pessoa quer pular uma etapa | Permitir pular as que não impedem o uso (Contexto) e avisar o que fica faltando; Transcrição, Cérebro e Permissões obrigatórias não pulam sem aviso forte (ver P1) |
| C4 | Erro que o app não previu | Mensagem simples com o que aconteceu e o próximo passo, e um registro técnico guardado num arquivo para você me mandar |
| C5 | App aberto em duas janelas | Só uma janela por vez; abrir de novo traz a primeira |
| C6 | Mac com macOS anterior ao 26 | O Apple Speech some da lista e o Whisper vira a opção recomendada |
| C7 | Mac Intel | Whisper roda mais devagar; avisar e sugerir o modelo Small. O app para Intel só se você quiser (P2) |

### Etapa 1 · Transcrição

| # | Situação | Proposta |
|---|---|---|
| T1 | O download falha ou a internet cai | Retomar de onde parou, sem recomeçar |
| T2 | O disco não tem espaço para o modelo | Avisar antes de começar, com o espaço livre e o que falta; não iniciar |
| T3 | O arquivo baixado veio corrompido | Conferir a soma de verificação ao terminar; se falhar, apagar e oferecer baixar de novo |
| T4 | A pessoa cancela no meio | Apagar o arquivo parcial |
| T5 | A pessoa baixa um modelo grande e o Mac tem pouca memória | Avisar quando o modelo pedir mais memória do que o Mac tem e sugerir um menor |
| T6 | Dois downloads ao mesmo tempo | Permitir um por vez; o segundo entra na fila |
| T7 | O Hugging Face fora do ar | "O servidor dos modelos não respondeu", com tentar de novo |
| T8 | O idioma do Apple Speech não está instalado | Baixar pelo sistema, com andamento; se falhar, sugerir Whisper |
| T9 | A pessoa apaga o modelo que está em uso | Pedir confirmação e voltar para o Apple Speech ou para o próximo modelo instalado |
| T10 | Nenhum motor funciona neste Mac | Tela de ajuda: o que fazer (P3) |

### Etapa 2 · Cérebro

| # | Situação | Proposta |
|---|---|---|
| B1 | O navegador do login não abre ou a pessoa não termina | Esperar até 3 minutos, com "Cancelar"; depois avisar que o login não terminou |
| B2 | O login do ChatGPT expira depois | Avisar na tela inicial e na hora de iniciar uma sessão, com "Reconectar" (já existe no desenho do Testar tudo) |
| B3 | Conta do ChatGPT sem assinatura que dê acesso | Dizer isso claramente, sem culpar a pessoa |
| B4 | O `claude` não está instalado ou não tem login | Mostrar como instalar ou como entrar, e "Procurar de novo" |
| B5 | A chave de API é inválida, sem saldo ou sem permissão | Dizer qual dos três e não guardar a chave inválida |
| B6 | O Ollama não está instalado ou não está aberto | Tela "Instale o Ollama" com o link, e "Procurar de novo" |
| B7 | O Ollama está aberto mas sem nenhum modelo | Oferecer baixar um dos modelos da lista, com andamento |
| B8 | A pessoa conecta duas IAs e remove a que estava em uso | Passar para a outra conectada, ou avisar que não sobrou nenhuma |
| B9 | A IA fica lenta ou não responde | Tempo máximo de 60 segundos e mensagem de "a IA demorou demais" |
| B10 | A pessoa troca de IA no meio de uma sessão | Vale a escolha só a partir da próxima sessão |

### Etapa 3 · Permissões

| # | Situação | Proposta |
|---|---|---|
| P-1 | A pessoa negou o microfone antes | Explicar que o macOS não pergunta de novo e levar direto à página dos Ajustes, com um passo a passo curto |
| P-2 | Gravação de tela concedida, mas o app não reiniciou | Mostrar "Reinicie para continuar" com botão, e voltar sozinho à mesma etapa |
| P-3 | Permissão controlada pela empresa do Mac (restrita) | Dizer que o Mac impede e que só o administrador libera |
| P-4 | A pessoa libera e depois tira a permissão, com o app aberto | Detectar e avisar na tela inicial, sem esperar a próxima gravação |
| P-5 | O app muda de identidade (por exemplo, ao ser atualizado) e o macOS esquece as permissões | Conferir sempre ao abrir; se faltar, pedir de novo. Assinar o app resolve a raiz (P4) |
| P-6 | Nenhum microfone conectado | "Conecte um microfone", com "Procurar de novo" |
| P-7 | Fone Bluetooth: ao virar microfone, o som cai de qualidade | Avisar e sugerir o microfone do computador |
| P-8 | O som do computador não é capturado (alguns apps protegidos) | Dizer que alguns apps bloqueiam a captura e como testar |

### Etapa 4 · Testar tudo

| # | Situação | Proposta |
|---|---|---|
| E1 | Silêncio no teste do microfone | "Não ouvi nada. Fale mais perto ou escolha outro microfone", com atalho para o seletor |
| E2 | O teste do áudio do computador não ouve som | Pedir para tocar algo (um som do próprio app, para a pessoa não precisar abrir nada) |
| E3 | A transcrição vem vazia ou errada | Mostrar o que ouviu, perguntar se está certo e oferecer outro idioma ou modelo |
| E4 | A IA não responde no teste | Mostrar o erro da IA e levar à etapa Cérebro |
| E5 | Um teste falha, mas a pessoa quer seguir | Permitir seguir com aviso do que não funciona |

### Etapa 5 · Contexto

| # | Situação | Proposta |
|---|---|---|
| X1 | Pasta enorme (milhares de arquivos) | Ler só até 200 arquivos e avisar; a pessoa escolhe uma pasta menor |
| X2 | Arquivo grande demais | Fica desmarcado e travado, com "grande demais" (já está no desenho), acima de 5 MB por arquivo |
| X3 | PDF escaneado, sem texto, ou protegido por senha | Marcar como "sem texto legível" e deixar fora |
| X4 | Pasta de lugares que o macOS protege (Mesa, Documentos, iCloud) | O seletor do macOS já dá o acesso; avisar se o macOS recusar |
| X5 | A pasta é apagada ou movida depois | Ao abrir, avisar "a pasta não está mais lá" e pedir outra |
| X6 | O conteúdo é mais do que cabe na pergunta da IA | Usar os trechos mais relevantes e dizer quais arquivos entraram |
| X7 | A IA é de nuvem e a pasta tem coisas privadas | Aviso claro, uma vez: "O conteúdo vai para o serviço escolhido" (ver P5) |
| X8 | Arquivos de código ou de tipos que o app não lê | Ficam de fora, com a lista do que entrou |

## Telas a mais que o onboarding real pede

| Tela | Para quê | Em qual situação |
|---|---|---|
| Reiniciar para continuar | Depois de liberar a gravação de tela, o macOS exige reiniciar | P-2 |
| Como liberar nos Ajustes | Passo a passo curto, com botão que abre a página certa | P-1, P-3 |
| Instale o Ollama | Instrução e link, com "Procurar de novo" | B6 |
| Sem internet | Aviso que serve às etapas com download e login | C1, T7 |
| Pouco espaço no disco | Antes de baixar um modelo | T2 |
| Aviso de conteúdo na nuvem | Uma vez, antes de usar a pasta com uma IA de nuvem | X7 |
| Resumo do que ficou pendente | Ao concluir, o que foi pulado ou deu erro, com atalho para resolver | C3, E5 |
| Ajuda: nenhum motor de transcrição funciona | Última saída quando nada roda | T10 |

Todas entram no Design System, no Style Guide e no protótipo antes de virarem tela do app.

## Decisões que preciso de você

| # | Pergunta | Proposta |
|---|---|---|
| D1 | Como o app leva o `whisper-server`? | **Embutir no app**, montado por mim. Exige instalar o CMake no seu Mac (um comando do Homebrew). Alternativa: usar o do Homebrew se existir, o que não serve a quem não tem |
| D2 | Apple Speech de verdade já nesta versão? | **Sim**, com o programa em Swift. No seu Mac, o português do Brasil já está instalado |
| D3 | Como conectar o Gemini? | **Chave de API do Google AI Studio.** O Google não oferece login de conta como o ChatGPT. Alternativa: tirar o Gemini desta versão |
| D4 | O que é o "Modelo local" de linguagem? | **Usa o Ollama**, que a pessoa instala. Alternativa: embutir um motor próprio no app, bem mais trabalho |
| D5 | O Parakeet v3 entra agora? | **Fora desta versão.** Precisa de um motor novo |

## Perguntas menores, com proposta

| # | Pergunta | Proposta |
|---|---|---|
| P1 | Pode pular Transcrição, Cérebro e Permissões? | Não: sem elas o app não faz o que promete. Contexto pode |
| P2 | Mac Intel entra? | Não nesta versão; só chip Apple |
| P3 | Se nada de transcrição funcionar, o que mostrar? | A tela de ajuda do T10, com o registro técnico para você me mandar |
| P4 | Assinar o app com a sua conta de desenvolvedor da Apple? | Não agora. Sem assinatura, o macOS pode esquecer permissões a cada versão nova. Vale assinar antes de dar o app a outras pessoas |
| P5 | Avisar que o conteúdo da pasta vai para a IA de nuvem? | Sim, uma vez, na primeira pergunta com uma IA de nuvem |
| P6 | Guardar a chave de API e o login no Chaveiro do macOS? | Sim |
| P7 | O app pergunta se pode mandar o registro de erros? | Não: o registro fica só no seu Mac, e você me manda quando quiser |

## Ordem de construção (por partes, cada uma testável por você)

| # | Parte | O que você passa a conseguir fazer |
|---|---|---|
| 1 | Base real: configurações, chaveiro, registro de erros, avisos de rede e de disco | Fundação que as outras usam |
| 2 | Permissões reais | Liberar microfone, gravação de tela, voz e acessibilidade, e escolher o microfone |
| 3 | Transcrição real | Escolher o Apple Speech ou baixar, ativar e apagar modelos Whisper de verdade |
| 4 | Cérebro real | Conectar ChatGPT, Claude Code, Ollama e chave de API, e escolher qual responde |
| 5 | Testar tudo real | Medir o som e testar transcrição e IA de verdade |
| 6 | Contexto real | Escolher a pasta e perguntar à IA com ela |
| 7 | As telas a mais | Os erros e as ajudas, desenhados antes e ligados |

**Não vou tocar em:** a base do Robert (só leio dela), os protótipos, o chat ao vivo, as Configurações do app, o Windows.

## Critérios de aceite

1. Cada etapa faz de verdade o que o desenho mostra, no Mac do Carlos, sem dados de mentira.
2. Cada situação difícil da lista tem o tratamento combinado, com mensagem em português simples.
3. As telas a mais existem no Style Guide e no protótipo antes de entrar no app.
4. Há um registro técnico dos erros, só no Mac.
5. Fica documentado como testar cada situação difícil, para você forçar o erro de propósito.
