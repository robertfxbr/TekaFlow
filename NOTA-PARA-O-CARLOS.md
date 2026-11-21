# Nota para o Carlos: o que mudou no main

Oi, Carlos. O Robert pediu para ajustar o TekaFlow para Mac ao jeito de versionar que o app para Windows já usava. Abaixo está o que mudou, por quê e o que muda no seu fluxo. Pode apagar este arquivo depois de ler.

## Por quê

O app para Windows tem gente usando e se atualiza sozinho. Ele e o app para Mac procuram atualização do mesmo jeito: pedem ao GitHub a release marcada como a mais recente do TekaFlow. O repositório só tem uma. Quando a v1.0.0 do Mac saiu como a mais recente, todo Windows passou a ver "versão 1.0.0 disponível" sem conseguir instalar, e deixaria de receber qualquer versão nova do Windows. Se o Windows publicasse por cima, o mesmo aconteceria com o Mac.

## O que mudou

1. **O app para Windows voltou para o main.** Ele mora na raiz (`electron/`, `src/`, `package.json`), ao lado do `app/` e do `design-system/`. Nada do Mac foi apagado. O ramo `windows-legado` ficou como estava.
2. **Uma versão só para os dois.** O Mac saiu de 1.0.0 para **0.4.18**, o mesmo número do Windows. O `shellMin` do `app/package.json` também foi para 0.4.18. O código do app é o mesmo da 1.0.0.
3. **Uma release só por versão.** A release `v0.4.18` traz os arquivos do Windows e os do Mac. Cada app baixa só os dele, pelos nomes que você já tinha escolhido (`tekaflow-mac-update.json` e `tekaflow-mac-app-X.Y.Z.asar`), então o `atualizador.cjs` não precisou mudar.
4. **A release do Mac na nuvem** (`.github/workflows/release.yml`) agora confere se a tag bate com a versão do `app/package.json` e põe os arquivos do Mac na release que já existe. Se ela ainda não existir, cria sem marcar como a mais recente. A nota em `docs/releases/<tag>.md` continua como você deixou. O runner é o `macos-latest`, como no seu PR #2 (o `macos-14` não é aceito nesta conta). A sua correção do PR #7 também está lá: o banco é recompilado para o Electron e a release só segue se o app empacotado abrir. Para refazer a parte do Mac de uma versão já publicada, use Actions, "Release do Mac", Run workflow, com a tag.
5. **A release v1.0.0** virou pré-lançamento, para sair da posição de mais recente. Ela continua na página, com os arquivos.
6. **README:** o seu é a base. Entrou a parte do Windows (botão de download, seção "Para Windows" e "Uma versão, dois sistemas"). O README técnico do Windows virou `WINDOWS.md`, e os planos antigos dele foram para `docs-windows/`, fora da pasta que o gate de voz confere.
7. **AGENTS.md:** o seu contrato continua. Entraram a pasta do Windows no mapa, a regra de versão e as regras do app para Windows.
8. **`scripts/substituir-no-original.sh`** agora sai com aviso sem fazer nada. Rodar de novo apagaria o app para Windows.

## O que muda no seu fluxo

- **Próxima versão:** combine o número com o Robert e siga o `RELEASE.md`. Não crie tag sozinho: a tag dispara a release do Mac e, sem os arquivos do Windows, ela fica fora da posição de mais recente e o Mac não recebe a atualização.
- **Enviar mudanças:** faça pull request para o `main` e trabalhe direto num clone dele. Se continuar usando a cópia limpa (`TekaFlow-publico`), copie para o clone só as pastas do Mac (`app/`, `design-system/`, `marca/`, `logo/`, `naming/`, `specs/`, `docs/`) e nunca use `rsync --delete` nem `git rm -r .` na raiz do clone. Isso apaga o app para Windows de novo.
- **README.publico.md:** se o seu `exportar-publico.sh` trocar o README, a seção do Windows some. Traga para ela o que mudou no README daqui.
- **Seu Mac com a 1.0.0:** ele não vai ver a 0.4.18 como nova, porque 1.0.0 é um número maior. Baixe o `.zip` da 0.4.18 uma vez; daí em diante as atualizações chegam sozinhas.

Qualquer dúvida, fala com o Robert.
