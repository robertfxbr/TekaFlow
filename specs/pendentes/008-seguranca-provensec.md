# 008 · Segurança do TekaFlow com a skill ProvenSec

**Estado:** pendente, adiada por decisão do Carlos em 20 de Novembro de 2026 (o foco do dia é a release) · **Data:** 20 de Novembro de 2026

## Pedido

Passar a skill ProvenSec no TekaFlow para melhorar a segurança. Esta spec guarda o que já foi levantado, para retomar sem refazer.

## O que já foi rodado

`provensec-app` (segredo no disco e no histórico, padrão perigoso), só com Node e git, sobre o repositório publicado (44 commits, 366 arquivos):

| Resultado | Detalhe |
|---|---|
| Segredo no código e no histórico | Nenhum candidato |
| Dependências | **Não rodou.** Precisa de `--dependencias`, que consulta o registro do npm com a lista de pacotes. Só com autorização do Carlos |
| 2 candidatos altos, de comando montado com texto variável | `app/scripts/empacotar.mjs` (duas linhas). Parecem descartáveis: é script de build, roda só na máquina do Carlos e na nuvem do GitHub, e os valores são caminhos gerados pelo empacotador, sem entrada de usuário. Falta o descarte formal com a régua `_veredito.md` |
| 1 aviso de HTML inserido na tela | `chegar-grafismos.tsx`, logotipo em SVG que vem de um arquivo do próprio projeto, sem entrada de usuário. Parece descartável |

## O que a leitura do código apontou e a ferramenta não pega

| Item | Gravidade | O que fazer |
|---|---|---|
| **Cofre de senhas de teste** (`use-mock-keychain`) | Alta | As chaves de API ficam cifradas com uma chave fixa, o que na prática não protege. Ligar só em desenvolvimento e usar o cofre real do Mac na versão publicada. Quem já conectou uma IA reconecta uma vez |
| **Pacote de atualização sem assinatura própria** | Alta | O conferido hoje é o hash que vem da mesma release do GitHub. Quem controlar a release controla o código instalado. Assinar o manifesto (ed25519) com uma chave guardada fora do repositório e embutir a chave pública no app. Só vale para versões depois da 1.0.0, que já saiu sem a chave |
| **Janela da reunião abre qualquer caminho** (`reuniao:abrirPasta`) | Média | Aceitar só caminhos dentro de `Documentos/TekaFlow/Reuniões` |
| **Leitura de pasta pedida pela tela** (`pasta:listar` e `ia:perguntar`) | Média | Limitar às pastas que a pessoa escolheu pelo seletor do sistema |
| **Política de segurança de conteúdo na tela** (CSP) | Média | Declarar que a tela só carrega o que é local. Testar com captura de tela para não quebrar a interface |
| **Configuração livre** (`config:salvar` aceita qualquer chave) | Baixa | Lista de chaves permitidas |
| **Aviso de atualização do app antigo do Windows** | Baixa | Depende do Robert publicar uma release do Windows com instalador |

## Como retomar

1. Rodar `provensec-app` de novo na versão atual (com `--historico-completo`) e, se o Carlos autorizar, com `--dependencias`.
2. Descartar formalmente os 3 candidatos acima pela régua do ProvenSec.
3. Corrigir os itens de gravidade alta e média, na ordem da tabela, cada um com teste.
4. Trazer a prova mecânica (saída 0 do `provensec-app`) para a nota da versão que fechar o assunto.
5. Registrar no `DECISIONS.md` e na nota da release (`Melhorias`).

## Fica fora

Probe em alvo no ar e teste de API: o TekaFlow não tem servidor. A trilha de servidor (`provensec-vps`) não se aplica.
