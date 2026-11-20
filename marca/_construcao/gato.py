"""Peças comuns do gato (olhos, bocas, máscaras, palavra). Expressões do gato só com os olhos, sem boca (repertório inspirado nos moods do projeto do César).
Rode da pasta marca/: python3 _construcao/expressoes.py"""
import re, math
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
LIM, GRAF, VERDE, BR = '#C5EF6B', '#1A1B1E', '#5C7F10', '#FFFFFF'
DY, SW = 0.25, 0.55
EX = (6.0, 10.0); EY = 8.6
def st(c, w=SW): return f'fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'
def oval(cx, y, c, dx=0, dy=0, w=.75, h=1.7): return f'<rect x="{cx+dx-w/2:.3f}" y="{y+dy-h/2:.3f}" width="{w}" height="{h}" rx="{w/2}" fill="{c}"/>'
def cima(cx, y, c): return f'<path d="M{cx-.8:.2f} {y+.3:.2f}Q{cx} {y-.9:.2f} {cx+.8:.2f} {y+.3:.2f}" {st(c)}/>'
def baixo(cx, y, c): return f'<path d="M{cx-.8:.2f} {y-.3:.2f}Q{cx} {y+.9:.2f} {cx+.8:.2f} {y-.3:.2f}" {st(c)}/>'
def traco(cx, y, c): return f'<path d="M{cx-.8:.2f} {y} H{cx+.8:.2f}" {st(c)}/>'
def ponto(cx, y, c): return f'<circle cx="{cx}" cy="{y}" r=".62" fill="{c}"/>'
def meio(cx, y, c): return f'<path d="M{cx-.85:.2f} {y-.15:.2f}H{cx+.85:.2f}A.85 .85 0 0 1 {cx-.85:.2f} {y-.15:.2f}Z" fill="{c}" stroke="{c}" stroke-width=".3" stroke-linejoin="round"/>'
def xis(cx, y, c): return f'<path d="M{cx-.6:.2f} {y-.6:.2f}L{cx+.6:.2f} {y+.6:.2f}M{cx+.6:.2f} {y-.6:.2f}L{cx-.6:.2f} {y+.6:.2f}" {st(c)}/>'
def espiral(cx, y, c):
    pts=[]; 
    for i in range(0,61):
        t=i/60; a=t*2*math.pi*2.1; r=.12+.78*t
        pts.append((cx+r*math.cos(a), y+r*math.sin(a)))
    return '<path d="M'+' L'.join(f'{a:.2f} {b:.2f}' for a,b in pts)+f'" {st(c,.3)}/>'
def sobrancelha(cx, y, c, lado):
    # ponta de dentro mais baixa
    x0, x1 = (cx-.85, cx+.55) if lado<0 else (cx+.85, cx-.55)
    return f'<path d="M{x0:.2f} {y-1.55:.2f}L{x1:.2f} {y-1.0:.2f}" {st(c)}/>'

EY = 7.7
OLHOS = [
 ('Contente',    'Arcos para cima. É o olho que já temos.',        lambda c: cima(EX[0],EY,c)+cima(EX[1],EY,c)),
 ('Entreaberto', 'Meia pálpebra: “ouvindo, aos poucos”.',          lambda c: meio(EX[0],EY,c)+meio(EX[1],EY,c)),
 ('Relax',       'Arcos para baixo, tranquilo.',                    lambda c: baixo(EX[0],EY-.1,c)+baixo(EX[1],EY-.1,c)),
 ('Piscando',    'Um arco e um olho aberto.',                       lambda c: cima(EX[0],EY,c)+oval(EX[1],EY,c,0,0,.6,1.5)),
 ('Aberto',      'Olhos em pé, atentos.',                           lambda c: oval(EX[0],EY,c,0,0,.6,1.5)+oval(EX[1],EY,c,0,0,.6,1.5)),
 ('Curioso',     'Olhando de lado, para cima.',                     lambda c: oval(EX[0],EY,c,.35,-.25,.6,1.5)+oval(EX[1],EY,c,.35,-.25,.6,1.5)),
 ('Fechado',     'Dois traços, de olhos fechados.',                 lambda c: traco(EX[0],EY,c)+traco(EX[1],EY,c)),
]
def barras(hs, c, dys=(0,0,0)):
    return ''.join(f'<rect x="{x-SW/2:.3f}" y="{10-h/2+dy:.3f}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>' for x,h,dy in zip((7,8,9),hs,dys))
BOCAS = [
 ('Falando',      'Barra do meio alta, as laterais curtas.',  lambda c: barras((1.1,2.0,1.1),c)),
 ('Animado',      'Falando mais forte, alturas diferentes.',   lambda c: barras((1.5,2.5,1.7),c,(.05,0,.1))),
 ('Não falando',  'Três barras baixas, quase iguais.',         lambda c: barras((.9,1.1,.9),c)),
 ('Quieta',       'Três pontos.',                              lambda c: barras((SW,SW,SW),c)),
 ('Sem boca',     'Só os olhos.',                              lambda c: ''),
]
n=[0]
def tile(face, tile_c, det, cabeca, px):
    n[0]+=1; u=f'm{n[0]}'
    if cabeca is None:
        corpo=(f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#fff"/>'
               f'<path transform="translate(0 {DY})" d="{H}" fill="#000" stroke="#000" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
               f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile_c}" mask="url(#{u})"/><g transform="translate(0 {DY})">{face(det)}</g>')
    else:
        corpo=(f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile_c}"/><g transform="translate(0 {DY})">'
               f'<path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{face(det)}</g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 14 14" width="{px}" height="{px}">{corpo}</svg>'
def gato_g(face, cor):
    n[0]+=1; u=f'g{n[0]}'
    return (f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/>{face("#000")}</g></mask></defs>'
            f'<rect width="16" height="16" fill="{cor}" mask="url(#{u})"/>')
def gato(face, cor, px):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 2.9 10 10" width="{px}" height="{px}">{gato_g(face,cor)}</svg>'
_w = open('logo/palavra-grafite.svg').read()
_vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', _w).group(1).split()]
D_PAL = re.search(r' d="([^"]+)"', _w).group(1)
TY0, TX1, TY1 = _vb[1]+2, _vb[0]+_vb[2]-2, _vb[1]+_vb[3]-2
CAP=67.3; SEC=CAP/2; SYM=4*SEC; GAP=SEC
def logo(face, cg, ct, altura):
    base=100.0; topo=base-CAP/2-SYM/2; esc=SYM/9.0; px=SYM*8.5/9.0+GAP
    vy0=min(topo,base+TY0); vy1=max(topo+SYM,base+TY1); w=px+TX1; h=vy1-vy0
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {vy0:.2f} {w:.2f} {h:.2f}" height="{altura}" width="{altura*w/h:.1f}">'
            f'<g transform="translate({-3.75*esc:.3f} {topo-3.5*esc:.3f}) scale({esc:.4f})">{gato_g(face,cg)}</g>'
            f'<path transform="translate({px:.3f} {base})" d="{D_PAL}" fill="{ct}"/></svg>')
