import pathlib
base = pathlib.Path(__file__).parent
S = 15

def arco(cx, y, w, sw, rise, c): return f'<path d="M{cx-w/2} {y}Q{cx} {y-rise} {cx+w/2} {y}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round"/>'
def barra(cx, cy, h, w, c): return f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{w/2}" fill="{c}"/>'
def poly(pts, c, sw=.6): return '<polygon points="' + ' '.join(f'{x},{y}' for x, y in pts) + f'" fill="{c}" stroke="{c}" stroke-width="{sw}" stroke-linejoin="round"/>'
TILE = '<rect x="1" y="1" width="14" height="14" rx="4"/>'

def rosto(c, ex, ey, w, sw, rise, mx, my, alt, bw):
    o = arco(ex[0], ey, w, sw, rise, c) + arco(ex[1], ey, w, sw, rise, c)
    n = len(alt); x0 = mx - (n-1)/2
    return o + ''.join(barra(x0+i, my, h, bw, c) for i, h in enumerate(alt))

# cabeças usadas como recorte do ícone
H_MOLE = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
H_FACE = [(3.5, 3), (6.5, 5), (9.5, 5), (12.5, 3), (13, 8), (12, 11.5), (8, 13), (4, 11.5), (3, 8)]

def svg(corpo):
    return corpo

def A1(u):
    mk = f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/><path d="{H_MOLE}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
    return mk + f'<g fill="currentColor" mask="url(#m{u})">{TILE}</g>' + rosto('currentColor', (6.2, 9.8), 8, 1.6, .5, .8, 8, 10, [.8, 1.5, .8], .5)
def A2(u):
    mk = f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{poly(H_FACE, "black")}</mask></defs>'
    return mk + f'<g fill="currentColor" mask="url(#m{u})">{TILE}</g>' + rosto('currentColor', (6, 10), 7.6, 1.8, .5, .8, 8, 10.2, [.6, 1, 1.4, 1, .6], .4)
def A3(u):
    cut = rosto('black', (6.2, 9.8), 8, 1.6, .5, .8, 8, 10, [.8, 1.5, .8], .5)
    mk = f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{cut}</mask></defs>'
    ring = '<rect x="1.3" y="1.3" width="13.4" height="13.4" rx="3.8" fill="none" stroke="currentColor" stroke-width=".6"/>'
    return ring + mk + f'<g fill="currentColor" mask="url(#m{u})"><path d="{H_MOLE}" stroke="currentColor" stroke-width=".5" stroke-linejoin="round"/></g>'

def peek(u, topy, ey, eyes_w, mouth, extra=''):
    ears = [(4.2, topy), (4.8, topy-2.6), (7.5, topy-.6)], [(11.8, topy), (11.2, topy-2.6), (8.5, topy-.6)]
    hole = poly(ears[0], 'black') + poly(ears[1], 'black') + f'<rect x="4" y="{topy-.6}" width="8" height="12" rx="3.5" fill="black"/>' + extra
    mk = f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{hole}</mask></defs>'
    return mk + f'<g fill="currentColor" mask="url(#m{u})">{TILE}</g>' + mouth

def B1(u): return peek(u, 10.2, 12.6, 1.4, arco(6.3, 12.6, 1.4, .45, .6, 'currentColor') + arco(9.7, 12.6, 1.4, .45, .6, 'currentColor'))
def B2(u):
    ondas = barra(6.5, 5.2, 2, .5, 'black') + barra(8, 5.2, 3.5, .5, 'black') + barra(9.5, 5.2, 2, .5, 'black')
    return peek(u, 10.2, 12.6, 1.4, arco(6.3, 12.6, 1.4, .45, .6, 'currentColor') + arco(9.7, 12.6, 1.4, .45, .6, 'currentColor'), ondas)
def B3(u): return peek(u, 7.4, 10, 1.8, arco(6, 10, 1.8, .5, .8, 'currentColor') + arco(10, 10, 1.8, .5, .8, 'currentColor') + barra(7, 12.6, 1, .5, 'currentColor') + barra(8, 12.6, 1.8, .5, 'currentColor') + barra(9, 12.6, 1, .5, 'currentColor'))

def bolha(u, corpo, cortes):
    mk = f'<defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{cortes}</mask></defs>'
    return mk + f'<g fill="currentColor" mask="url(#m{u})">{corpo}</g>'
def C1(u):
    corpo = '<rect x="2" y="4" width="12" height="8.5" rx="4"/>' + poly([(3.5, 6), (3.5, 1.8), (6.8, 4)], 'currentColor') + poly([(12.5, 6), (12.5, 1.8), (9.2, 4)], 'currentColor') + poly([(11, 11.5), (13.5, 14.8), (8.5, 12.3)], 'currentColor')
    return bolha(u, corpo, rosto('black', (6, 10), 8, 1.8, .5, .8, 8, 10.3, [.8, 1.5, .8], .5))
def C2(u):
    corpo = '<rect x="2" y="4" width="12" height="8.5" rx="4"/><circle cx="4.8" cy="4" r="1.6"/><circle cx="11.2" cy="4" r="1.6"/>' + poly([(5, 11.5), (2.5, 14.8), (7.5, 12.3)], 'currentColor')
    return bolha(u, corpo, rosto('black', (6, 10), 8, 1.8, .5, .8, 8, 10.3, [.6, 1, 1.4, 1, .6], .4))
def C3(u):
    corpo = '<rect x="2" y="4.5" width="12" height="8" rx="3.5"/>' + poly([(3.5, 6.5), (3.5, 2.2), (7, 4.5)], 'currentColor') + poly([(12.5, 6.5), (12.5, 2.2), (9, 4.5)], 'currentColor') + poly([(6.8, 12), (8, 14.8), (9.2, 12)], 'currentColor')
    orelhas = '<polygon points="4.4,5.6 4.4,3.8 5.8,4.7" fill="black"/><polygon points="11.6,5.6 11.6,3.8 10.2,4.7" fill="black"/>'
    return bolha(u, corpo, orelhas + rosto('black', (6, 10), 8.4, 1.8, .5, .8, 8, 10.6, [.8, 1.5, .8], .5))

V = [('A1','Rosto recortado, cabeça macia, boca de três risquinhos',A1),('A2','Rosto recortado, cabeça facetada, boca de cinco',A2),('A3','Cabeça cheia dentro de um aro, rosto recortado',A3),
     ('B1','Gato espiando pela borda de baixo, só os olhos',B1),('B2','Gato espiando, com a voz subindo em barras',B2),('B3','Gato espiando maior, com olhos e boca',B3),
     ('C1','O rosto é um balão de fala, orelhas pontudas, cauda à direita',C1),('C2','O rosto é um balão de fala, orelhas redondas, cauda à esquerda',C2),('C3','O rosto é um balão de fala, com a orelha por dentro',C3)]

def malha():
    fina = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(17)); forte = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(0, 17, 2))
    return f'<g class="malha"><g stroke="#18a0fb" stroke-width=".05" fill="none" opacity=".4">{fina}</g><g stroke="#18a0fb" stroke-width=".07" fill="none" opacity=".7">{forte}</g></g>'
for n, t, f in V:
    (base/'svg-ref'/f'{n}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="{16*S}" height="{16*S}" fill="currentColor" role="img" aria-label="TekaFlow {n}">{f("s"+n)}</svg>')

cel = ''.join(f'<figure><div class="sim"><svg viewBox="0 0 16 16" fill="currentColor">{f("g"+n)}{malha()}</svg></div><figcaption><b>{n}</b> {t}</figcaption></figure>' for n, t, f in V)
def mini(n, f): return ''.join(f'<span><svg viewBox="0 0 16 16" width="{px}" height="{px}">{f(f"t{px}{n}")}</svg></span>' for px in (16, 32, 64))
testes = ''.join(f'<div class="t"><b>{n}</b>{mini(n, f)}</div>' for n, t, f in V)
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, nove variações das referências</title>
<style>
:root{{--fundo:#fff;--tinta:#161616;--linha:#e4e4e4}}
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:var(--fundo);color:var(--tinta);font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1100px;margin:0 auto}} header{{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:24px}}
h1{{font-size:28px;margin:0 0 4px;letter-spacing:-.01em}} p.l{{margin:0;color:#555;max-width:66ch}} h2{{font-size:18px;margin:40px 0 12px}}
button{{font:inherit;font-size:14px;border:1px solid var(--tinta);background:#fff;border-radius:999px;padding:8px 16px;cursor:pointer}} button[aria-pressed=true]{{background:var(--tinta);color:#fff}}
.grade{{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--linha);border-radius:16px;overflow:hidden}}
.grade figure{{margin:-1px 0 0 -1px;border:1px solid var(--linha);padding:20px 12px 12px}}
.sim{{width:100%;max-width:240px;margin:0 auto;color:#000}} .sim svg{{width:100%;height:auto;display:block}} figcaption{{font-size:13px;color:#555;margin-top:12px}}
.malha{{display:none}} body.m .malha{{display:block}}
.testes{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}}
.t{{border:1px solid var(--linha);border-radius:16px;padding:16px;display:flex;align-items:flex-end;gap:16px;color:#000}} .t b{{font-size:13px;color:#555;margin-right:auto;align-self:flex-start}} .t span{{display:block;line-height:0}}
@media(max-width:760px){{.grade{{grid-template-columns:1fr}}}}
</style></head><body><main>
<header><div><h1>TekaFlow, nove variações a partir das suas referências</h1>
<p class="l">Linha A: o rosto recortado dentro de um ícone, das referências 1, 2 e 3. Linha B: o gato espiando pela borda, da 4. Linha C: o rosto que é um balão de fala, da 9. Malha 16×16, com os olhos levemente felizes e a boca em risquinhos de voz.</p></div>
<button id="b" aria-pressed="false">Mostrar a malha</button></header>
<div class="grade">{cel}</div>
<h2>Teste de tamanho: 16, 32 e 64 pixels</h2><div class="testes">{testes}</div>
</main>
<script>const b=document.getElementById('b');b.onclick=()=>{{const on=document.body.classList.toggle('m');b.setAttribute('aria-pressed',on);b.textContent=on?'Esconder a malha':'Mostrar a malha'}}</script>
</body></html>'''
(base/'nove-variacoes-referencias.html').write_text(html); print('ok')
