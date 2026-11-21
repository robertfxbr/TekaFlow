# Como regenerar os SVGs

Da pasta `marca/`, com a fonte Chillax 600 baixada do Fontshare:

```bash
python3 _construcao/exportar.py caminho/para/chillax-600.woff2
python3 _construcao/respiro.py caminho/para/chillax-600.woff2
```

O espaçamento das letras foi medido no navegador, em `medir-espacamento.html`, e está escrito dentro de `exportar.py`.

## Moodboard

```bash
python3 _construcao/moodboard-visual.py      # gera marca/moodboard.html (16:9, 1920 por 1080)
/Users/carlos/Library/Caches/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-mac-arm64/chrome-headless-shell --screenshot=moodboard.png --window-size=1920,1080 --hide-scrollbars --virtual-time-budget=7000 file://$PWD/moodboard.html
python3 _construcao/moodboard-grafismos.py   # gera marca/moodboard-grafismos.html (conceitos e referências)
```
