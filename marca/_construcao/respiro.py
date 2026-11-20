"""Desenha a área de respiro em volta da logo horizontal. Uso: python3 respiro.py caminho/chillax-600.woff2"""
import sys, re, pathlib
import exportar as e   # reusa as medidas e os desenhos da marca

def area(n_secoes, cor_logo=None):
    """SVG da logo horizontal para fundo claro, com a área de respiro de n_secoes (uma seção = metade da altura das maiúsculas)."""
    s = e.horizontal_svg(e.VERDE_ESC, e.VERDE_ESC, e.BR, e.GRAF)
    vx, vy, vw, vh = [float(x) for x in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    inner = re.search(r'<title>[^<]*</title>(.*)</svg>', s, re.S).group(1)
    m = n_secoes * e.sec
    X, Y, W, Hh = vx - m, vy - m, vw + 2 * m, vh + 2 * m
    # quadradinhos de uma seção nos quatro cantos, para mostrar a medida
    q = e.sec
    quad = ''.join(f'<rect x="{x:.2f}" y="{y:.2f}" width="{q:.2f}" height="{q:.2f}" fill="none" stroke="#C5EF6B" stroke-width="0.9"/>'
                   for x, y in ((X, Y), (X + W - q, Y), (X, Y + Hh - q), (X + W - q, Y + Hh - q)))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{X:.2f} {Y:.2f} {W:.2f} {Hh:.2f}" role="img" aria-label="Área de respiro de {n_secoes} seções">'
            f'<rect x="{X:.2f}" y="{Y:.2f}" width="{W:.2f}" height="{Hh:.2f}" fill="#1A1B1E" fill-opacity=".05"/>'
            f'<rect x="{vx:.2f}" y="{vy:.2f}" width="{vw:.2f}" height="{vh:.2f}" fill="#FFFFFF"/>'
            f'<rect x="{X:.2f}" y="{Y:.2f}" width="{W:.2f}" height="{Hh:.2f}" fill="none" stroke="#1A1B1E" stroke-opacity=".35" stroke-width="0.9" stroke-dasharray="4 3"/>'
            f'{quad}{inner}</svg>')

if __name__ == '__main__':
    out = pathlib.Path(__file__).resolve().parent.parent
    for n in (1, 2, 4):
        (out / 'logo' / f'_area-de-respiro-{n}-secoes.svg').write_text(area(n))
    cartas = ''.join(f'<section><h2>{t}</h2><div class="t">{area(n)}</div></section>' for n, t in ((1, '1 seção'), (2, '2 seções, meio símbolo'), (4, '4 seções, um símbolo inteiro')))
    html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TekaFlow, área de respiro</title>
<style>*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:#fff;color:#1A1B1E;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}} main{{max-width:1000px;margin:0 auto}} h1{{font-size:24px;margin:0 0 6px}} p{{color:#555;max-width:70ch}} h2{{font-size:15px;margin:26px 0 8px;color:#555}}
.t{{border:1px solid #e4e4e4;border-radius:16px;padding:24px;background:#f4f4f2}} .t svg{{width:100%;max-width:640px;height:auto;display:block;margin:0 auto}}</style></head><body><main>
<h1>Área de respiro da logo</h1><p>A área pontilhada é o espaço livre em volta da logo. Cada quadradinho verde nos cantos é uma seção, que é metade da altura das letras maiúsculas. O ícone tem 4 seções de altura, então 4 seções de respiro equivalem a um símbolo inteiro.</p>{cartas}</main></body></html>'''
    (out / '_construcao' / 'area-de-respiro.html').write_text(html)
    print('ok')
