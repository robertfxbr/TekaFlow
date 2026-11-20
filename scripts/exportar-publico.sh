#!/bin/sh
# Copia o projeto, sem o que não pode ficar público, para Projects/TekaFlow-publico (repositório próprio).
set -e
ORIGEM="$(cd "$(dirname "$0")/.." && pwd)"
DESTINO="$ORIGEM/../TekaFlow-publico"
mkdir -p "$DESTINO"
rsync -a --delete \
  --exclude '.git/' --exclude 'node_modules/' --exclude 'dist/' --exclude 'dist-app/' --exclude 'release/' --exclude 'renderer/' \
  --exclude 'robert-openperssua/' --exclude 'referencias/' --exclude 'prototipos/' --exclude '.DS_Store' --exclude '*.log' \
  "$ORIGEM/" "$DESTINO/"
# O README público (o vendedor) vira o README da cópia; o interno fica só no workspace.
rm -f "$DESTINO/README.md" && mv "$DESTINO/README.publico.md" "$DESTINO/README.md"
# O texto da página da release é copiado junto (.github/), o gate e o gancho também (scripts/).
echo "Cópia atualizada em $DESTINO"
