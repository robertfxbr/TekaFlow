"""Variações do rosto do ícone, em pixels reais. Rode da pasta marca/: python3 _construcao/teste-rosto.py"""
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
LIM, GRAF, VERDE, BR = '#C5EF6B', '#1A1B1E', '#5C7F10', '#FFFFFF'
DY = 0.25

# cada variante: traço único (olhos = boca), olhos (cx esq, cx dir, y, largura, curva), barras (x, altura, deslocamento y)
V = [
 ('A · Atual', 'Referência: traço 0,65, olhos em 6,2 e 9,8.',
  dict(sw=.65, ex=(6.2,9.8), ey=8.0, ew=1.6, ec=.8, tilt=0, bars=[(7,1.1,0),(8,2.0,0),(9,1.1,0)])),
 ('B · Traço fino, olhos soltos', 'Traço 0,55 igual nos olhos e na boca. Olhos 0,4 mais altos e 0,4 mais afastados.',
  dict(sw=.55, ex=(6.0,10.0), ey=7.6, ew=1.6, ec=.8, tilt=0, bars=[(7,1.1,0),(8,2.0,0),(9,1.1,0)])),
 ('C · Mais ar entre as partes', 'Traço 0,55. Olhos ainda mais altos, barras da boca mais abertas entre si.',
  dict(sw=.55, ex=(5.9,10.1), ey=7.4, ew=1.6, ec=.8, tilt=0, bars=[(6.85,1.0,0),(8,1.9,0),(9.15,1.0,0)])),
 ('D · Orgânico, boca de onda', 'Traço 0,55. Barras com alturas diferentes, como voz de verdade, e olhos levemente caídos para fora.',
  dict(sw=.55, ex=(5.95,10.05), ey=7.5, ew=1.6, ec=.8, tilt=.12, bars=[(6.85,1.0,.1),(7.95,2.1,-.05),(9.05,1.4,.05)])),
 ('E · Orgânico, traço mais fino', 'Traço 0,5. Olhos um pouco menores e inclinados, boca mais baixa e solta.',
  dict(sw=.5, ex=(6.0,10.0), ey=7.5, ew=1.5, ec=.7, tilt=.15, bars=[(6.9,1.2,.2),(8,2.2,.05),(9.1,1.5,.15)])),
]
n=[0]
def rosto(p,c):
    s=p['sw']; out=''
    for i,cx in enumerate(p['ex']):
        t = p['tilt']*(-1 if i==0 else 1)   # olho esquerdo sobe para fora, direito também
        x0,x1=cx-p['ew']/2,cx+p['ew']/2; y=p['ey']
        out+=f'<path d="M{x0:.2f} {y+t:.2f}Q{cx} {y-p["ec"]:.2f} {x1:.2f} {y-t:.2f}" fill="none" stroke="{c}" stroke-width="{s}" stroke-linecap="round"/>'
    for x,h,dy in p['bars']:
        out+=f'<rect x="{x-s/2:.3f}" y="{10-h/2+dy:.3f}" width="{s}" height="{h}" rx="{s/2}" fill="{c}"/>'
    return out
def icone(p,tile,det,cabeca,px):
    n[0]+=1;u=f'm{n[0]}'
    if cabeca is None:
        corpo=(f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#fff"/>'
               f'<path transform="translate(0 {DY})" d="{H}" fill="#000" stroke="#000" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
               f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#{u})"/><g transform="translate(0 {DY})">{rosto(p,det)}</g>')
    else:
        corpo=(f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/><g transform="translate(0 {DY})">'
               f'<path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{rosto(p,det)}</g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 14 14" width="{px}" height="{px}">{corpo}</svg>'
SIZES=[160,96,64,48,40,32,24,20,16]
def tira(p,tile,det,cabeca,bg):
    cells=''.join(f'<div class="c">{icone(p,tile,det,cabeca,s)}<span>{s}</span></div>' for s in SIZES)
    return f'<div class="strip" style="background:{bg}">{cells}</div>'

B = dict(sw=.55, ex=(6.0,10.0), ey=7.6, ew=1.6, ec=.8, tilt=0, bars=[(7,1.1,0),(8,2.0,0),(9,1.1,0)])
def com_sw(p,d): q=dict(p); q['sw']=round(p['sw']+d,3); return q
def gato(p,cor,px):
    n[0]+=1;u=f'g{n[0]}'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 2.9 10 10" width="{px}" height="{px}"><defs>'
            f'<mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/>{rosto(p,"#000")}</g></mask></defs>'
            f'<rect x="0" y="0" width="16" height="16" fill="{cor}" mask="url(#{u})"/></svg>')
def tira_gato(p,cor,bg):
    cells=''.join(f'<div class="c">{gato(p,cor,s)}<span>{s}</span></div>' for s in SIZES)
    return f'<div class="strip" style="background:{bg}">{cells}</div>'
def sec(t,d,corpo): return f'<section><h2>{t}</h2><p>{d}</p>{corpo}</section>'
rows = sec('1 · Ícone com quadrado','Fundo claro com o traço principal (0,55). Fundo escuro 0,05 mais fino (0,50), porque letra clara sobre escuro parece mais grossa.',
   '<div class="duo">'+tira(B,LIM,LIM,None,GRAF).replace('class="strip"','class="strip"')+tira(B,VERDE,VERDE,BR,"#FFFFFF")+'</div>')
# o escuro usa traço 0,50
rows = sec('1 · Ícone com quadrado','Escuro com traço 0,50 e claro com o traço principal, 0,55. Letra clara sobre fundo escuro parece mais grossa, por isso a diferença.',
   '<div class="duo">'+tira(com_sw(B,-.05),LIM,LIM,None,GRAF)+tira(B,VERDE,VERDE,BR,"#FFFFFF")+'</div>')
rows += sec('2 · Só o gato, sem o quadrado','A silhueta preenchida e o rosto vazado. Traço 0,55 nos três fundos.',
   '<div class="duo">'+tira_gato(B,LIM,GRAF)+tira_gato(B,GRAF,"#FFFFFF")+'</div><div class="duo" style="margin-top:12px">'+tira_gato(B,GRAF,LIM)+tira_gato(B,VERDE,"#FFFFFF")+'</div>')

# --- gato sem quadrado ao lado da palavra (palavra em contornos vinda de logo/palavra-grafite.svg) ---
import re
_w = open('logo/palavra-grafite.svg').read()
_vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', _w).group(1).split()]
D_PAL = re.search(r' d="([^"]+)"', _w).group(1)
TX0, TY0, TX1, TY1 = _vb[0]+2, _vb[1]+2, _vb[0]+_vb[2]-2, _vb[1]+_vb[3]-2
CAP = 67.3; SEC = CAP/2; SYM = 4*SEC; GAP = SEC
def logo_gato(p, cor_gato, cor_txt, altura):
    n[0]+=1; u=f'h{n[0]}'
    base = 100.0; centro = base-CAP/2; topo = centro-SYM/2
    esc = SYM/9.0                      # a cabeça, com orelhas, ocupa 9 unidades de altura
    px = SYM*8.5/9.0 + GAP             # largura do gato (8,5 unidades) mais 1 seção
    vy0 = min(topo, base+TY0); vy1 = max(topo+SYM, base+TY1); vx1 = px+TX1
    h = vy1-vy0; w = vx1
    gato_g = (f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/>'
              f'<g transform="translate(0 {DY})"><path d="{H}" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/>{rosto(p,"#000")}</g></mask></defs>'
              f'<rect width="16" height="16" fill="{cor_gato}" mask="url(#{u})"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {vy0:.2f} {w:.2f} {h:.2f}" height="{altura}" width="{altura*w/h:.1f}">'
            f'<g transform="translate({-3.75*esc:.3f} {topo-3.5*esc:.3f}) scale({esc:.4f})">{gato_g}</g>'
            f'<path transform="translate({px:.3f} {base})" d="{D_PAL}" fill="{cor_txt}"/></svg>')
ALTS=[96,56,36,24,16]
def tira_logo(p, cg, ct, bg):
    cells=''.join(f'<div class="c">{logo_gato(p,cg,ct,a)}<span>{a} px</span></div>' for a in ALTS)
    return f'<div class="strip" style="background:{bg}">{cells}</div>'
rows += sec('3 · Gato sem quadrado, com a palavra','Gato e palavra a 1 seção de distância, centrados nas maiúsculas. Alturas de 96 a 16 px.',
   '<div class="uno">'+tira_logo(B,LIM,BR,GRAF)+tira_logo(B,VERDE,GRAF,"#FFFFFF")+tira_logo(B,GRAF,GRAF,LIM)+tira_logo(B,GRAF,GRAF,"#FFFFFF")+'</div>')
html=f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Teste de rosto</title><style>
:root{{--bg:#ECEEE8;--tx:#1A1B1E;--mu:#666;}}
body{{margin:0;background:var(--bg);color:var(--tx);font:14px/1.5 -apple-system,system-ui,sans-serif;padding:32px 40px 60px}}
h1{{font-size:22px;margin:0 0 4px}} .l{{color:var(--mu);margin:0 0 24px;max-width:760px}}
section{{margin:0 0 28px}} h2{{font-size:15px;margin:0}} section>p{{margin:2px 0 8px;color:var(--mu);font-size:13px}}
.uno{{display:grid;gap:12px}} .uno .strip{{gap:36px;align-items:center}}
.duo{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
.strip{{display:flex;align-items:flex-end;gap:18px;padding:18px 20px;border-radius:14px;overflow:hidden}}
.c{{display:flex;flex-direction:column;align-items:center;gap:6px}} .c span{{font-size:10px;color:#888}}
@media(max-width:1100px){{.uno{{display:grid;gap:12px}} .uno .strip{{gap:36px;align-items:center}}
.duo{{grid-template-columns:1fr}}}}
</style></head><body><h1>Rosto do ícone, em pixels reais</h1>
<p class="l">Rosto da variante B (olhos mais altos e afastados, boca e olhos no mesmo traço). De 160 a 16 px, em pixels reais.</p>
{rows}</body></html>'''
open('teste-rosto.html','w').write(html)

# --- página própria: só o gato com a palavra, sem o quadrado, em tamanho grande ---
def faixa(cg, ct, bg, rotulo, alt=150):
    return f'<div class="gr" style="background:{bg}">{logo_gato(B,cg,ct,alt)}<span style="color:{ct}">{rotulo}</span></div>'
big = (faixa(LIM,BR,GRAF,'Fundo escuro') + faixa(VERDE,GRAF,'#FFFFFF','Fundo claro') + faixa(GRAF,GRAF,LIM,'Fundo limão') + faixa(GRAF,GRAF,'#FFFFFF','Uma cor'))
html2=f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Gato sem quadrado</title><style>
body{{margin:0;background:#ECEEE8;color:#1A1B1E;font:14px/1.5 -apple-system,system-ui,sans-serif;padding:32px 40px 60px}}
h1{{font-size:22px;margin:0 0 20px}}
.gr{{position:relative;display:flex;align-items:center;justify-content:center;padding:64px 40px;border-radius:16px;margin-bottom:14px}}
.gr span{{position:absolute;left:20px;top:14px;font-size:12px;opacity:.6}}
</style></head><body><h1>Só o gato, com a palavra, sem o quadrado</h1>{big}</body></html>"""
open('gato-sem-quadrado.html','w').write(html2)
