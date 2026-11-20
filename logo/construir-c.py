import pathlib
base = pathlib.Path(__file__).parent
S = 15  # unidade da malha 16x16

def P(pts, w=1):
    p = ' '.join(f'{x},{y}' for x, y in pts)
    return f'<polygon points="{p}" stroke="currentColor" stroke-width="{w}" stroke-linejoin="round"/>'
MASSA = '<rect x="2" y="5" width="12" height="9" rx="4"/>' + P([(3, 7), (3, 3), (7, 5)]) + P([(13, 7), (13, 3), (9, 5)])  # cabeça de frente, a 1C

BY, EX, W = 8.5, (6, 10), 2   # olhos subidos meia célula

def olho(cx, rise):
    return f'<path d="M{cx-W/2} {BY}Q{cx} {BY-rise} {cx+W/2} {BY}" fill="none" stroke="black" stroke-width="1" stroke-linecap="round"/>'
def barras(alturas, passo, larg, cy=11.5):
    n = len(alturas); x0 = 8 - passo*(n-1)/2
    return ''.join(f'<rect x="{x0+i*passo-larg/2}" y="{cy-h/2}" width="{larg}" height="{h}" rx="{larg/2}" fill="black"/>' for i, h in enumerate(alturas))

# (nome, curva dos olhos, alturas das barras, passo, largura)
VAR = [
 ('1', 'três barras, as do original', .8, [2, 3, 2], 2, 1),
 ('2', 'três barras menores', .8, [1.5, 2.5, 1.5], 2, 1),
 ('3', 'cinco barras, subindo e descendo', .8, [1.5, 2.5, 3, 2.5, 1.5], 1.5, 1),
 ('4', 'cinco barras finas', .8, [1, 2, 3, 2, 1], 1, .5),
 ('5', 'quatro barras, ritmo de fala', .8, [2, 3, 2.5, 1.5], 1.5, 1),
 ('6', 'sete barras finas', .8, [1, 1.5, 2, 3, 2, 1.5, 1], 1, .5),
 ('7', 'três barras, olhos quase retos', .45, [2, 3, 2], 2, 1),
 ('8', 'cinco barras, olhos quase retos', .45, [1.5, 2.5, 3, 2.5, 1.5], 1.5, 1),
]

def furos(v):
    _, _, rise, alt, passo, larg = v
    return olho(EX[0], rise) + olho(EX[1], rise) + barras(alt, passo, larg)
def malha():
    fina = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(17)); forte = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(0, 17, 2))
    return f'<g class="malha"><g stroke="#18a0fb" stroke-width=".05" fill="none" opacity=".4">{fina}</g><g stroke="#18a0fb" stroke-width=".07" fill="none" opacity=".7">{forte}</g></g>'
def simbolo(v, uid):
    return f'<defs><mask id="m-{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{furos(v)}</mask></defs><g fill="currentColor" mask="url(#m-{uid})">{MASSA}</g>'

for v in VAR:
    (base/'svg-c'/f'C{v[0]}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="{16*S}" height="{16*S}" fill="currentColor" role="img" aria-label="TekaFlow C{v[0]}">{simbolo(v, "c"+v[0])}</svg>')

cel = ''.join(f'<figure><div class="sim"><svg viewBox="0 0 16 16" fill="currentColor">{simbolo(v, "g"+v[0])}{malha()}</svg></div><figcaption><b>C{v[0]}</b> {v[1]}</figcaption></figure>' for v in VAR)
def mini(v): return ''.join(f'<span><svg viewBox="2 2 12 12" width="{px}" height="{px}">{simbolo(v, f"t{px}{v[0]}")}</svg></span>' for px in (16, 32, 64))
testes = ''.join(f'<div class="t"><b>C{v[0]}</b>{mini(v)}</div>' for v in VAR)
ap = lambda v, f, t: f'<figure class="ap" style="background:{f};color:{t}"><svg viewBox="2 2 12 12">{simbolo(v, "ap"+v[0]+f[1:])}</svg><figcaption>C{v[0]}</figcaption></figure>'
apps = ''.join(ap(v, f, t) for v in VAR[:4] for f, t in (('#171614', '#f1efe9'), ('#c5ef6b', '#161a0c')))

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, oito variações do C</title>
<style>
:root{{--fundo:#fff;--tinta:#161616;--linha:#e4e4e4}}
*{{box-sizing:border-box}}
body{{margin:0;padding:32px 16px 64px;background:var(--fundo);color:var(--tinta);font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1100px;margin:0 auto}}
header{{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:24px}}
h1{{font-size:28px;margin:0 0 4px;letter-spacing:-.01em}} p.l{{margin:0;color:#555;max-width:66ch}}
button{{font:inherit;font-size:14px;border:1px solid var(--tinta);background:#fff;border-radius:999px;padding:8px 16px;cursor:pointer}}
button[aria-pressed=true]{{background:var(--tinta);color:#fff}}
h2{{font-size:18px;margin:40px 0 12px}}
.grade{{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--linha);border-radius:16px;overflow:hidden}}
.grade figure{{margin:-1px 0 0 -1px;border:1px solid var(--linha);padding:20px 12px 12px}}
.sim{{width:100%;max-width:220px;margin:0 auto;color:#000}} .sim svg{{width:100%;height:auto;display:block}}
figcaption{{font-size:13px;color:#555;margin-top:12px}}
.malha{{display:none}} body.m .malha{{display:block}}
.ap{{margin:0;border-radius:16px;padding:24px;border:1px solid var(--linha)}} .ap svg{{width:88px;height:88px;display:block}} .ap figcaption{{color:inherit;opacity:.7}}
.apps{{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px}}
.testes{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}}
.t{{border:1px solid var(--linha);border-radius:16px;padding:16px;display:flex;align-items:flex-end;gap:16px;color:#000}} .t b{{font-size:13px;color:#555;margin-right:auto;align-self:flex-start}} .t span{{display:block;line-height:0}}
@media(max-width:900px){{.grade{{grid-template-columns:repeat(2,1fr)}}}}
</style></head><body><main>
<header><div><h1>TekaFlow, oito variações do C</h1>
<p class="l">A cabeça de frente com olhos felizes. Os olhos subiram meia célula e a curva ficou mais leve. A boca agora é barra de voz, como nos estudos originais, em malha 16×16. As variações mexem no número de barras, na espessura e na curva dos olhos.</p></div>
<button id="b" aria-pressed="false">Mostrar a malha</button></header>
<div class="grade">{cel}</div>
<h2>Como ícone, em duas cores</h2><div class="apps">{apps}</div>
<h2>Teste de tamanho: 16, 32 e 64 pixels</h2><div class="testes">{testes}</div>
</main>
<script>const b=document.getElementById('b');b.onclick=()=>{{const on=document.body.classList.toggle('m');b.setAttribute('aria-pressed',on);b.textContent=on?'Esconder a malha':'Mostrar a malha'}}</script>
</body></html>'''
(base/'oito-variacoes-c.html').write_text(html); print('ok')
