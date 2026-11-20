# 004 · O aplicativo do TekaFlow para Mac, começando pelo onboarding

**Estado:** implementado no app (janela, banco local, tela inicial, navegação) · **Data:** 20 de Novembro de 2026

## Pedido

Começar a **implementar** o TekaFlow, por partes. Primeiro para Mac, rodando local, para o Carlos ajustar e testar. **Correção do Carlos no mesmo dia:** a primeira parte é o **onboarding**, não a tela inicial. O aplicativo abre no onboarding na primeira vez; ao concluir, abre a tela inicial. Cada etapa passa de simulada a real numa spec própria.

## O que já existe e vai ser reaproveitado

| O quê | Onde | Uso |
|---|---|---|
| Design System (tokens, 36 componentes, Style Guide) | `design-system/` | É a camada visual do app. Não se copia: o app aponta para ele |
| Tela inicial já desenhada e aprovada | `design-system/src/prototipo/telas/inicio.tsx` (menu lateral e conteúdo) | Vira a tela real |
| Protótipo do app (Sessões, Configurações, chat ao vivo) | `design-system/src/prototipo-app/` | Fica como referência de comportamento para as próximas specs |
| App original em Electron, com a lógica de áudio, IA e banco | `robert-openperssua/` (`electron/main.js`, `electron/preload.js`, `electron/db/`) | Referência. O desenho das tabelas de sessões vem dali, com a mesma biblioteca de banco |
| Harness do Design System | `.harness.json` e `.harness/` | Continua valendo nas telas novas |

## Decisões tomadas

| Tema | Decisão do Carlos |
|---|---|
| Tecnologia da janela | **Electron** |
| Onde mora o código | **O código da interface dentro do `design-system/`**, e a janela do aplicativo na pasta `app/`, uma das três frentes da pasta TekaFlow (protótipos, aplicativo real e a base do Robert). A pasta foi reorganizada assim em 20 de Novembro de 2026 |
| Dados | **Banco local** (SQLite). Guarda as configurações (onboarding concluído, etapa em que parou) e as sessões; as sessões de exemplo entram na primeira abertura |
| Por onde começar | **Pelo onboarding**, depois a tela inicial |

## O que o Carlos vê ao fim desta parte

Um aplicativo de Mac que abre no onboarding (as seis etapas do protótipo: Chegar, Transcrição, Cérebro, Permissões, Testar tudo e Contexto), lembra em que etapa você parou e, ao concluir, abre a tela inicial com as sessões do banco local. Um menu **Desenvolvimento** pula para qualquer etapa ou refaz o onboarding do zero. As etapas ainda são as simuladas do protótipo: cada uma vira real numa spec própria.

## Plano e estado

| # | O que vou mexer | O que muda pra você | Estado |
|---|---|---|---|
| 1 | Janela do aplicativo em Electron, ligada ao Design System | Você abre um aplicativo de Mac com as mesmas cores e componentes do protótipo | Feito |
| 2 | Janela do Mac | Tamanho fixo de 1040 por 640, botões do Mac no lugar da moldura desenhada, arrastar pela faixa de cima | Feito |
| 3 | Onboarding no aplicativo | As seis etapas do protótipo, em sequência, com a etapa lembrada | Feito |
| 4 | Banco local e ponte com a tela | Configurações e sessões guardadas no seu Mac; a tela inicial lê delas | Feito |
| 5 | Rodar e empacotar | Um comando abre o app; outro gera o `TekaFlow.app` | Feito |
| 6 | Prova e documentação | O que foi conferido e como rodar | Neste registro |

**Não vou tocar em:** os protótipos, os componentes do Design System (só leio deles), a base do Robert, áudio, IA, permissões do sistema e o Windows.

## Fora desta parte, cada um com a sua spec

Cada etapa do onboarding de verdade (a próxima sugerida é **Permissões**, a mais simples de tornar real), chat ao vivo, Configurações, Sessões, atualização automática, empacotamento assinado e Windows.

## Critérios de aceite

1. Um comando abre uma janela de Mac de 1040 por 640 no onboarding, sem erro.
2. A interface usa só componentes e tokens do Design System; o harness não acusa nada de novo.
3. A etapa em que você parou fica salva; ao concluir, abre a tela inicial.
4. Um segundo comando gera o `.app`, e o `.app` abre.
5. O README diz como rodar, em linguagem simples.
