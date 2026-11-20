# Padrão da nota de release do TekaFlow

Vale para toda nota de versão do TekaFlow. É o mesmo padrão das notas do JobRelay, aprovado por Carlos em 11 de Novembro de 2026. Modelo vivo: `docs/releases/v1.0.0.md`.

## Quem lê

Pessoa em reunião, sem formação técnica. A nota diz o que muda para ela, em português simples e no tom da marca: Tranquilo e Despretensioso, sem exclamação e sem prometer tempo ou resultado. Nome de arquivo, comando, termo de código e detalhe de implementação ficam fora.

## Estrutura, nesta ordem

| Bloco | Formato |
|---|---|
| Título | `# TekaFlow X.Y.Z: <a mudança principal em poucas palavras>` |
| Abertura | Três linhas curtas, sem emoji: `Versão X.Y.Z`, a data por extenso e uma frase de como instalar ou atualizar |
| `## ⭐ Destaques` | Até três frases, cada uma com um ganho que a pessoa percebe |
| `## 🆕 Novidades` | O que não existia antes |
| `## ✨ Melhorias` | O que já existia e ficou melhor |
| `## 🛠️ Correções` | O que funcionava errado e foi corrigido |

Seção sem item sai inteira. A nota não traz seção de problemas conhecidos. Quando o repositório entrega mais de um sistema (hoje, o Windows antigo), um rodapé curto depois de uma linha `---` diz onde baixar o outro.

## Cada item

`- **Nome curto:** Descrição.`

- O nome tem até cinco palavras e diz a coisa, não o benefício.
- A descrição começa com Adicionamos, Alteramos, Criamos ou Corrigimos, com inicial maiúscula, e tem de uma a três frases.
- Recurso em teste leva `(beta)` no nome e diz como a pessoa escolhe usar.
- Quando a novidade convive com algo que já existia, a descrição diz o que continua.

## Antes de publicar

- Cada item tem lastro na spec ou no commit da versão. Nada que já saiu em versão anterior entra como novo.
- A data é a da publicação da release, não a da preparação.
- Nenhum travessão. O gate de voz (`scripts/voz-da-marca.mjs`) confere o arquivo.
- O fluxo da release usa `docs/releases/<tag>.md` como texto da página.
