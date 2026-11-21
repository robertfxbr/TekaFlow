import pathlib
base = pathlib.Path(__file__).parent
DY = .25; SW = .65
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
n = [0]
def arco(cx, y, c): return f'<path d="M{cx-.8} {y}Q{cx} {y-.8} {cx+.8} {y}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'
def barra(cx, h, c): return f'<rect x="{cx-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
def rosto(c): return arco(6.2, 8, c) + arco(9.8, 8, c) + barra(7, .8, c) + barra(8, 1.5, c) + barra(9, .8, c)
def simbolo(tile, det, cabeca=None):
    n[0] += 1; u = f'x{n[0]}'
    if cabeca is None:
        return (f'<svg class="s" viewBox="1 1 14 14"><defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
                f'<path transform="translate(0 {DY})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
                f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#m{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g></svg>')
    return (f'<svg class="s" viewBox="1 1 14 14"><rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{rosto(det)}</g></svg>')
LIM, INK, ESC, BR, CLARO = '#C5EF6B', '#161A0C', '#171614', '#FFFFFF', '#F1EFE9'
G1, G2, G3 = '#6E9816', '#5C7F10', '#4A650C'   # verdes escuros do mesmo tom do limão, para fundo claro
def lock(sim, partes, fundo, ls='-.02em', borda=False, nota=''):
    b = ';border:1px solid #e4e4e4' if borda else ''
    t = ''.join(f'<span style="color:{c}">{x}</span>' for x, c in partes)
    nt = f'<small>{nota}</small>' if nota else ''
    return f'<div class="lk" style="background:{fundo}{b}"><div class="ln">{sim}<span class="pal" style="letter-spacing:{ls}">{t}</span></div>{nt}</div>'

# A. fundo claro, ícone em verde
A = ''.join(lock(simbolo(g, g, BR), [('Teka', INK), ('Flow', INK)], BR, borda=True, nota=g) for g in (G1, G2, G3))
# B. cor do Teka, nos três fundos, duas versões cada
Sv = simbolo(INK, INK); Se = simbolo(LIM, LIM); Sc = simbolo(G2, G2, BR)
B1 = lock(simbolo(INK, INK), [('Teka', INK), ('Flow', G3)], LIM) + lock(simbolo(LIM, LIM), [('Teka', LIM), ('Flow', CLARO)], ESC) + lock(simbolo(G2, G2, BR), [('Teka', G2), ('Flow', INK)], BR, borda=True)
B2 = lock(simbolo(INK, INK), [('Teka', G3), ('Flow', INK)], LIM) + lock(simbolo(LIM, LIM), [('Teka', CLARO), ('Flow', LIM)], ESC) + lock(simbolo(G2, G2, BR), [('Teka', INK), ('Flow', G2)], BR, borda=True)
# C. espaçamento entre as letras, no fundo escuro
C = ''.join(lock(simbolo(LIM, LIM), [('TekaFlow', CLARO)], ESC, ls=v, nota=v) for v in ('-.04em', '-.02em', '0em', '.02em'))

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, Chillax: fundo claro, cor do Teka e espaçamento</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@700&display=swap">
<style>
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:#fff;color:#161616;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:24px;margin:0 0 8px}} h2{{font-size:16px;margin:36px 0 10px;color:#555;font-weight:600}}
.tri{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin-bottom:12px}}
.lk{{border-radius:16px;padding:40px 28px 14px;display:flex;flex-direction:column;justify-content:space-between;gap:20px;min-height:150px}}
.ln{{display:flex;align-items:center;gap:16px}} .s{{width:64px;height:64px;flex:none}} .pal{{font-family:'Chillax',system-ui,sans-serif;font-weight:700;font-size:48px;line-height:1}}
small{{font-size:12px;opacity:.6}}
</style></head><body><main>
<h1>TekaFlow em Chillax</h1>
<h2>Fundo claro, com o ícone em verde</h2><div class="tri">{A}</div>
<h2>Cor do Teka, nos três fundos</h2><div class="tri">{B1}</div><div class="tri">{B2}</div>
<h2>Espaçamento entre as letras</h2><div class="tri">{C}</div>
</main></body></html>'''
(base/'comparacao-fundos-2.html').write_text(html); print('ok')
