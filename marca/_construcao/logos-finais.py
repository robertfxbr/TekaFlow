"""Logos finais em teste: olhos Contente, boca 'não falando' maior, orelhinhas. Rode da pasta marca/: python3 _construcao/logos-finais.py"""
import sys; sys.path.insert(0, "_construcao")
from gato import *

def orelha_traco(c):   # risquinho que marca o limite interno de cada orelha
    return (f'<path d="M4.95 5.75L5.2 4.75L6.3 5.35" {st(c,.42)}/><path d="M11.05 5.75L10.8 4.75L9.7 5.35" {st(c,.42)}/>')
def orelha_triangulo(c):   # triângulo pequeno dentro da orelha, como no estudo original
    return (f'<path d="M4.95 5.8L5.05 4.8L6.15 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>'
            f'<path d="M11.05 5.8L10.95 4.8L9.85 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>')
OREL = [('Risquinho', orelha_traco), ('Triângulo', orelha_triangulo)]
BOC = [('Boca 1', 'Barras 1,0 / 1,7 / 1,0', (1.0,1.7,1.0)), ('Boca 2', 'Barras 1,1 / 1,8 / 1,1', (1.1,1.8,1.1)), ('Boca 3', 'Barras 1,0 / 1,9 / 1,2, um pouco solta', (1.0,1.9,1.2))]
def face(hs, orel):
    return lambda c: cima(EX[0],EY,c)+cima(EX[1],EY,c)+barras(hs,c,(0,0,0) if hs[2]==hs[0] else (0,0,.05))+orel(c)

def logo_quadrado(face_fn, tl, det, cab, ct, altura):
    base=100.0; topo=base-CAP/2-SYM/2; esc=SYM/14.0; px=SYM+GAP
    vy0=min(topo,base+TY0); vy1=max(topo+SYM,base+TY1); w=px+TX1; h=vy1-vy0
    n[0]+=1; u=f'q{n[0]}'
    if cab is None:
        corpo=(f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#fff"/>'
               f'<path transform="translate(0 {DY})" d="{H}" fill="#000" stroke="#000" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
               f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tl}" mask="url(#{u})"/><g transform="translate(0 {DY})">{face_fn(det)}</g>')
    else:
        corpo=(f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tl}"/><g transform="translate(0 {DY})">'
               f'<path d="{H}" fill="{cab}" stroke="{cab}" stroke-width=".5" stroke-linejoin="round"/>{face_fn(det)}</g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {vy0:.2f} {w:.2f} {h:.2f}" height="{altura}" width="{altura*w/h:.1f}">'
            f'<g transform="translate(0 {topo:.3f}) scale({esc:.5f}) translate(-1 -1)">{corpo}</g>'
            f'<path transform="translate({px:.3f} {base})" d="{D_PAL}" fill="{ct}"/></svg>')

CORES = {True:(LIM,LIM,None,LIM,BR), False:(VERDE,VERDE,BR,VERDE,GRAF)}
def par(f, escuro, h=52, ic=72):
    tl,det,cab,cg,ct = CORES[escuro]
    return (f'<div class="{"d" if escuro else "l"} cel">{logo_quadrado(f,tl,det,cab,ct,h)}{logo(f,cg,ct,h)}'
            f'<span class="ics">{tile(f,tl,det,cab,ic)}{gato(f,cg,ic)}</span></div>')
SIZES=[96,64,48,40,32,24,20,16]
def escala(f, escuro):
    tl,det,cab,cg,ct = CORES[escuro]
    a=''.join(f'<div class="u">{tile(f,tl,det,cab,s)}<i>{s}</i></div>' for s in SIZES)
    b=''.join(f'<div class="u">{gato(f,cg,s)}<i>{s}</i></div>' for s in SIZES)
    return f'<div class="{"d" if escuro else "l"} esc"><div class="lin">{a}</div><div class="lin">{b}</div></div>'

corpo=''
for bn,bd,hs in BOC:
    corpo+=f'<h2>{bn}</h2><p class="sub">{bd}</p><div class="duo">'
    for on,of in OREL:
        f=face(hs,of)
        corpo+=f'<div><h3>Orelha: {on}</h3>{par(f,True)}{par(f,False)}</div>'
    corpo+='</div>'
corpo+='<h2>Escala em pixels reais</h2><p class="sub">Boca 1 com o risquinho. Primeira linha a marca quadrada, segunda o gato sem o quadrado.</p>'
f0=face(BOC[0][2],orelha_traco); corpo+=escala(f0,True)+escala(f0,False)
corpo+='<p class="sub" style="margin-top:14px">Mesma escala com o triângulo:</p>'
f1=face(BOC[0][2],orelha_triangulo); corpo+=escala(f1,True)+escala(f1,False)
html=f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Logos finais em teste</title><style>
body{{margin:0;background:#ECEEE8;color:#1A1B1E;font:14px/1.5 -apple-system,system-ui,sans-serif;padding:32px 40px 60px}}
h1{{font-size:22px;margin:0 0 4px}} h2{{font-size:17px;margin:30px 0 0}} h3{{font-size:12px;margin:10px 0 6px;color:#666;font-weight:600}} .sub{{margin:0 0 6px;color:#666;font-size:13px}} .l0{{color:#666;margin:0 0 14px;max-width:820px}}
.bar{{display:flex;gap:8px;margin-bottom:8px}} .bar button{{font:inherit;padding:6px 14px;border-radius:999px;border:1px solid #bbb;background:#fff;cursor:pointer}} .bar button.on{{background:#1A1B1E;color:#fff;border-color:#1A1B1E}}
.duo{{display:grid;grid-template-columns:1fr 1fr;gap:16px}}
.cel{{display:flex;align-items:center;gap:26px;padding:22px 24px;border-radius:14px;flex-wrap:wrap}} .ics{{display:flex;gap:12px;margin-left:auto}}
.d.cel,.d.esc{{background:#1A1B1E}} .l.cel,.l.esc{{background:#fff}}
.esc{{border-radius:14px;padding:14px 24px;margin-bottom:10px}} .lin{{display:flex;gap:22px;align-items:flex-end;margin:6px 0}} .u{{display:flex;flex-direction:column;align-items:center;gap:4px}} .u i{{font:10px/1 sans-serif;color:#888;font-style:normal}}
body.claro .d{{display:none}} body:not(.claro) .l{{display:none}}
</style></head><body><h1>Logos finais em teste</h1>
<p class="l0">Olhos Contente, boca de “não falando” um pouco maior e as orelhinhas de volta, em dois estilos: um risquinho e um triângulo pequeno. Três tamanhos de boca. Cada quadro tem a marca quadrada, o gato sem o quadrado e os dois ícones.</p>
<div class="bar"><button class="on" onclick="m(0,this)">Fundo escuro</button><button onclick="m(1,this)">Fundo claro</button></div>
{corpo}
<script>function m(c,b){{document.body.classList.toggle('claro',!!c);document.querySelectorAll('.bar button').forEach(x=>x.classList.remove('on'));b.classList.add('on')}}</script></body></html>"""
open('logos-finais-teste.html','w').write(html)
