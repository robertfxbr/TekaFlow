import pathlib
base = pathlib.Path(__file__).parent
DY = .25; SW = .65  # traço dos olhos e da boca, um pouco mais grosso que antes (0,5)
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
n = [0]
def arco(cx, y, c): return f'<path d="M{cx-.8} {y}Q{cx} {y-.8} {cx+.8} {y}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'
def barra(cx, h, c): return f'<rect x="{cx-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
def rosto(c): return arco(6.2, 8, c) + arco(9.8, 8, c) + barra(7, .8, c) + barra(8, 1.5, c) + barra(9, .8, c)
def simbolo(tile, det, cabeca=None):
    """Ícone com o gato descido para a compensação óptica. cabeca=None deixa a cabeça vazada (mostra o fundo)."""
    n[0] += 1; u = f'x{n[0]}'
    if cabeca is None:
        return (f'<svg class="s" viewBox="1 1 14 14"><defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
                f'<path transform="translate(0 {DY})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
                f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#m{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g></svg>')
    return (f'<svg class="s" viewBox="1 1 14 14"><rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{rosto(det)}</g></svg>')
LIM, INK, ESC, BR = '#C5EF6B', '#161A0C', '#171614', '#FFFFFF'
def lock(sim, fonte, cor_t, fundo, borda=False):
    b = ';border:1px solid #e4e4e4' if borda else ''
    return f'<div class="lk" style="background:{fundo}{b}"><div class="ln">{sim}<span class="pal" style="font-family:\'{fonte}\',system-ui,sans-serif;color:{cor_t}">TekaFlow</span></div></div>'
linhas = ''
for f in ('Satoshi', 'Chillax'):
    linhas += (f'<h2>{f}</h2><div class="tri">'
               + lock(simbolo(INK, INK), f, INK, LIM)
               + lock(simbolo(LIM, LIM), f, '#F1EFE9', ESC)
               + lock(simbolo(INK, LIM, BR), f, INK, BR, True) + '</div>')
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, fundo verde, escuro e claro</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700&f[]=chillax@700&display=swap">
<style>
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:#fff;color:#161616;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:24px;margin:0 0 8px}} h2{{font-size:16px;margin:32px 0 10px;color:#555;font-weight:600}}
.tri{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}}
.lk{{border-radius:16px;padding:44px 28px;display:flex;align-items:center;min-height:150px}}
.ln{{display:flex;align-items:center;gap:16px}} .s{{width:64px;height:64px;flex:none}} .pal{{font-size:48px;line-height:1;letter-spacing:-.02em}}
</style></head><body><main>
<h1>TekaFlow, fundo verde, escuro e claro</h1>
{linhas}
</main></body></html>'''
(base/'comparacao-fundos.html').write_text(html); print('ok')
