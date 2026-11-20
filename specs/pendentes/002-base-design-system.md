# 002 · Primeira base do Design System (TekaFlow)

**Estado:** etapas 1 a 5 executadas (a 5, o inventário, em revisão do Carlos). Etapas 6 a 8 pendentes · **Data:** 20 de Novembro de 2026

## Pedido

Criar a primeira base do Design System em cima do shadcn, com um **style guide super resumido**, usando os componentes e os padrões do shadcn. Configurar o **harness** para conferir sempre se o que for construído usa o que o style guide definiu. O harness do projeto é uma **skill própria do projeto**, baseada na geral. Depois, adaptar o que existe do Robert a esse visual novo.

Comando de partida, do Carlos: `pnpm dlx shadcn@latest init --preset b2w230QNJw --base radix --template vite`. Como o `pnpm` não está instalado, a execução usa `npx shadcn@latest init ...`, que faz o mesmo (decidido).

## Decisões já tomadas

| Tema | Decisão | Quando |
|---|---|---|
| Onde mora | Projeto Vite **novo e separado**, dentro de `Projects/TekaFlow/`. As peças do Robert são adaptadas e trazidas para ele aos poucos; depois o resultado vai para o app | 20 de Novembro de 2026 |
| Preset | O preset já traz a **fonte e as cores** que o Carlos escolheu. Vale como direção inicial, sem refazer | 20 de Novembro de 2026 |
| Base técnica | Vite, Radix UI, TypeScript, npm | 20 de Novembro de 2026 |
| Espaçamento | **Base 4**: 4, 8, 12, 16, 20, 24, 32, 36, 40, 48. **Sem o 28.** Sempre múltiplos de 4 | 20 de Novembro de 2026 |
| Fontes | Tamanhos em múltiplos de 2 ou 4 | 20 de Novembro de 2026 |
| Harness | Confere sempre o uso do style guide. **O harness geral é o motor e o padrão; cada projeto tem a sua própria skill de harness**, derivada da geral, com as regras e o visual daquele projeto | 20 de Novembro de 2026 |

## Decisões em aberto (bloqueiam a parte que depende delas)

1. **Todos os componentes do shadcn ou só os que o Teka usa agora?** Ele já disse "todos" e agora disse "super resumido". Recomendo instalar só os que o protótipo usa (cerca de 16) e deixar o resto a um comando de distância. Bloqueia a etapa 4.
2. **Instalar o gancho de commit (pre-commit) do harness?** A skill não instala sozinha. Bloqueia só a última parte da etapa 7.
3. **Onde mora a skill do projeto?** Recomendo dentro do próprio projeto (`.claude/skills/teka-harness`), para qualquer agente que trabalhe lá já a encontrar. Bloqueia a etapa 7.

## Etapas

| # | O que vou mexer | O que muda pra você | Onde | Skill |
|---|---|---|---|---|
| 1 | Criar o projeto Vite com o preset e o shadcn, em pasta nova | Um projeto novo que abre no navegador, já com o visual do preset | Pasta `design-system/` dentro de `Projects/TekaFlow/` | Produto/DS · `ds-skill` → `ds-new-project` |
| 2 | Escrever o vínculo do Design System e o documento de arquitetura, com o mapa do que vem do Robert | Um texto curto que diz onde cada coisa mora e o que o sistema decidiu não resolver | Raiz do projeto novo (`.design-system.json` e `architecture.md`) | `ds-new-project` |
| 3 | Ler o que o preset trouxe, mostrar a direção para você confirmar e escrever os tokens: escala de espaço (base 4), tamanhos de fonte, raios, contraste, e de 3 a 5 princípios | Você vê numa tela só as cores, as fontes, a escala e os raios, e confirma antes de eu seguir | Página de Design System, seção Fundamentos | `ds-design-system` + `impeccable` (shape e document) |
| 4 | Montar o style guide resumido com os componentes do shadcn funcionando | Uma página única que mostra cada componente e os fundamentos | Página de Design System | `ds-sandbox` + `impeccable` |
| 5 | Inventário do que o protótipo v5 e o código do Robert precisam: o que o shadcn já tem (reusar), o que adapta e o que falta criar | Uma lista que diz, para cada peça, se vem pronta, se adapta ou se constrói | `inventario-componentes.md` no projeto novo | `component-audit` (da `ds-harness`) |
| 6 | Dar à skill geral do harness um **molde de harness de projeto**: o que o projeto herda do geral, o que ele define sozinho (escalas, tokens, componentes, gates) e como se cria um | Cada projeto passa a ter o seu harness, com regra própria, nascendo do mesmo padrão | `Skills/ds-skill/skills/ds-harness/references/`, um arquivo novo e uma linha de ponteiro no `SKILL.md` | `ds-harness` (molde) |
| 7 | Criar o **harness do TekaFlow**: uma skill do próprio projeto que herda os gates do geral e traz as regras daqui, incluindo a regra nova que barra espaço e fonte fora da escala | Se alguém escrever `p-7` ou um tamanho fora da escala, o gate reprova e diz qual degrau usar. As regras do projeto ficam em um lugar só | Skill `teka-harness` dentro do projeto novo, com as regras em arquivo e um script de escala | `ds-harness` → `commit-guard` e `shadow-components` (herdados) |
| 8 | Registrar decisões, validar e passar pela revisão independente | Você recebe o relatório com o que passou, o que ficou pendente e o próximo passo | `DECISIONS.md` do projeto | `ds-skill` (fechar rodada) → `review` |

**Não vou tocar em mais nada:** além do molde da etapa 6, a skill geral do harness, o app do Robert, a pasta `openPerssua`, as telas e o naming. A adaptação das telas ao visual novo é a rodada seguinte.

## Pontos de atenção

- O `token-lint` do harness já barra valor arbitrário como `p-[13px]`, mas **não** confere `p-7` (28 px) nem `p-11` (44 px) contra uma escala. Por isso a regra de espaçamento é uma checagem nova, **na skill do projeto**. A única mudança na skill geral é o molde da etapa 6 (um arquivo novo e um ponteiro). Se a checagem funcionar, proponho promovê-la ao geral depois.
- Se o `npx` pedir para instalar o pacote do shadcn, ele roda do cache do npm e não instala nada global.
- A direção visual só é construída depois da sua confirmação na etapa 3, como a regra da `ds-skill` exige.

## Revisão

Mecânica pelo harness (`commit-guard` e `shadow-components`) e pelo detector do `impeccable`. Aceite por revisor separado da autoria, pelo `review`. Texto pelo `review-escrita`. Commit só pelos rituais de fechamento, e push só se você pedir.
