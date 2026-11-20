# TekaFlow: contrato para agentes

Este arquivo vale para qualquer agente de IA (Claude Code, Codex e outros) que trabalhe neste repositório. As mesmas regras estão resumidas em [CLAUDE.md](CLAUDE.md).

## Mapa

| Pasta | O que é |
|---|---|
| `app/` | O aplicativo para Mac em Electron: janela, banco local, ajudante de voz (Swift), empacotamento |
| `design-system/` | Tokens, componentes, Style Guide e a interface do app (`src/app/`) |
| `marca/`, `logo/`, `naming/` | Marca: cores, logo, gato, posicionamento |
| `specs/` | O que foi pedido em cada etapa |
| `scripts/` | Gate, gancho de commit e cópia limpa para publicar |

## Fluxo para qualquer mudança

1. Leia `PRODUCT.md`, `DECISIONS.md` e `design-system/architecture.md`.
2. Mudou interface? Carregue a skill `impeccable` e rode o contexto dela uma vez por sessão. Construa dentro dos tokens e componentes que já existem.
3. Precisa de componente novo? Use a família `ds-skill` (`ds-new-component`). Ela confere o inventário antes de criar.
4. Escreveu texto que uma pessoa lê (interface, README, release)? Siga o tom da marca: **Tranquilo e Despretensioso** (`marca/posicionamento.md`). O gate confere (`scripts/voz-da-marca.mjs`): sem travessão, sem exclamação, sem promessa de tempo ou resultado, sem "sempre" e "garante", sem "de graça" nem "totalmente local", sem a linguagem dos concorrentes ("invisível", "indetectável", "#1"), nome sempre TekaFlow.
5. Rode o gate: `node scripts/gate.mjs`. Ele reprova bloqueio novo do harness e de voz da marca. Os bloqueios antigos estão em `design-system/.harness/baseline.json`; **não aumente esses arquivos para fazer o gate passar**. Corrija ou peça decisão.
6. Registre a decisão em `DECISIONS.md`.

## Limites

- Não commite nem faça push sem o pedido de quem mantém.
- Não escreva segredo, chave de API ou token no código. As chaves dos usuários ficam no cofre do sistema.
- Não remova créditos nem o `LICENSE` (política do projeto original, MIT).
- Agente de IA entra como contribuidor, nunca como autor.

Instalação das skills e passo a passo de contribuição: [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md).

## Créditos (obrigatório manter, política do projeto original)

Este projeto parte do trabalho de **Robert** ([github.com/robertfxbr](https://github.com/robertfxbr)), com licença MIT.

1. Não remova nem altere o aviso de copyright do `LICENSE`, o campo `author` do `package.json` nem a seção Créditos do `README.md`.
2. Mantenha o link `https://github.com/robertfxbr/openPerssua` na documentação.
3. Agente de IA entra como contribuidor, nunca como autor.

## Revisão de pull request

Quem revisa (pessoa ou agente) confere, além do gate: o harness do design system, a voz da marca e a escrita (a skill `review-escrita`, quando instalada). O modelo de checklist está em `.github/pull_request_template.md`.
