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

7. A tag dispara a release do Mac na nuvem (`.github/workflows/release.yml`). Ela confere se a tag bate com a versão do `app/package.json` e põe os arquivos do Mac na mesma release. Acompanhe na aba Actions.

Se a tag for criada antes da release do Windows, a nuvem cria a release sem marcar como a mais recente. Quando o Windows subir, marque como a mais recente com `--latest`.

## O que a release entrega e o que falta

- **Apple Silicon** (M1 em diante). Intel não está no fluxo.
- **Sem assinatura da Apple**: quem baixar vê um aviso e precisa abrir com botão direito e **Abrir**. As instruções estão na página da release. Para tirar o aviso, é preciso uma conta de desenvolvedor da Apple, assinatura e notarização.
- O Whisper exige `brew install whisper-cpp` no Mac de quem usa; o Apple Speech funciona sem isso.
- Antes de uma versão para o público, tirar o cofre de senhas de teste do app (veja `ROADMAP.md`).

## Testar o pacote antes, no seu Mac

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow/app && SEM_INSTALAR=1 npm run empacotar
```

O `.zip` sai em `app/release/`.
