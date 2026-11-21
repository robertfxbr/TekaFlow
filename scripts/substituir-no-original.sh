#!/bin/sh
# Troca o conteúdo do repositório original (openPerssua, que vira TekaFlow) pelo TekaFlow, mantendo o histórico do Robert.
# Não envia nada: prepara um ramo local e mostra o comando de envio.
set -e
# Já foi usado (PR #1, novembro de 2026). Rodar de novo apagaria o app para Windows, que voltou a morar
# no main ao lado do Mac. Veja NOTA-PARA-O-CARLOS.md.
echo "Este script não deve mais ser usado: o TekaFlow para Mac já está no main, junto com o app para Windows."
echo "Leia NOTA-PARA-O-CARLOS.md para o jeito novo de enviar mudanças."
exit 1
ORIGEM="$(cd "$(dirname "$0")/.." && pwd)/../TekaFlow-publico"
TMP="$(mktemp -d)"
[ -d "$ORIGEM" ] || { echo "Rode antes: sh scripts/exportar-publico.sh"; exit 1; }
git clone git@github.com:robertfxbr/openPerssua.git "$TMP/repo"
cd "$TMP/repo"
git checkout -b tekaflow
# Tira tudo que está versionado (o histórico fica) e põe o TekaFlow no lugar.
git rm -r -q --ignore-unmatch .
rsync -a --exclude '.git/' --exclude 'node_modules/' "$ORIGEM/" ./
git add -A
git commit -q -m "TekaFlow: substitui o Teka pela versão para Mac, com Design System, marca e gate de qualidade" -m "A base e os créditos continuam do Robert (LICENSE e README)."
echo ""
echo "Pronto, em: $TMP/repo (ramo tekaflow). Confira com: cd $TMP/repo && git log --stat -1 | head -20"
echo "Para enviar como pull request: cd $TMP/repo && git push -u origin tekaflow"
