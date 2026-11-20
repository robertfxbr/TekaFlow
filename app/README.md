# O aplicativo do TekaFlow

O aplicativo real, em Electron, para Mac e, depois, Windows. O onboarding, a tela inicial e a reunião são reais: permissões do Mac, IA conectada, transcrição local, janela de reunião própria com transcrição ao vivo e salvamento em `~/Documents/TekaFlow/Reuniões`. As specs são `../specs/pendentes/004` a `007`. O que falta está em `../ROADMAP.md`.

A interface é a do Design System (`../design-system/src/app/`). Esta pasta guarda a janela, o banco local e o empacotamento.

## Como rodar

Abre o app para testar (sobe a tela e a janela juntas; feche a janela para parar):

```bash
cd Projects/TekaFlow/app && npm run dev
```

Gera o aplicativo `TekaFlow.app`, em `dist-app/`, para abrir com duplo clique:

```bash
cd Projects/TekaFlow/app && npm run empacotar
```

## Para ajustar e testar

- O menu **Desenvolvimento** pula para qualquer etapa do onboarding, abre a tela inicial ou refaz o onboarding do zero (Cmd+Shift+O).
- Os dados ficam em `~/Library/Application Support/TekaFlow/tekaflow.db`. Apagar o arquivo recomeça tudo (não há sessões de exemplo). As reuniões salvas ficam em `~/Documents/TekaFlow/Reuniões`.
- Para conferir a tela sem olhar: `TEKA_CAPTURA=/tmp/foto.png` faz o app tirar uma foto da janela e fechar.
