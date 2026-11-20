import pathlib
base = pathlib.Path(__file__).parent
DY = .25  # descida do gato dentro do ícone, compensação óptica (cerca de 4 px a 240 px)

def arco(cx, y, w, sw, rise): return f'<path d="M{cx-w/2} {y}Q{cx} {y-rise} {cx+w/2} {y}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round"/>'
def barra(cx, cy, h, w): return f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{w/2}" fill="currentColor"/>'
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
def simbolo(u, dy=DY):
    rosto = arco(6.2, 8, 1.6, .65, .8) + arco(9.8, 8, 1.6, .65, .8) + barra(7, 10, .8, .65) + barra(8, 10, 1.5, .65) + barra(9, 10, .8, .65)
    return (f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
            f'<path transform="translate(0 {dy})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
            f'<g fill="currentColor" mask="url(#m{u})"><rect x="1" y="1" width="14" height="14" rx="4"/></g><g transform="translate(0 {dy})">{rosto}</g>')
(base/'TekaFlow-simbolo-A1.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 14 14" width="210" height="210" fill="currentColor" role="img" aria-label="TekaFlow">{simbolo("f")}</svg>')

FONTES = [('Clash Display','clash-display',700),('Cabinet Grotesk','cabinet-grotesk',800),('Chillax','chillax',700),('Satoshi','satoshi',700),
          ('General Sans','general-sans',700),('Supreme','supreme',700),('Switzer','switzer',700),('Synonym','synonym',700)]
css = '&'.join(f'f[]={s}@{w}' for _, s, w in FONTES)
INK, ESC = '#161A0C', '#171614'
VERDES = [('Limão (o atual)', '#C5EF6B', '13,4', '13,7'), ('Verde vivo', '#8BE04E', '10,8', '11,1'), ('Verde folha', '#3FCB6B', '8,4', '8,6')]
n = [0]
def sim(cor):
    n[0] += 1; return f'<svg class="s" viewBox="1 1 14 14" fill="{cor}" style="color:{cor}">{simbolo("x"+str(n[0]))}</svg>'
def lock(fonte, peso, cor_s, cor_t, fundo, nome='', cls=''):
    return f'<div class="lk {cls}" style="background:{fundo}"><div class="ln">{sim(cor_s)}<span class="pal" style="font-family:\'{fonte}\',system-ui,sans-serif;font-weight:{peso};color:{cor_t}">TekaFlow</span></div><small style="color:{cor_t}">{nome}</small></div>'

fontes_html = ''.join(
    f'<section class="f"><h3>{f}</h3><p>Fontshare, uso comercial livre</p><div class="par">{lock(f, w, ESC, ESC, "#C5EF6B", "sobre limão")}{lock(f, w, "#C5EF6B", "#F1EFE9", ESC, "sobre grafite")}</div></section>'
    for f, s, w in FONTES)
cores_html = ''.join(
    f'<section class="c"><h3>{nome} <code>{hx}</code></h3><p>Tinta sobre o verde: {a}:1. Verde sobre o escuro: {b}:1.</p><div class="par">{lock("Cabinet Grotesk", 800, INK, INK, hx, "fundo verde", "sel")}{lock("Cabinet Grotesk", 800, hx, "#F1EFE9", ESC, "fundo escuro", "sel")}</div></section>'
    for nome, hx, a, b in VERDES)

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, tipografia e cor</title>
<link rel="preconnect" href="https://api.fontshare.com"><link rel="stylesheet" href="https://api.fontshare.com/v2/css?{css}&display=swap">
<style>
:root{{--fundo:#fff;--tinta:#161616;--linha:#e4e4e4}}
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:var(--fundo);color:var(--tinta);font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:28px;margin:0 0 4px;letter-spacing:-.01em}} p.l{{margin:0 0 8px;color:#555;max-width:68ch}}
h2{{font-size:20px;margin:48px 0 4px}} h3{{font-size:16px;margin:0}} section p{{margin:2px 0 12px;color:#666;font-size:13px}} code{{font-size:13px;color:#555}}
.g8{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}}
.par{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px}}
.lk{{border-radius:16px;padding:24px 16px 12px;display:flex;flex-direction:column;gap:20px;min-height:150px;justify-content:space-between}}
.ln{{display:flex;align-items:center;gap:12px}} .s{{width:50px;height:50px;flex:none}}
.pal{{font-size:34px;line-height:1;letter-spacing:-.02em}}
.lk small{{opacity:.7;font-size:12px}}
.sel .s{{width:64px;height:64px}} .sel .pal{{font-size:46px}}
.cs{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}}
.cs .par{{grid-template-columns:1fr}}
@media(max-width:900px){{.g8,.cs{{grid-template-columns:1fr}} .par{{grid-template-columns:1fr}}}}
</style></head><body><main>
<h1>TekaFlow, tipografia e cor</h1>
<p class="l">O símbolo A1, com o gato descido {DY} de célula para a compensação óptica (cerca de 4 pixels a 240 pixels). Primeiro oito tipografias fora do Google Fonts, todas do Fontshare, com uso comercial livre. Depois três tons de verde, em fundo verde e em fundo escuro.</p>
<h2>Tipografia ao lado do símbolo</h2>
<p class="l">Cada uma sobre o limão atual e sobre o grafite.</p>
<div class="g8">{fontes_html}</div>
<h2>Três verdes, na tipografia Cabinet Grotesk</h2>
<p class="l">O limão #C5EF6B é a cor de assinatura que o Teka já tem. Os outros dois são alternativas para comparar. A tinta é a #161A0C em todos.</p>
<div class="cs">{cores_html}</div>
</main></body></html>'''
(base/'tipografia-e-cor.html').write_text(html); print('ok', len(html)//1024, 'KB')
