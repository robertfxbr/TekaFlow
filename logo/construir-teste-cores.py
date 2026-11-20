import pathlib
base = pathlib.Path(__file__).parent
DY = .25
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
n = [0]
def arco(cx, y, w, sw, rise, c): return f'<path d="M{cx-w/2} {y}Q{cx} {y-rise} {cx+w/2} {y}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round"/>'
def barra(cx, cy, h, w, c): return f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{w/2}" fill="{c}"/>'
def rosto(c): return arco(6.2, 8, 1.6, .5, .8, c) + arco(9.8, 8, 1.6, .5, .8, c) + barra(7, 10, .8, .5, c) + barra(8, 10, 1.5, .5, c) + barra(9, 10, .8, .5, c)
def sim(tile, head, det, buraco=False, sem_tile=False):
    n[0] += 1; u = f'x{n[0]}'
    hd = f'<path d="{H}" stroke-width=".5" stroke-linejoin="round"'
    if sem_tile:
        return f'<svg class="s" viewBox="1 1 14 14"><g transform="translate(0 {DY})">{hd} fill="{head}" stroke="{head}"/>{rosto(det)}</g></svg>'
    if buraco:
        return (f'<svg class="s" viewBox="1 1 14 14"><defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
                f'<path transform="translate(0 {DY})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
                f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#m{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g></svg>')
    return (f'<svg class="s" viewBox="1 1 14 14"><rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/>'
            f'<g transform="translate(0 {DY})">{hd} fill="{head}" stroke="{head}"/>{rosto(det)}</g></svg>')
def lock(simb, fonte, cor_t, fundo, rot):
    return f'<div class="lk" style="background:{fundo}"><div class="ln">{simb}<span class="pal" style="font-family:\'{fonte}\',system-ui,sans-serif;color:{cor_t}">TekaFlow</span></div><small style="color:{cor_t}">{rot}</small></div>'

LIM, INK, ESC, BR, CLARO = '#C5EF6B', '#161A0C', '#171614', '#FFFFFF', '#F4F1EA'
FONTES = [('Satoshi', 'Satoshi'), ('Chillax', 'Chillax')]
def bloco(titulo, desc, itens, fundo, cor_t):
    linhas = ''
    for rot, mk in itens:
        linhas += '<div class="par">' + ''.join(lock(mk(), f, cor_t, fundo, f'{rot} · {f}') for f, _ in FONTES) + '</div>'
    return f'<section><h3>{titulo}</h3><p>{desc}</p>{linhas}</section>'

escuro = bloco('Sobre o grafite, a cabeça do gato em branco', 'Três jeitos de usar o branco. O original, com a cabeça vazada, fica como referência no primeiro.', [
  ('Referência: cabeça vazada', lambda: sim(LIM, None, INK, buraco=True)),
  ('W1 · ícone limão, cabeça branca, rosto em tinta', lambda: sim(LIM, BR, INK)),
  ('W2 · ícone cinza escuro, cabeça branca', lambda: sim('#2B2C2F', BR, ESC)),
  ('W3 · só a cabeça branca, rosto em limão', lambda: sim(None, BR, LIM, sem_tile=True)),
], ESC, '#F1EFE9')
claro1 = bloco('Sobre fundo claro (branco)', 'O gato no ícone limão e no ícone escuro.', [
  ('L1 · ícone em tinta, cabeça vazada', lambda: sim(INK, None, INK, buraco=True)),
  ('L2 · ícone limão, cabeça em tinta, rosto limão', lambda: sim(LIM, INK, LIM)),
  ('L3 · só a cabeça em tinta, rosto branco', lambda: sim(None, INK, BR, sem_tile=True)),
], BR, INK)
claro2 = bloco('Sobre fundo claro quente (off-white)', 'Os mesmos três, para ver se o limão se sustenta fora do branco puro.', [
  ('L1 · ícone em tinta, cabeça vazada', lambda: sim(INK, None, INK, buraco=True)),
  ('L2 · ícone limão, cabeça em tinta, rosto limão', lambda: sim(LIM, INK, LIM)),
  ('L3 · só a cabeça em tinta, rosto off-white', lambda: sim(None, INK, CLARO, sem_tile=True)),
], CLARO, INK)

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, cabeça branca e fundo claro</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700&f[]=chillax@700&display=swap">
<style>
:root{{--fundo:#fff;--tinta:#161616;--linha:#e4e4e4}}
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:var(--fundo);color:var(--tinta);font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:28px;margin:0 0 4px;letter-spacing:-.01em}} p.l{{margin:0 0 8px;color:#555;max-width:68ch}}
section{{margin-top:40px}} h3{{font-size:18px;margin:0}} section>p{{margin:2px 0 14px;color:#666;font-size:14px}}
.par{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:8px;margin-bottom:8px}}
.lk{{border-radius:16px;padding:24px 20px 12px;display:flex;flex-direction:column;gap:18px;min-height:140px;justify-content:space-between;border:1px solid rgba(0,0,0,.06)}}
.ln{{display:flex;align-items:center;gap:14px}} .s{{width:60px;height:60px;flex:none}} .pal{{font-size:44px;line-height:1;letter-spacing:-.02em}}
.lk small{{opacity:.7;font-size:12px}}
</style></head><body><main>
<h1>TekaFlow, cabeça branca e fundo claro</h1>
<p class="l">Só com as duas tipografias que você escolheu, Satoshi e Chillax, e com o limão #C5EF6B. O símbolo é o A1, com o gato descido um quarto de célula.</p>
{escuro}{claro1}{claro2}
</main></body></html>'''
(base/'cabeca-branca-e-fundo-claro.html').write_text(html); print('ok')
