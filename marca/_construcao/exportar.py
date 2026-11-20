"""Gera os SVGs da marca TekaFlow. Rode da pasta marca/: python3 _construcao/exportar.py
Entradas: a Chillax 600 (Fontshare, uso comercial livre) e as posições das letras medidas no navegador
(_construcao/medir-espacamento.html), com o espaçamento -0,02 em e o kerning da fonte."""
import pathlib, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

BASE = pathlib.Path(__file__).resolve().parent.parent
FONTE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
f = TTFont(FONTE); gs = f.getGlyphSet(); upm = f['head'].unitsPerEm; cm = f.getBestCmap()
CAP = f['OS/2'].sCapHeight / upm          # 0,673 em
XS = [0, 498, 1062, 1620, 2231, 2805, 3086, 3663]   # posição de cada letra a 1000 px, com o espaçamento e o kerning
FS = 100.0                                   # tamanho de fonte do desenho, em unidades
cap = CAP * FS; sec = cap / 2                # uma seção é metade da altura das maiúsculas
SYM = 4 * sec                                # símbolo de 4 seções
GAP = 1 * sec                                # espaço de 1 seção

# cores da marca
LIM, GRAF, VERDE_ESC, BR = '#C5EF6B', '#1A1B1E', '#5C7F10', '#FFFFFF'
OFF = BR   # texto sobre o grafite neutro: branco puro (decisão de Carlos, 20 de Novembro de 2026)

# --- símbolo, em coordenadas de grade 16x16 (área útil: 1 a 15) ---
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
DY, SW = 0.25, 0.55
EY = 7.7                                           # altura dos olhos, em coordenadas da cabeça
def arco(cx, c): return f'<path d="M{cx-.8:.2f} {EY+.3:.2f}Q{cx} {EY-.9:.2f} {cx+.8:.2f} {EY+.3:.2f}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'
def barra(cx, h, c): return f'<rect x="{cx-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
def orelhas(c):                                     # triângulo pequeno dentro de cada orelha
    return (f'<path d="M4.95 5.8L5.05 4.8L6.15 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>'
            f'<path d="M11.05 5.8L10.95 4.8L9.85 5.4Z" fill="{c}" stroke="{c}" stroke-width=".25" stroke-linejoin="round"/>')
def rosto(c): return arco(6.0, c) + arco(10.0, c) + barra(7, 1.0, c) + barra(8, 1.7, c) + barra(9, 1.0, c) + orelhas(c)
_n = [0]
def simbolo_interno(tile, det, cabeca=None):
    """cabeca=None: cabeça vazada, mostra o fundo. cabeca='#fff': cabeça preenchida."""
    _n[0] += 1; u = f'cabeca{_n[0]}'
    if cabeca is None:
        return (f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#fff"/>'
                f'<path transform="translate(0 {DY})" d="{H}" fill="#000" stroke="#000" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
                f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g>')
    return (f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/><g transform="translate(0 {DY})">'
            f'<path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{rosto(det)}</g>')

def simbolo_svg(tile, det, cabeca=None, titulo='TekaFlow'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 14 14" width="280" height="280" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title>{simbolo_interno(tile, det, cabeca)}</svg>')

# --- gato sem o quadrado: silhueta preenchida, rosto vazado ---
def gato_interno(cor):
    _n[0] += 1; u = f'gato{_n[0]}'
    return (f'<defs><mask id="{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/>{rosto("#000")}</g></mask></defs>'
            f'<rect width="16" height="16" fill="{cor}" mask="url(#{u})"/>')
def gato_svg(cor, titulo='TekaFlow'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 2.9 10 10" width="280" height="280" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title>{gato_interno(cor)}</svg>')

# --- palavra em contornos ---
def palavra_path(cor):
    """Retorna (d, bounds) da palavra TekaFlow com a linha de base em y=0 e o x inicial em 0."""
    d = []; bx0 = by0 = 1e9; bx1 = by1 = -1e9
    k = FS / upm
    for ch, x in zip('TekaFlow', XS):
        gn = cm[ord(ch)]
        ox = x / 1000.0 * FS                       # posição horizontal, em unidades de desenho
        pen = SVGPathPen(gs); tp = TransformPen(pen, (k, 0, 0, -k, ox, 0)); gs[gn].draw(tp); d.append(pen.getCommands())
        bp = BoundsPen(gs); tb = TransformPen(bp, (k, 0, 0, -k, ox, 0)); gs[gn].draw(tb)
        if bp.bounds:
            a, b, c, e = bp.bounds; bx0 = min(bx0, a); by0 = min(by0, b); bx1 = max(bx1, c); by1 = max(by1, e)
    return ' '.join(d), (bx0, by0, bx1, by1)

D, (tx0, ty0, tx1, ty1) = palavra_path('')
def palavra_svg(cor, titulo='TekaFlow'):
    m = 2
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{tx0-m:.2f} {ty0-m:.2f} {tx1-tx0+2*m:.2f} {ty1-ty0+2*m:.2f}" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title><path d="{D}" fill="{cor}"/></svg>')

def horizontal_svg(tile, det, cabeca, cor_texto, titulo='TekaFlow'):
    base = 100.0                                     # linha de base da palavra
    centro = base - cap / 2                          # centro das maiúsculas
    topo = centro - SYM / 2                          # o símbolo fica centrado nas maiúsculas
    esc = SYM / 14.0                                 # grade 14 (1 a 15) para o tamanho do símbolo
    px = SYM + GAP                                   # onde a palavra começa
    vx0, vy0 = 0, min(topo, base + ty0)
    vx1 = px + tx1; vy1 = max(topo + SYM, base + ty1)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx0:.2f} {vy0:.2f} {vx1-vx0:.2f} {vy1-vy0:.2f}" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title><g transform="translate(0 {topo:.3f}) scale({esc:.5f}) translate(-1 -1)">{simbolo_interno(tile, det, cabeca)}</g>'
            f'<path transform="translate({px:.3f} {base})" d="{D}" fill="{cor_texto}"/></svg>')

def gato_horizontal_svg(cor_gato, cor_texto, titulo='TekaFlow'):
    base = 100.0; topo = base - cap / 2 - SYM / 2
    esc = SYM / 9.0                                  # a cabeça, com as orelhas, ocupa 9 unidades de altura
    px = SYM * 8.5 / 9.0 + GAP                       # largura do gato mais 1 seção
    vy0 = min(topo, base + ty0); vy1 = max(topo + SYM, base + ty1); w = px + tx1
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {vy0:.2f} {w:.2f} {vy1-vy0:.2f}" role="img" aria-label="{titulo}">'
            f'<title>{titulo}</title><g transform="translate({-3.75*esc:.3f} {topo-3.5*esc:.3f}) scale({esc:.4f})">{gato_interno(cor_gato)}</g>'
            f'<path transform="translate({px:.3f} {base})" d="{D}" fill="{cor_texto}"/></svg>')

mono = 'currentColor'
SAIDAS = {
  'logo/gato-fundo-escuro.svg': gato_svg(LIM),
  'logo/gato-fundo-limao.svg':  gato_svg(GRAF),
  'logo/gato-fundo-claro.svg':  gato_svg(VERDE_ESC),
  'logo/gato-mono.svg':         gato_svg(mono),
  'logo/logo-gato-fundo-escuro.svg': gato_horizontal_svg(LIM, OFF),
  'logo/logo-gato-fundo-limao.svg':  gato_horizontal_svg(GRAF, GRAF),
  'logo/logo-gato-fundo-claro.svg':  gato_horizontal_svg(VERDE_ESC, GRAF),
  'logo/logo-gato-mono.svg':         gato_horizontal_svg(mono, mono),
  'logo/simbolo-fundo-escuro.svg':  simbolo_svg(LIM, LIM),
  'logo/simbolo-fundo-limao.svg':   simbolo_svg(GRAF, GRAF),
  'logo/simbolo-fundo-claro.svg':   simbolo_svg(VERDE_ESC, VERDE_ESC, BR),
  'logo/simbolo-mono.svg':          simbolo_svg(mono, mono),
  'logo/logo-horizontal-fundo-escuro.svg': horizontal_svg(LIM, LIM, None, OFF),
  'logo/logo-horizontal-fundo-limao.svg':  horizontal_svg(GRAF, GRAF, None, GRAF),
  'logo/logo-horizontal-fundo-claro.svg':  horizontal_svg(VERDE_ESC, VERDE_ESC, BR, GRAF),
  'logo/logo-horizontal-mono.svg':         horizontal_svg(mono, mono, None, mono),
  'logo/palavra-branco.svg':     palavra_svg(BR),
  'logo/palavra-grafite.svg':   palavra_svg(GRAF),
}
for nome, conteudo in SAIDAS.items():
    (BASE / nome).write_text(conteudo)
print(len(SAIDAS), 'arquivos', 'cap', round(cap, 2), 'símbolo', round(SYM, 2), 'espaço', round(GAP, 2))
