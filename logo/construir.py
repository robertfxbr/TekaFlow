import pathlib
base = pathlib.Path(__file__).parent
S = 30  # unidade da malha 8x8, como nos estudos do Zanuve

def poly(pts, w=0.5):
    p = ' '.join(f'{x},{y}' for x, y in pts)
    return f'<polygon points="{p}" stroke="currentColor" stroke-width="{w}" stroke-linejoin="round"/>'

def rect(x, y, w, h, rx):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>'

# massas das três silhuetas
massas = {
 '1': rect(1, 2.4, 6, 4.6, 2.0) + poly([(1.45, 3.5), (1.6, 1.3), (3.6, 2.7)]) + poly([(6.55, 3.5), (6.4, 1.3), (4.4, 2.7)]),
 '2': rect(1, 2.4, 6, 4.6, 2.0) + poly([(1.45, 3.5), (1.6, 1.3), (3.6, 2.7)]) + poly([(5.0, 2.7), (6.75, 1.7), (6.6, 3.7)]),
 '3': rect(1, 3.9, 6, 3.1, 1.55) + rect(1.2, 1.9, 3.1, 2.7, 1.1) + poly([(1.6, 2.8), (1.75, 1.2), (2.7, 2.2)]) + poly([(3.9, 2.8), (3.75, 1.2), (2.8, 2.2)]),
}
def olhos(b):
    if b == '3': return [rect(1.75, 3.1, 0.85, 0.4, .2), rect(2.95, 3.1, 0.85, 0.4, .2)]
    return [rect(2.45, 4.25, 1.1, 0.42, .21), rect(4.45, 4.25, 1.1, 0.42, .21)]
def ondas(b):
    cx, cy = (5.9, 5.45) if b == '3' else (4, 5.7)
    return [rect(cx-.65-.175, cy-.45, .35, .9, .175), rect(cx-.175, cy-.75, .35, 1.5, .175), rect(cx+.65-.175, cy-.45, .35, .9, .175)]
def orelhas(b):
    if b == '1': return [poly([(2.0, 3.0), (2.05, 2.1), (2.9, 2.75)], .25), poly([(6.0, 3.0), (5.95, 2.1), (5.1, 2.75)], .25)]
    if b == '2': return [poly([(2.0, 3.0), (2.05, 2.1), (2.9, 2.75)], .25), poly([(5.8, 2.9), (6.4, 2.3), (6.3, 3.2)], .2)]
    return [poly([(1.85, 2.55), (1.95, 1.75), (2.4, 2.25)], .15), poly([(3.65, 2.55), (3.55, 1.75), (3.1, 2.25)], .15)]
cortes = {'A': lambda b: [], 'B': olhos, 'C': ondas, 'D': lambda b: olhos(b) + orelhas(b)}

def simbolo(b, v, id_):
    cut = ''.join(cortes[v](b)).replace('<rect ', '<rect fill="black" ').replace('<polygon ', '<polygon fill="black" stroke="black" ')
    # nas orelhas internas o traço já herda preto; nas massas o traço segue a tinta
    massa = massas[b].replace('<rect ', '<rect ').replace('<polygon ', '<polygon fill="currentColor" ')
    mask = f'<defs><mask id="m-{id_}" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="8"><rect width="8" height="8" fill="white"/>{cut}</mask></defs>'
    return f'{mask}<g fill="currentColor" mask="url(#m-{id_})">{massa}</g>'

ids = [f'{b}{v}' for v in 'ABCD' for b in '123']
for i in ids:
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="{8*S}" height="{8*S}" fill="currentColor" role="img" aria-label="TekaFlow {i}">{simbolo(i[0], i[1], i)}</svg>'
    (base/'svg'/f'{i}.svg').write_text(s)

nomes = {'1': 'Cabeça de frente', '2': 'Orelha virada', '3': 'Gato enrolado'}
vars_ = {'A': 'Lisa', 'B': 'Olhos meio fechados', 'C': 'Ondas de voz', 'D': 'Orelha atenta'}
cel = ''
for i in ids:
    s = (base/'svg'/f'{i}.svg').read_text()
    cel += f'<figure><div class="sim">{s}</div><figcaption><b>{i}</b> {nomes[i[0]]}, {vars_[i[1]].lower()}</figcaption></figure>'

def assin(i, cor_fundo, cor_tinta, nome):
    s = simbolo(i[0], i[1], 'a'+i+nome)
    return (f'<figure class="as" style="background:{cor_fundo};color:{cor_tinta}"><div class="linha">'
            f'<svg viewBox="1 1 6 6" aria-hidden="true">{s}</svg><span class="pal">TekaFlow</span></div><figcaption>{i} sobre {nome}</figcaption></figure>')
fundos = [('grafite', '#171614', '#f1efe9'), ('verde-limão', '#c5ef6b', '#161a0c'), ('branco', '#ffffff', '#1d1c19')]
assins = ''.join(assin(i, f, t, n) for i in ('1B', '2B', '3B') for n, f, t in fundos)

def mini(i):
    return ''.join(f'<span style="width:{px}px;height:{px}px"><svg viewBox="1 1 6 6" width="{px}" height="{px}">{simbolo(i[0], i[1], f"t{px}{i}")}</svg></span>' for px in (16, 32, 64))
testes = ''.join(f'<div class="t"><b>{i}</b>{mini(i)}</div>' for i in ('1B', '2B', '3B', '1C', '2C', '3C'))

html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, estudos de logo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600&display=swap" rel="stylesheet">
<style>
:root{{--fundo:#fff;--tinta:#161616;--linha:#e4e4e4}}
*{{box-sizing:border-box}}
body{{margin:0;padding:32px 16px 64px;background:var(--fundo);color:var(--tinta);font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1100px;margin:0 auto}}
h1{{font-size:28px;margin:0 0 4px;letter-spacing:-.01em}} p.l{{margin:0 0 24px;color:#555;max-width:64ch}}
h2{{font-size:18px;margin:40px 0 12px}}
.grade{{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--linha);border-radius:16px;overflow:hidden}}
.grade figure{{margin:0;border:1px solid var(--linha);padding:24px 16px 12px;margin:-1px 0 0 -1px}}
.sim{{width:100%;max-width:220px;margin:0 auto;color:#000}} .sim svg{{width:100%;height:auto;display:block}}
figcaption{{font-size:13px;color:#555;margin-top:12px}}
.ass{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}
.as{{margin:0;border-radius:16px;padding:40px 24px 14px;border:1px solid var(--linha)}}
.as figcaption{{color:inherit;opacity:.7}}
.linha{{display:flex;align-items:center;gap:16px}} .linha svg{{height:72px;width:72px;flex:none}}
.pal{{font-family:Outfit,system-ui,sans-serif;font-weight:500;font-size:40px;letter-spacing:-.02em;line-height:1}}
.testes{{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}}
.t{{border:1px solid var(--linha);border-radius:16px;padding:16px;display:flex;align-items:flex-end;gap:16px;color:#000}} .t b{{font-size:13px;font-weight:600;margin-right:auto;align-self:flex-start;color:#555}}
.t span{{display:block}}
@media(max-width:760px){{.grade,.ass{{grid-template-columns:1fr}}}}
</style></head><body><main>
<h1>TekaFlow, estudos de logo</h1>
<p class="l">Mesmo método dos estudos do Zanuve: malha 8×8, formas sólidas e recortes pequenos. Colunas são as três silhuetas e linhas são as quatro variações. Escolha os que ficam.</p>
<div class="grade">{cel}</div>
<h2>Assinatura com o nome</h2>
<p class="l">Nome em Outfit, que lembra a letra minúscula e redonda do Perssua. O Perssua é desenho vetorial sem arquivo de fonte, então esta é uma aproximação.</p>
<div class="ass">{assins}</div>
<h2>Teste de tamanho: 16, 32 e 64 pixels</h2>
<div class="testes">{testes}</div>
</main></body></html>'''
(base/'index.html').write_text(html)
print('ok', len(ids))
