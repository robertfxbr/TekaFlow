# Skills que o TekaFlow usa

Para quem constrói (pessoa ou agente). O projeto segue o mesmo caminho: **impeccable** para a interface, **ds-skill** para o Design System, **gate** antes de subir. A tabela diz qual skill abrir em cada tarefa.

| Quando você vai | Skill |
|---|---|
| Criar ou mudar uma tela do app | `impeccable` e `ds-new-page` |
| Criar um componente novo | `ds-new-component` (confere o inventário antes) |
| Mexer em cor, espaço, raio, tipografia | `ds-design-system` (cor nova entra no token primeiro) |
| Atualizar a página do Style Guide | `ds-sandbox` |
| Conferir o que está fora do sistema | `ds-harness` (o gate já roda ela) |
| Levar tokens e componentes ao Figma | `ds-figma` |
| Desenhar ou revisar o fluxo de telas | `ds-flow` |
| Escrever texto de tela, README ou nota de release | `review-escrita` e o tom da marca (`marca/posicionamento.md`) |
| Revisar antes de mesclar | `review` e `critic` |
| Segurança do app | `provensec-app` (spec 008, pendente) |

## Onde instalar

- **Família `ds-skill` (inclui o harness):** [github.com/caarloshq/ds-skills](https://github.com/caarloshq/ds-skills).
- **`impeccable`:** instalação em [impeccable.style](https://impeccable.style).
- **`review`, `review-escrita`, `critic` e `provensec`:** skills do workspace do Carlos. Sem elas, o gate avisa e segue; só o harness, o detector e a voz da marca são exigidos.

Passo a passo de instalação: [CONTRIBUINDO.md](CONTRIBUINDO.md).
