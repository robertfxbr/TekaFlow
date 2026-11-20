import pathlib
base = pathlib.Path(__file__).parent
S = 30  # unidade da malha 8x8, como nos estudos do Zanuve

def P(pts): return '<polygon points="' + ' '.join(f'{x},{y}' for x, y in pts) + '"/>'
def R(x, y, w, h, rx): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>'
def C(cx, cy, r): return f'<circle cx="{cx}" cy="{cy}" r="{r}"/>'

# Massas: só retângulos, quartos de círculo, círculos e triângulos de pontas na malha.
BLOCO = '<path d="M1 3H7V5A2 2 0 0 1 5 7H3A2 2 0 0 1 1 5Z"/>'  # bloco 6x4, cantos de baixo = quarto de círculo r2
ORE_E = P([(1, 1), (3, 3), (1, 3)]);  ORE_D = P([(7, 1), (5, 3), (7, 3)])
massas = {
 '1': BLOCO + ORE_E + ORE_D,
 '2': BLOCO + ORE_E + P([(5, 3), (7, 3), (7, 2)]),   # orelha da direita deitada: escuta de lado
 '3': C(4, 4, 3) + P([(1, 1), (3, 3), (1.25, 3)]) + P([(7, 1), (5, 3), (6.75, 3)]),
}
# altura do rosto por silhueta: linha de base dos olhos e do centro da boca
dados = {'1': (4.5, 6.0), '2': (4.5, 6.0), '3': (4.25, 5.75)}

def arco(cx, by):  # olho feliz: meia-circunferência de 1 célula de diâmetro, traço de meia célula
    return f'<path d="M{cx-.5} {by}A.5 .5 0 0 1 {cx+.5} {by}" fill="none" stroke="black" stroke-width=".5"/>'
def barra(cx, y0, y1): return f'<rect x="{cx-.25}" y="{y0}" width=".5" height="{y1-y0}" rx=".25" fill="black"/>'

def rosto(b, v):
    by, my = dados[b]
    if v == 'A': return ''
    olhos = arco(3, by) + arco(5, by)
    if v == 'D': olhos = arco(3, by) + f'<circle cx="5" cy="{by-.5}" r=".5" fill="black"/>'
    if v == 'C':  # boca em sorriso feita de barras de voz: bordas mais altas, centro mais baixo
        boca = barra(2, my-.75, my) + barra(3, my-.5, my+.25) + barra(4, my-.25, my+.5) + barra(5, my-.5, my+.25) + barra(6, my-.75, my)
    else:         # boca em onda de voz: três barras, a do meio mais alta
        boca = barra(3, my-.375, my+.375) + barra(4, my-.625, my+.625) + barra(5, my-.375, my+.375)
    return olhos + boca

def malha():
    l = ''.join(f'<path d="M{i} 0V8M0 {i}H8"/>' for i in range(9))
    m = ''.join(f'<path d="M{i+.5} 0V8M0 {i+.5}H8"/>' for i in range(8))
    return f'<g class="malha"><g stroke="#18a0fb" stroke-width=".04" fill="none" opacity=".35">{m}</g><g stroke="#18a0fb" stroke-width=".05" fill="none">{l}</g></g>'

def simbolo(b, v, uid):
    mask = f'<defs><mask id="m-{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="8"><rect width="8" height="8" fill="white"/>{rosto(b, v)}</mask></defs>'
    return f'{mask}<g fill="currentColor" mask="url(#m-{uid})">{massas[b]}</g>'

ids = [f'{b}{v}' for v in 'ABCD' for b in '123']
for i in ids:
    (base/'svg-grid'/f'{i}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="{8*S}" height="{8*S}" fill="currentColor" role="img" aria-label="TekaFlow {i}">{simbolo(i[0], i[1], i)}</svg>')

nomes = {'1': 'Bloco de frente', '2': 'Orelha deitada', '3': 'Círculo'}
vars_ = {'A': 'só a silhueta', 'B': 'olhos felizes e boca em onda de voz', 'C': 'olhos felizes e sorriso de ondas', 'D': 'piscadinha e boca em onda'}
cel = ''.join(f'<figure><div class="sim"><svg viewBox="0 0 8 8" fill="currentColor">{simbolo(i[0], i[1], "g"+i)}{malha()}</svg></div><figcaption><b>{i}</b> {nomes[i[0]]}, {vars_[i[1]]}</figcaption></figure>' for i in ids)

def mini(i): return ''.join(f'<span><svg viewBox="1 1 6 6" width="{px}" height="{px}">{simbolo(i[0], i[1], f"t{px}{i}")}</svg></span>' for px in (16, 32, 64))
testes = ''.join(f'<div class="t"><b>{i}</b>{mini(i)}</div>' for i in ('1B', '2B', '3B', '1C', '2C', '3C'))
ap = lambda i, f, t: f'<figure class="ap" style="background:{f};color:{t}"><svg viewBox="1 1 6 6">{simbolo(i[0], i[1], "ap"+i+f[1:])}</svg><figcaption>{i}</figcaption></figure>'
apps = ''.join(ap(i, f, t) for i in ('1B', '2B', '3B') for f, t in (('#171614', '#f1efe9'), ('#c5ef6b', '#161a0c')))

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, símbolo na malha</title>
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
.grade{{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--linha);border-radius:16px;overflow:hidden}}
.grade figure{{margin:-1px 0 0 -1px;border:1px solid var(--linha);padding:24px 16px 12px}}
.sim{{width:100%;max-width:240px;margin:0 auto;color:#000}} .sim svg{{width:100%;height:auto;display:block}}
figcaption{{font-size:13px;color:#555;margin-top:12px}}
.malha{{display:none}} body.m .malha{{display:block}}
.ap{{margin:0;border-radius:16px;padding:28px;border:1px solid var(--linha)}} .ap svg{{width:96px;height:96px;display:block}} .ap figcaption{{color:inherit;opacity:.7}}
.apps{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}}
.testes{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}}
.t{{border:1px solid var(--linha);border-radius:16px;padding:16px;display:flex;align-items:flex-end;gap:16px;color:#000}} .t b{{font-size:13px;color:#555;margin-right:auto;align-self:flex-start}} .t span{{display:block;line-height:0}}
@media(max-width:760px){{.grade{{grid-template-columns:1fr}}}}
</style></head><body><main>
<header><div><h1>TekaFlow, símbolo na malha 8×8</h1>
<p class="l">Tudo apoiado nas linhas da malha: blocos, quartos de círculo, círculos e triângulos de 2×2 células. Olhos são meia-circunferência de uma célula, e a boca é feita de barras de meia célula, como uma onda de voz. As fontes ficam para depois.</p></div>
<button id="b" aria-pressed="false">Mostrar a malha</button></header>
<div class="grade">{cel}</div>
<h2>Como ícone, em duas cores</h2><div class="apps">{apps}</div>
<h2>Teste de tamanho: 16, 32 e 64 pixels</h2><div class="testes">{testes}</div>
</main>
<script>const b=document.getElementById('b');b.onclick=()=>{{const on=document.body.classList.toggle('m');b.setAttribute('aria-pressed',on);b.textContent=on?'Esconder a malha':'Mostrar a malha'}}</script>
</body></html>'''
(base/'simbolo-grid.html').write_text(html); print('ok')
