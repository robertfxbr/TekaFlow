# Como lançar uma versão do TekaFlow para Mac

A release é gerada na nuvem do GitHub. Você só precisa criar o repositório, enviar o código e criar uma etiqueta (tag) de versão.

## O repositório é o original (substitui o openPerssua)

O TekaFlow entra no repositório do Robert, `robertfxbr/openPerssua`, no lugar do app original, mantendo o histórico dele. Em ordem:

1. Em github.com, abra o repositório, **Settings** e, em **Repository name**, troque para **TekaFlow**. Só quem é administrador consegue. O GitHub redireciona o endereço antigo.
2. Rode o script que prepara a troca. Ele só prepara um ramo local e não envia nada:

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow && sh scripts/exportar-publico.sh && sh scripts/substituir-no-original.sh
```

3. Siga o comando de envio que o script mostrar (cria o ramo `tekaflow`) e abra o pull request. Depois do merge, crie a tag da versão (passos abaixo, trocando a pasta pelo clone que o script mostrou).

**Versão:** a última release do app antigo é a 0.4.16. O TekaFlow começa na **1.0.0**, por decisão do Carlos. Quem ainda usa a versão antiga recebe o aviso de atualização por esse repositório.

## Uma vez só, só se fosse um repositório novo

1. Abra [github.com/new](https://github.com/new).
2. Nome: **TekaFlow**. Público. Sem README, sem .gitignore e sem licença (o projeto já tem).
3. Clique em **Create repository**.

## Uma vez só: preparar a pasta que sobe

A pasta `Projects/TekaFlow-publico` é uma cópia limpa do projeto, só com o que pode ficar público (sem referências de terceiros, sem o clone do Robert, sem protótipos antigos). Para atualizá-la quando mudar algo:

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow && sh scripts/exportar-publico.sh
```

## A cada versão nova

1. Atualize a cópia (comando acima).
2. Rode o gate na cópia:

```bash
cd /Users/carlos/Documents/AI-Workspace/Projects/TekaFlow-publico && node scripts/gate.mjs
```

3. Depois da primeira troca, o repositório de trabalho passa a ser o clone do original (a pasta que o script mostrou). Para as versões seguintes, copie a cópia limpa para lá e envie:

```bash
cd <pasta do clone> && git add -A && git commit -m "TekaFlow 1.0.1" && git push
```

4. Crie a versão. Isso dispara a release na nuvem:

```bash
cd <pasta do clone> && git tag v1.0.0 && git push origin v1.0.0
```

5. Espere a release terminar na aba Actions e abra [github.com/robertfxbr/TekaFlow/releases](https://github.com/robertfxbr/TekaFlow/releases). O `.zip` do Mac estará lá, com as instruções de primeira abertura.

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
