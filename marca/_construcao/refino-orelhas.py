"""Teste de cabeças mais redondas, com a orelha saindo do rosto. Rode da pasta marca/: python3 _construcao/refino-orelhas.py"""
import math
LIM, GRAF, VERDE, BR = '#C5EF6B', '#1A1B1E', '#5C7F10', '#FFFFFF'
DY, SW, EY = 0.25, 0.55, 7.7


def mx(x):
    return round(16 - x, 3)


def f(x):
    return f'{x:.3f}'.rstrip('0').rstrip('.')


# A: cabeça de hoje (referência)
A = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'

# B: mesmo desenho, cantos de baixo maiores e a lateral que vira orelha sem quina
B = ('M4 9V6.5Q4 6 4.12 5.5L4.42 3.89Q4.5 3.5 4.84 3.7L6.55 4.73Q7 5 7.45 5H8.55Q9 5 9.45 4.73L11.16 3.7Q11.5 3.5 11.58 3.89L11.88 5.5Q12 6 12 6.5V9A3 3 0 0 1 9 12H7A3 3 0 0 1 4 9Z')

# C: lateral levemente abaulada e fundo bem arredondado
C = ('M4 8.2Q3.9 6.5 4.12 5.5L4.42 3.89Q4.5 3.5 4.84 3.7L6.4 4.62Q7 5 7.6 5H8.4Q9 5 9.6 4.62L11.16 3.7Q11.5 3.5 11.58 3.89L11.88 5.5Q12.1 6.5 12 8.2A3.8 3.8 0 0 1 8.2 12H7.8A3.8 3.8 0 0 1 4 8.2Z')


def circular(r, tip, base_x, inner_x):
    """Rosto circular de raio r centrado em (8, 8), com orelhas triangulares que saem dele."""
    def y_on(x):
        return 8 - math.sqrt(r * r - (x - 8) ** 2)
    by, iy = y_on(base_x), y_on(inner_x)
    tx, ty = tip
    # ponta arredondada: começa e termina um pouco antes do vértice
    def rumo(p, q, d):
        dx, dy = q[0] - p[0], q[1] - p[1]
        n = math.hypot(dx, dy)
        return (p[0] + dx / n * d, p[1] + dy / n * d)
    a1 = rumo((tx, ty), (base_x, by), .4)
    a2 = rumo((tx, ty), (inner_x, iy), .4)
    d = [f'M{f(base_x)} {f(by)}', f'L{f(a1[0])} {f(a1[1])}', f'Q{f(tx)} {f(ty)} {f(a2[0])} {f(a2[1])}', f'L{f(inner_x)} {f(iy)}',
         f'A{f(r)} {f(r)} 0 0 1 {f(mx(inner_x))} {f(iy)}',
         f'L{f(mx(a2[0]))} {f(a2[1])}', f'Q{f(mx(tx))} {f(ty)} {f(mx(a1[0]))} {f(a1[1])}',
         f'L{f(mx(base_x))} {f(by)}',
         f'A{f(r)} {f(r)} 0 1 1 {f(base_x)} {f(by)}Z']
    return ''.join(d)


D = circular(3.95, (4.5, 3.5), 4.35, 6.3)
E = circular(3.95, (4.05, 3.45), 4.35, 6.3)
F = circular(3.95, (4.7, 3.3), 4.4, 6.0)
VARS = [
    ('A · Atual', 'Lateral reta que sobe até a orelha, vale reto no meio.', A),
    ('B · Cantos maiores', 'Mesmo desenho, com o fundo mais arredondado e a lateral entrando na orelha sem quina.', B),
    ('C · Rosto abaulado', 'A lateral sobe levemente curva, o fundo é bem redondo.', C),
    ('D · Rosto circular com orelhas', 'O rosto é um círculo e as orelhas saem dele.', D),
    ('E · Circular, orelhas abertas', 'Como o D, com as pontas das orelhas um pouco para fora.', E),
    ('F · Circular, orelhas altas', 'Como o D, com as orelhas mais altas e mais juntas.', F),
]
n = [0]


def rosto(c):
    def arco(cx):
        return f'<path d="M{cx-.8:.2f} {EY+.3:.2f}Q{cx} {EY-.9:.2f} {cx+.8:.2f} {EY+.3:.2f}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'

    def barra(x, h):
        return f'<rect x="{x-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
    tri = (f'<path d="M4.95 5.8L5.05 4.8L6.15 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>'
           f'<path d="M11.05 5.8L10.95 4.8L9.85 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>')
    return arco(6) + arco(10) + barra(7, 1.0) + barra(8, 1.7) + barra(9, 1.0) + tri


def tile(H, tl, det, cab, px):
    n[0] += 1
    u = f'm{n[0]}'
    if cab is None:
        c = (f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#fff"/>'
             f'<path transform="translate(0 {DY})" d="{H}" fill="#000" stroke="#000" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
             f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tl}" mask="url(#{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g>')
    else:
        c = (f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tl}"/><g transform="translate(0 {DY})">'
             f'<path d="{H}" fill="{cab}" stroke="{cab}" stroke-width=".5" stroke-linejoin="round"/>{rosto(det)}</g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 14 14" width="{px}" height="{px}">{c}</svg>'


def gato(H, cor, px):
    n[0] += 1
    u = f'g{n[0]}'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 2.9 10 10" width="{px}" height="{px}"><defs>'
            f'<mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/>{rosto("#000")}</g></mask></defs>'
            f'<rect width="16" height="16" fill="{cor}" mask="url(#{u})"/></svg>')


def painel(H, escuro):
    if escuro:
        tl, det, cab, cg = LIM, LIM, None, LIM
    else:
        tl, det, cab, cg = VERDE, VERDE, BR, VERDE
    return (f'<div class="{"d" if escuro else "l"} p">{tile(H,tl,det,cab,150)}{gato(H,cg,150)}'
            f'<span class="m">{tile(H,tl,det,cab,48)}{gato(H,cg,48)}{tile(H,tl,det,cab,32)}{gato(H,cg,32)}</span></div>')


linhas = ''.join(f'<section><h2>{t}</h2><p>{d}</p><div class="duo">{painel(H,True)}{painel(H,False)}</div></section>' for t, d, H in VARS)
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Rosto mais redondo</title><style>
body{{margin:0;background:#ECEEE8;color:#1A1B1E;font:14px/1.5 -apple-system,system-ui,sans-serif;padding:32px 40px 60px}}
h1{{font-size:22px;margin:0 0 4px}} .l0{{color:#666;margin:0 0 18px;max-width:780px}}
section{{margin:0 0 18px}} h2{{font-size:15px;margin:0}} section>p{{margin:0 0 6px;color:#666;font-size:13px}}
.duo{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
.p{{display:flex;align-items:center;gap:28px;padding:16px 24px;border-radius:14px}} .d.p{{background:#1A1B1E}} .l.p{{background:#fff}}
.m{{margin-left:auto;display:grid;grid-template-columns:auto auto;gap:6px 10px;align-items:center}}
</style></head><body><h1>Rosto mais redondo, com a orelha saindo dele</h1>
<p class="l0">Em vez de uma lateral reta que bate no triângulo da orelha, o rosto fica mais circular e a orelha sai dele. As versões vão do ajuste leve (B) ao círculo com orelhas (D, E, F). Cada uma mostra a marca quadrada e o gato sem o quadrado, em 150, 48 e 32 px, no escuro e no claro. O rosto é o final.</p>
{linhas}</body></html>'''
open('refino-orelhas.html', 'w').write(html)
