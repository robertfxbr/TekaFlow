# Roadmap do TekaFlow

**Atualizado em:** 20 de Novembro de 2026.

**De onde vem:** as 16 versões do Teka original (do 0.4.1 ao 0.4.16, de Robert, em [openPerssua](https://github.com/robertfxbr/openPerssua/releases)), o que mapeamos (lista do que mexer, 38 telas do Figma com Perssua, Parakeet e Handy, comparação de funcionalidades) e o que já está no app. As decisões ficam no `DECISIONS.md`.

**Esforço:** P é horas, M é dias, G é uma semana ou mais. São ordens de grandeza, sem prazo.

## Onde estamos

O TekaFlow já abre no Mac, faz o onboarding de verdade e abre a reunião numa janelinha própria. Ouve você e os outros, transcreve quase ao vivo, sugere a resposta sozinho quando os outros perguntam (em primeira pessoa, com a conversa e a pasta de contexto) e salva tudo em `Documentos/TekaFlow`. A primeira versão, a **1.0.0**, está publicada em [robertfxbr/TekaFlow](https://github.com/robertfxbr/TekaFlow/releases/tag/v1.0.0) (a última do app antigo é a 0.4.16, e o código do Windows está no ramo `windows-legado`).

## O que o Teka original já aprendeu e o TekaFlow herda

Cada linha é uma versão do Robert. A coluna do meio diz o que o TekaFlow já tem.

| Versão do original | Aprendizado | No TekaFlow |
|---|---|---|
| 0.4.1 | Resposta em camadas: primeira linha direta, argumentos com prova do perfil, "se insistirem". Resumo de entrevista com o que ficou forte e o que faltou | Falta |
| 0.4.2 | Detecção de idioma por fala (PT e EN) e filtro de frases inventadas no silêncio | Idioma fixo em português; falta o filtro |
| 0.4.3 | A transcrição deixa núcleos livres e roda com prioridade baixa, para não travar a chamada | Falta (o Whisper usa o que quiser) |
| 0.4.4 | Assistentes com contexto próprio, "responder só com certeza", instruções por uso, lembrete de escuta longa, ferramentas MCP | Só a pasta de contexto; falta o resto |
| 0.4.6 | Modo fantasma: a janela some da transmissão de tela e da gravação | O botão existe e não faz nada |
| 0.4.8 | Se a transcrição falhar, o erro aparece na tela em vez de sumir | Pronto (a conferência avisa) |
| 0.4.10 | Aviso quando a transcrição está lenta; Medium e Large marcados como pesados | Falta |
| 0.4.12 | Modo mini com painel de resposta, com copiar e fechar | Falta o mini; copiar já existe |
| 0.4.14 | Atalhos globais com reserva quando o principal está ocupado | Falta |
| 0.4.15 | Teleprompter fora da gravação, com o roteiro do contexto | Falta |
| 0.4.16 | Sem frase inventada depois de pausa, recuperação do servidor de transcrição, eco do alto-falante no microfone, 10 minutos seguidos testados | Eco e pausa por detector de fala já estão; falta testar 10 minutos e recuperar queda |
| Todas | Atualização leve, sem reinstalar | Pronto (pacote leve de cerca de 1,4 MB, conferido por hash, com volta automática se a versão nova não abrir) |

## Versão 1.0: a primeira do TekaFlow, para Mac

**Objetivo:** subir o que já funciona, sem deixar um buraco que quem baixar vai sentir.

| Item | Esforço | Por quê |
|---|---|---|
| Testar numa chamada real, 10 minutos seguidos, com e sem fone | M | O som do computador, o eco e a velocidade só foram pensados; o original só confiou depois de uma bateria assim |
| Segurança com o ProvenSec | M | Spec 008. Inclui o cofre de senhas real do Mac (hoje o de teste não protege as chaves de API), a assinatura própria do pacote de atualização e limites nas pastas que a tela pode abrir. Adiada por decisão do Carlos |
| Filtro de frases inventadas no silêncio | P | O Whisper inventa "Obrigado por assistir" quando só há silêncio |
| Núcleos livres e prioridade baixa no Whisper | P | Para não travar Zoom, Meet ou Teams |
| Aviso de transcrição lenta | P | Medium e Large levam mais de 20 segundos por fala em muitos Macs |
| Recuperar a transcrição se o motor cair | M | Hoje, se o motor parar, a escuta fica muda |
| Atualização automática dentro do app | G | **Feito.** Pacote leve por versão, conferido por hash; a versão nova que não abre é descartada sozinha. Testado com versão boa e com versão quebrada |
| Publicar o repositório e a release | P | **Feito.** 1.0.0 publicada; passo a passo das próximas em `RELEASE.md` |

## Versão 1.1: assistentes (a próxima etapa)

**Ideia do Carlos:** hoje há uma pasta de contexto só. O próximo passo é trocar por assistentes, como no original e no Perssua: cada assistente tem seus arquivos, suas instruções e suas regras. Exemplo: "Entrevista para designer", com o currículo, a vaga e as instruções de como responder.

| Item | Esforço | Por quê |
|---|---|---|
| Assistentes: criar, editar e escolher antes da reunião | G | Cada um com nome, arquivos e instruções. A pasta de contexto de hoje vira o primeiro assistente |
| Regra de resposta por assistente | M | Uma opção para escolher: "pode completar a resposta" ou "só com o que está nos arquivos" (no original, "responder só com certeza") |
| Instruções por uso | M | Instruções diferentes para a sugestão ao vivo, para a pergunta direta e para o resumo |
| Assistentes prontos (entrevista, venda, reunião de equipe, aula) | M | Ponto de partida, que a pessoa edita |
| Importar e exportar assistentes | P | Compartilhar um assistente com outra pessoa |

## Versão 1.2: o que o original já faz, com interface nova

**Ideia do Carlos:** os mecanismos já existem no original. O trabalho é mudar a interface como um todo, **sem apagar o código antigo**: ele fica guardado (ramo `windows-legado`) e desligado para reativar depois.

| Item | Esforço | Por quê |
|---|---|---|
| Análise de tela (capturar a tela e perguntar sobre ela) | M | Parakeet e Perssua têm; o original já captura |
| Modo fantasma (esconder da gravação e da transmissão) | P | No Mac, o Electron já esconde a janela; falta ligar o botão |
| Teleprompter com o roteiro do assistente | M | O original lê o contexto em letra grande, rolando sozinho |
| Ferramentas MCP (conectar serviços) | M | O original aceita servidores MCP; entra na tela de Configurações |
| Tela de detalhes e Sessões clicável | M | O wireframe está pronto; hoje a reunião salva mas não abre no app |
| Resumo, decisões e pendências ao encerrar | M | A spec 006 prevê o `resumo.md` |
| Resposta em camadas e resumo de entrevista | M | A melhor ideia do 0.4.1 do original |
| Atalhos globais, modo mini, lembrete de escuta longa | M | Do original |
| Escolher outra pasta para salvar; idioma a cada gravação; "Sessões" virar "Reuniões" | P | Decisões antigas, algumas aguardando aval |

## Versão 1.3: sair do Mac

| Item | Esforço | Por quê |
|---|---|---|
| Versão para Windows | G | O app já foi desenhado para os dois; no Windows a transcrição padrão vira um modelo local, porque o Apple Speech é só do Mac |
| Assinar e notarizar com conta Apple | M | Tira o aviso da primeira abertura |
| Modelos locais (Ollama, modelo local, Parakeet) | G | Aparecem como "Em breve" |
| Privacidade e dados | P | A tela existe sem conteúdo |

## Depois, se fizer sentido

| Item | Observação |
|---|---|
| Ferramentas MCP | Veio do original; só entra com um caso de uso claro |
| Teleprompter | Útil para apresentação e gravação |
| Tradução ao vivo | O Perssua tem; não está no mapa de essenciais |
| Rascunho ao vivo com Whisper | Hoje só com o Apple Speech |
| Segunda passada com modelo maior no texto final | Ideia da pesquisa de legendas ao vivo |
| E-mail de follow-up | Do original; aguardando decisão de manter ou tirar |

## Governança

Roda com `node scripts/gate.mjs`: tipos, build, harness do design system, detector de design, voz da marca e varredura de cacoetes. As skills de cada tarefa estão em `docs/SKILLS.md`. O gancho de commit e a nuvem rodam o gate. O harness acusa 34 bloqueios antigos no baseline (22 de cor fora dos tokens, 14 deles no gato animado). Falta decidir se as cores do gato entram nos tokens.
