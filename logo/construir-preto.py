import pathlib
base = pathlib.Path(__file__).parent
DY = .25; SW = .65
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
n = [0]
def arco(cx, y, c): return f'<path d="M{cx-.8} {y}Q{cx} {y-.8} {cx+.8} {y}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'
def barra(cx, h, c): return f'<rect x="{cx-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
def rosto(c): return arco(6.2, 8, c) + arco(9.8, 8, c) + barra(7, 1.1, c) + barra(8, 2.0, c) + barra(9, 1.1, c)
def simbolo(tile, det):
    n[0] += 1; u = f'x{n[0]}'
    return (f'<svg class="s" viewBox="1 1 14 14"><defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
            f'<path transform="translate(0 {DY})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
            f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#m{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g></svg>')
LIM, CLARO = '#C5EF6B', '#F1EFE9'
OPC = [('Oliva escuro', '#1A2010', 'mesmo tom do limão, só que na sombra', '#262D1A'),
       ('Grafite quente', '#1C1B17', 'levemente marrom, o que o Teka já usa', '#27261F'),
       ('Grafite neutro', '#1A1B1E', 'cinza com um fio de azul, mais tech', '#25262A'),
       ('Verde floresta', '#0F1A12', 'mais verde, mais profundo', '#19271C')]
cards = ''
for nome, hx, desc, sup in OPC:
    cards += f'''<section><h3>{nome} <code>{hx}</code></h3><p>{desc}</p>
<div class="esc" style="background:{hx}"><div class="ln">{simbolo(LIM, LIM)}<span class="pal" style="color:{CLARO}">TekaFlow</span></div>
<div class="card" style="background:{sup}"><b style="color:{CLARO}">Ouvindo com você</b><span style="color:#B9B8AE">Sussurra uma sugestão quando ajuda.</span></div>
<div class="bt" style="background:{LIM};color:{hx}">Começar</div></div>
<div class="ver" style="background:{LIM}"><div class="ln">{simbolo(hx, hx)}<span class="pal" style="color:{hx}">TekaFlow</span></div>
<div class="bt" style="background:{hx};color:{LIM}">Começar</div></div></section>'''
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, o quase preto</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@600&display=swap">
<style>
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:#fff;color:#161616;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:24px;margin:0 0 6px}} p.l{{margin:0 0 24px;color:#666;max-width:70ch;font-size:14px}}
.g{{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}}
h3{{font-size:16px;margin:0}} code{{font-size:12px;color:#777}} section p{{margin:2px 0 10px;color:#666;font-size:13px}}
.esc,.ver{{border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:16px;margin-bottom:8px}}
.ln{{display:flex;align-items:center;gap:12px}} .s{{width:48px;height:48px;flex:none}} .pal{{font-family:'Chillax',system-ui,sans-serif;font-weight:600;font-size:30px;line-height:1;letter-spacing:-.02em}}
.card{{border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:2px;font-size:14px}}
.bt{{border-radius:999px;padding:12px 20px;text-align:center;font-family:'Chillax',system-ui,sans-serif;font-weight:600;font-size:16px}}
</style></head><body><main>
<h1>O quase preto do TekaFlow</h1>
<p class="l">Quatro opções para o fundo, o texto e o botão, no lugar do preto absoluto. Em todas o contraste com o limão fica entre 12,7 e 13,5 para 1, bem acima do mínimo. O que muda é o parentesco com o verde: a cor sobre o limão e o limão sobre a cor.</p>
<div class="g">{cards}</div>
</main></body></html>'''
(base/'preto.html').write_text(html); print('ok')
