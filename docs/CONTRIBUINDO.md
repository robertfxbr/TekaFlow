# Como contribuir no padrão do TekaFlow

Para quem vai criar telas ou componentes (você, Robert, ou um agente) e subir para o GitHub seguindo as mesmas regras do projeto.

## 1. Instalar as skills (uma vez)

O gate e o fluxo de design usam duas skills. Elas ficam no seu computador, não no repositório.

**Família de design system (`ds-skill`, inclui o harness):**

```bash
git clone git@github.com:caarloshq/ds-skills.git ~/.claude/skills/ds-skill
```

**impeccable (design de interface):** instale pelo que a ferramenta indica em [impeccable.style](https://impeccable.style) ou, em Claude Code:

```bash
npx skills add pbakaus/impeccable
```

Confira o comando no site do impeccable antes de rodar, porque ele pode mudar.

## 2. Preparar o projeto

```bash
cd design-system && npm ci
cd ../app && npm ci
```

Para ver a interface: `cd design-system && npm run dev -- --port 5180`. Para abrir o app: `cd app && npm run dev`.

## 3. Criar uma tela ou componente

1. Peça ao agente: "crie X seguindo o CLAUDE.md". Ele deve ler as regras, usar `impeccable` e `ds-skill`.
2. Cor, espaço e tipografia vêm dos tokens. Componente novo só depois de conferir o inventário (`design-system/inventario-componentes.md`).
3. Mostre o resultado na tela e confira em modo claro e escuro.

## 4. Passar o gate

```bash
node scripts/gate.mjs
```

Ele confere tipos, build, harness do design system (só reprova o que for novo) e o detector de design. Para rodar sozinho antes de cada commit:

```bash
node scripts/instalar-gancho.mjs
```

## 5. Subir

1. Crie um ramo: `git checkout -b minha-mudanca`.
2. Commit com mensagem que diga o que muda na tela.
3. Abra um pull request. O GitHub roda tipos e build sozinho.
4. Registre a decisão em `DECISIONS.md`.

## Lançar uma versão do Mac

Veja [RELEASE.md](../RELEASE.md).

## Créditos

Não remova o `LICENSE` nem a seção Créditos do README. A base é do Robert, [openPerssua](https://github.com/robertfxbr/openPerssua).
