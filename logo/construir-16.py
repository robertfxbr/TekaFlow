import pathlib
base = pathlib.Path(__file__).parent
S = 15  # unidade da malha 16x16 (cada célula antiga de 8x8 vira 2x2)

def P(pts, w=1):  # triângulo com ponta suavizada, traço de 1 célula
    p = ' '.join(f'{x},{y}' for x, y in pts)
    return f'<polygon points="{p}" stroke="currentColor" stroke-width="{w}" stroke-linejoin="round"/>'
def R(x, y, w, h, rx): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>'

# Mesmas silhuetas dos primeiros estudos, agora em 16x16
CABECA = R(2, 5, 12, 9, 4)
massas = {
 '1': CABECA + P([(3, 7), (3, 3), (7, 5)]) + P([(13, 7), (13, 3), (9, 5)]),
 '2': CABECA + P([(3, 7), (3, 3), (7, 5)]) + P([(10, 5), (14, 3), (13, 7)]),
 '3': R(2, 8, 12, 6, 3) + R(2, 4, 6, 5, 2) + P([(3, 6), (3, 2), (5, 4)]) + P([(7, 6), (7, 2), (5, 4)]),
}
# base dos olhos, centro dos olhos, centro da boca por silhueta
rosto = {'1': dict(ex=(6, 10), by=9, w=2, rise=1.2, sw=1, bx=8, by2=12), '2': dict(ex=(6, 10), by=9, w=2, rise=1.2, sw=1, bx=8, by2=12),
         '3': dict(ex=(3.7, 6.3), by=7, w=1.2, rise=.7, sw=.8, bx=10, by2=11)}

def olho_feliz(cx, r):  # curva leve para cima
    w, by, k, sw = r['w'], r['by'], r['rise'], r['sw']
    return f'<path d="M{cx-w/2} {by}Q{cx} {by-k} {cx+w/2} {by}" fill="none" stroke="black" stroke-width="{sw}" stroke-linecap="round"/>'
def olho_reto(cx, r):   # o olho meio fechado dos estudos originais
    w, by, sw = r['w'], r['by'], r['sw']
    return f'<rect x="{cx-w/2-sw/2}" y="{by-sw/2}" width="{w+sw}" height="{sw}" rx="{sw/2}" fill="black"/>'
def barra(cx, h, cy): return f'<rect x="{cx-.5}" y="{cy-h/2}" width="1" height="{h}" rx=".5" fill="black"/>'

def furos(b, v):
    r = rosto[b]; e1, e2 = r['ex']
    boca = barra(r['bx']-2, 1, r['by2']) + barra(r['bx'], 2, r['by2']) + barra(r['bx']+2, 1, r['by2'])
    if v == 'A': return ''
    if v == 'B': return olho_reto(e1, r) + olho_reto(e2, r) + boca
    if v == 'C': return olho_feliz(e1, r) + olho_feliz(e2, r) + boca
    if v == 'D': return olho_feliz(e1, r) + olho_feliz(e2, r)

def malha():
    fina = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(17))
    forte = ''.join(f'<path d="M{i} 0V16M0 {i}H16"/>' for i in range(0, 17, 2))
    return f'<g class="malha"><g stroke="#18a0fb" stroke-width=".05" fill="none" opacity=".4">{fina}</g><g stroke="#18a0fb" stroke-width=".07" fill="none" opacity=".7">{forte}</g></g>'

def simbolo(b, v, uid):
    mask = f'<defs><mask id="m-{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>{furos(b, v)}</mask></defs>'
    return f'{mask}<g fill="currentColor" mask="url(#m-{uid})">{massas[b]}</g>'

ids = [f'{b}{v}' for v in 'ABCD' for b in '123']
for i in ids:
    (base/'svg-16'/f'{i}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="{16*S}" height="{16*S}" fill="currentColor" role="img" aria-label="TekaFlow {i}">{simbolo(i[0], i[1], i)}</svg>')

nomes = {'1': 'Cabeça de frente', '2': 'Orelha virada', '3': 'Gato enrolado'}
vars_ = {'A': 'só a silhueta', 'B': 'olhos meio fechados e boca pequena', 'C': 'olhos levemente felizes e boca pequena', 'D': 'olhos levemente felizes, sem boca'}
cel = ''.join(f'<figure><div class="sim"><svg viewBox="0 0 16 16" fill="currentColor">{simbolo(i[0], i[1], "g"+i)}{malha()}</svg></div><figcaption><b>{i}</b> {nomes[i[0]]}, {vars_[i[1]]}</figcaption></figure>' for i in ids)
def mini(i): return ''.join(f'<span><svg viewBox="2 2 12 12" width="{px}" height="{px}">{simbolo(i[0], i[1], f"t{px}{i}")}</svg></span>' for px in (16, 32, 64))
testes = ''.join(f'<div class="t"><b>{i}</b>{mini(i)}</div>' for i in ('1B', '2B', '3B', '1C', '2C', '3C'))
ap = lambda i, f, t: f'<figure class="ap" style="background:{f};color:{t}"><svg viewBox="2 2 12 12">{simbolo(i[0], i[1], "ap"+i+f[1:])}</svg><figcaption>{i}</figcaption></figure>'
apps = ''.join(ap(i, f, t) for i in ('1C', '2C', '3C') for f, t in (('#171614', '#f1efe9'), ('#c5ef6b', '#161a0c')))

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, símbolo na malha 16</title>
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
<header><div><h1>TekaFlow, símbolo na malha 16×16</h1>
<p class="l">Voltei às cabeças dos primeiros estudos e passei para uma malha 16×16, com cada célula antiga dividida em quatro. Olhos felizes só com uma curva leve e boca pequena em onda de voz. As fontes ficam para depois.</p></div>
<button id="b" aria-pressed="false">Mostrar a malha</button></header>
<div class="grade">{cel}</div>
<h2>Como ícone, em duas cores</h2><div class="apps">{apps}</div>
<h2>Teste de tamanho: 16, 32 e 64 pixels</h2><div class="testes">{testes}</div>
</main>
<script>const b=document.getElementById('b');b.onclick=()=>{{const on=document.body.classList.toggle('m');b.setAttribute('aria-pressed',on);b.textContent=on?'Esconder a malha':'Mostrar a malha'}}</script>
</body></html>'''
(base/'simbolo-16.html').write_text(html); print('ok')
