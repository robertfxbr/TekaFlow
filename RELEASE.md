# Como lançar uma versão do TekaFlow para Mac

O TekaFlow mora em [github.com/robertfxbr/TekaFlow](https://github.com/robertfxbr/TekaFlow), com o histórico do app original. A release é gerada na nuvem do GitHub a partir de uma etiqueta (tag) de versão. Quem já tem a 1.0.0 recebe as próximas versões sozinho, pelo pacote leve de atualização.

## A cada versão nova

1. **Número da versão.** Aumente `version` em `app/package.json` (por exemplo, 1.0.1). Só mexa em `shellMin` se a versão trocar o Electron ou um módulo nativo: aí a atualização leve não basta e o app pede o download completo.
2. **Nota da versão.** Crie `docs/releases/v1.0.1.md` no padrão de `docs/PADRAO-NOTA-RELEASE.md`. O fluxo da release usa esse arquivo como texto da página, e sem ele a release falha.
3. **Gate.** Rode o gate e espere aprovar:

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow && node scripts/gate.mjs
```

4. **Atualize a cópia limpa** (sem referências de terceiros, sem o clone do Robert, sem protótipos antigos):

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow && sh scripts/exportar-publico.sh
```

5. **Envie por pull request.** Crie um ramo no clone do repositório, copie a cópia limpa por cima, faça o commit, envie e abra o pull request. O GitHub roda tipos, build e voz da marca. Mescle quando passar.
6. **Crie a tag.** Isso dispara a release na nuvem:

```bash
git tag v1.0.1 && git push origin v1.0.1
```

7. **Confira.** Espere o fluxo terminar na aba Actions e abra [a página de versões](https://github.com/robertfxbr/TekaFlow/releases). Devem estar lá o `.zip` do Mac, o pacote leve `tekaflow-mac-app-X.Y.Z.asar` e o `tekaflow-mac-update.json`.

## Como a atualização automática funciona

- O app confere a última release do GitHub ao abrir e quando a pessoa clica em **Atualizar** em Configurações.
- Se houver pacote leve, ele baixa, confere o hash e reinicia. Se a versão nova não abrir, o app volta sozinho para a anterior.
- Os arquivos têm nomes próprios do Mac (`tekaflow-mac-*`) para o app antigo do Windows nunca baixar o pacote errado.

## O que a release entrega e o que falta

- **Apple Silicon** (M1 em diante). Intel não está no fluxo.
- **Sem assinatura da Apple.** Quem baixa vê um aviso e abre com botão direito e **Abrir**. Para tirar o aviso, é preciso conta de desenvolvedor da Apple, assinatura e notarização (roadmap, versão 1.3).
- O Whisper exige `brew install whisper-cpp` no Mac de quem usa. O Apple Speech funciona sem isso.
- O pacote leve não tem assinatura própria; a confiança é a da release. A spec 008 trata disso e do cofre de senhas.
- O app do Windows antigo continua no ramo `windows-legado` e nas versões 0.4.x.

## Testar o pacote antes, no seu Mac

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow/app && SEM_INSTALAR=1 npm run empacotar
```

Os arquivos saem em `app/release/`. Precisa de `npm ci` em `app/` e em `design-system/` antes.
