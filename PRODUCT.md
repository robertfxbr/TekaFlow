# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

(App de desktop para Mac e Windows feito em Electron. A interface é web, em uma janela do sistema.)

## Users
Qualquer pessoa em uma **reunião ao vivo**. Entrevista de emprego (técnica e em inglês) e chamada de venda (cold call, apresentação para CEO) são os casos mais claros dentro dela. A atenção está na conversa, então qualquer configuração precisa ser curta e dar segurança de que funciona.

## Product Purpose
Copiloto de reunião para computador, em Mac e Windows. Escuta o microfone e o áudio do computador, transcreve e sugere o que dizer, usando a IA que a pessoa já tem. Sucesso é a pessoa receber a sugestão no meio da reunião sem ter pensado na configuração.

## Positioning
Roda no computador da própria pessoa, sem assinatura própria: o usuário traz a conta de IA que já usa, ou baixa um modelo local. Concorrentes: Perssua e Parakeet AI.

## Operating Context
- O app tem duas janelas: **chat flutuante** (cerca de 30% da tela, minimizável, sempre por cima, fora de gravação) e **janela de configurações** (normal).
- A pessoa escolhe o idioma da chamada no início de cada gravação.
- O contexto vem de uma **pasta de arquivos** escolhida pela pessoa (texto, Markdown, código, PDF na primeira versão).

## Capabilities and Constraints
- Transcrição: Apple Speech quando o Mac tiver o recurso, senão modelos locais baixáveis (Whisper). A lista deve mostrar tamanho, precisão e velocidade.
- Cérebro: ChatGPT por login, Claude Code, Gemini, Ollama, modelo local ou chave de API. Sem créditos próprios.
- Permissões do macOS: microfone, gravação de tela e áudio do sistema, reconhecimento de voz. A gravação de tela exige reiniciar o app. No Windows, as permissões e a transcrição nativa ainda não foram mapeadas.
- Contexto: hoje o limite é cerca de 20 mil caracteres para todos os arquivos juntos, o que obriga a buscar os trechos certos de uma pasta.
- Em aberto: se a tradução ao vivo entra na primeira versão; como o novo front entra no projeto; a direção visual definitiva.

## Brand Commitments
Nome **TekaFlow** (antes Teka, antes OpenPerssua). Logo fechada em 20 de Novembro de 2026: gato dentro de ícone arredondado, palavra em Chillax 600. Cores: limão #C5EF6B de assinatura e grafite neutro #1A1B1E no lugar do preto, sem preto absoluto. Tudo em `marca/` (`marca/README.md`). Posicionamento, tom de voz e limites de promessa em `marca/posicionamento.md`. A tipografia da interface não muda com a escolha da fonte do logo. **Grafismos: só os do moodboard aprovado** (`marca/moodboard.html`, detalhados em `marca/grafismos.md`). Nada além disso, salvo pedido dele.

## Evidence on Hand
Capturas do Teka atual, do Perssua, do Parakeet AI e do Handy em `referencias/figma/`, com o mapa de cada tela em `referencias/mapa-figma.md`. Jornada proposta em `jornada/onboarding-v1.md`. Não há dados de usuários nem métricas.

## Product Principles
1. A primeira prova de que funciona vem antes de qualquer personalização.
2. Pedir cada permissão na hora em que ela é necessária, com o motivo escrito.
3. Quem falha no teste sai com um botão de conserto, nunca com uma instrução para procurar uma tela.
4. O que é opcional nunca bloqueia o primeiro uso.
5. O mesmo cartão serve ao onboarding e às configurações.

## Accessibility & Inclusion
Português do Brasil como idioma de interface. O app roda em um momento de tensão, então o texto precisa ser legível de relance e não depender só de cor para dar estado.
