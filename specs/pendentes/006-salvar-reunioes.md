# Salvar as reuniões sem perder nada

**Estado:** implementado no app em 20 de Novembro de 2026 (reunioes.cjs); falta resumo.md, escolher outra pasta e abrir pela tela de detalhes

**Requisito do Carlos (20 de Novembro de 2026):** toda reunião grava a transcrição aos poucos, no mínimo uma vez por minuto, sempre acrescentando. De jeito nenhum a transcrição pode se perder. Vale para a reunião inteira: o que ele fala e o que os outros falam.

## Onde ficam
`~/Documents/TekaFlow/Reuniões/AAAA-MM-DD HH-MM Título/`, ou outra pasta que a pessoa escolher pelo seletor do sistema (isso já autoriza o acesso). Escrever em Documentos faz o Mac pedir permissão uma vez ("TekaFlow quer acessar a pasta Documentos"); a pasta escolhida pelo seletor não pede.

## O que existe lá dentro (modelo enxuto)
Inspirado no que o Fireflies e o Wispr Flow guardam: título, data, duração, participantes, falas com horário e quem falou, resumo e pendências.

| Arquivo | Para quê |
|---|---|
| `reuniao.json` | Dados da reunião: id, título, início, fim, duração, estado (gravando, concluída, interrompida), participantes, contexto usado (pasta e arquivos), modelos usados (transcrição e análise) |
| `transcricao.jsonl` | Uma linha por fala, só acrescentando: `{t, quem, texto}`. É a fonte de verdade e a que salva na hora |
| `transcricao.md` | A mesma transcrição em texto legível: `[00:05] Você: …` e `[00:08] Outros: …`. Refeita a cada minuto |
| `sugestoes.jsonl` | Cada sugestão que o TekaFlow deu: pergunta, resposta sugerida, arquivo de origem, tempo de resposta |
| `resumo.md` | Gerado quando a reunião termina: resumo, decisões e pendências |

## Como não perder nada
1. Cada fala nova vai para o `transcricao.jsonl` na hora (acrescenta e grava no disco).
2. A cada 60 segundos, o app fecha o arquivo (força a gravação no disco), refaz o `transcricao.md` e atualiza o `reuniao.json`.
3. Se o app fechar no meio (queda, falta de energia), na próxima abertura ele acha reuniões com estado "gravando", marca como "interrompida" e oferece abrir o que foi salvo.
4. Ao encerrar, o estado vira "concluída" e o resumo é gerado.

## Fica para decidir
Nome do arquivo e da pasta com acentos; se o áudio também é guardado (hoje, não); quanto tempo guardar; o que mostra a tela Reuniões a partir dessa pasta.
