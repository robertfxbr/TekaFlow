# Como lançar uma versão do TekaFlow

Mac e Windows dividem o mesmo número de versão e a mesma release. Uma versão `vX.Y.Z` traz os arquivos dos dois sistemas, e cada app baixa só o que é dele:

| Sistema | Arquivos na release | Quem gera |
|---|---|---|
| Windows | `teka-update.json`, `teka-app-X.Y.Z.asar`, `TekaFlow-Setup-X.Y.Z.exe`, `latest.yml` | O Robert, no PC dele |
| Mac | `tekaflow-mac-update.json`, `tekaflow-mac-app-X.Y.Z.asar`, o `.zip` | A nuvem do GitHub, quando a tag é criada |

Os dois apps procuram atualização na release marcada como a mais recente. Por isso ela precisa ter os arquivos dos dois: uma release só com o Mac deixa o Windows sem atualização, e o contrário também.

## A cada versão nova

1. Combine o número com o Robert. Ele é o mesmo para os dois apps e segue a sequência que já existe (0.4.18, 0.4.19, e assim por diante).
2. Troque a versão em `app/package.json` (campo `version`) e em `package.json` na raiz. Se o Mac precisar de um instalador novo, troque também o `shellMin` do `app/package.json`.
3. Escreva a nota em `docs/releases/vX.Y.Z.md` no padrão de `docs/PADRAO-NOTA-RELEASE.md`, com o que mudou nos dois sistemas.
4. Rode o gate: `node scripts/gate.mjs`.
5. Envie para o `main` por pull request.
6. O Robert gera os arquivos do Windows e cria a release, que cria a tag junto e já fica marcada como a mais recente:

```bash
gh release create vX.Y.Z --repo robertfxbr/TekaFlow --target main --latest --title "TekaFlow X.Y.Z" --notes-file docs/releases/vX.Y.Z.md teka-app-X.Y.Z.asar teka-update.json TekaFlow-Setup-X.Y.Z.exe latest.yml
```

7. A tag dispara a release do Mac na nuvem (`.github/workflows/release.yml`). Ela confere se a tag bate com a versão do `app/package.json`, recompila o banco local para o Electron, abre o app empacotado e só põe os arquivos do Mac na mesma release se ele abrir. Acompanhe na aba Actions.

Para refazer só a parte do Mac de uma versão já publicada (como foi feito com a 0.4.18 depois do PR #7), use Actions, "Release do Mac", Run workflow, e informe a tag. Pelo terminal:

```bash
gh workflow run release.yml --repo robertfxbr/TekaFlow --ref main -f tag=vX.Y.Z
```

Se a tag for criada antes da release do Windows, a nuvem cria a release sem marcar como a mais recente. Quando o Windows subir, marque como a mais recente com `--latest`.

## Como a atualização automática funciona

- O app confere a release marcada como a mais recente ao abrir e quando a pessoa clica em **Atualizar** em Configurações.
- Se houver pacote leve, ele baixa, confere o hash e reinicia. Se a versão nova não abrir, o app volta sozinho para a anterior.
- Os arquivos têm nomes próprios do Mac (`tekaflow-mac-*`) e do Windows (`teka-*`, `TekaFlow-Setup-*`), e cada app baixa só os dele da mesma release.

## O que a release entrega e o que falta

- **Apple Silicon** (M1 em diante). Intel não está no fluxo.
- **Sem assinatura da Apple.** Quem baixa vê um aviso e abre com botão direito e **Abrir**. Para tirar o aviso, é preciso conta de desenvolvedor da Apple, assinatura e notarização (roadmap, etapa "o TekaFlow novo fora do Mac").
- O Whisper exige `brew install whisper-cpp` no Mac de quem usa. O Apple Speech funciona sem isso.
- O pacote leve não tem assinatura própria; a confiança é a da release. A spec 008 trata disso e do cofre de senhas.
- O app para Windows mora na raiz do repositório (`electron/`, `src/`), segue a mesma versão e sobe na mesma release.

## Testar o pacote antes, no seu Mac

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow/app && SEM_INSTALAR=1 npm run empacotar
```

Os arquivos saem em `app/release/`. Precisa de `npm ci` em `app/` e em `design-system/` antes.
