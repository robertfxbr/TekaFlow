import pathlib
base = pathlib.Path(__file__).parent
DY = .25; SW = .65
H = 'M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z'
n = [0]
def arco(cx, y, c): return f'<path d="M{cx-.8} {y}Q{cx} {y-.8} {cx+.8} {y}" fill="none" stroke="{c}" stroke-width="{SW}" stroke-linecap="round"/>'
def barra(cx, h, c): return f'<rect x="{cx-SW/2}" y="{10-h/2}" width="{SW}" height="{h}" rx="{SW/2}" fill="{c}"/>'
BOCA = {'atual': (.8, 1.5, .8), 'maior': (1.1, 2.0, 1.1)}
MODO = ['maior']
def rosto(c):
    a, b, d = BOCA[MODO[0]]
    return arco(6.2, 8, c) + arco(9.8, 8, c) + barra(7, a, c) + barra(8, b, c) + barra(9, d, c)
def simbolo(tile, det, cabeca=None):
    n[0] += 1; u = f'x{n[0]}'
    if cabeca is None:
        return (f'<svg class="s" viewBox="1 1 14 14"><defs><mask id="m{u}" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="white"/>'
                f'<path transform="translate(0 {DY})" d="{H}" fill="black" stroke="black" stroke-width=".5" stroke-linejoin="round"/></mask></defs>'
                f'<rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}" mask="url(#m{u})"/><g transform="translate(0 {DY})">{rosto(det)}</g></svg>')
    return (f'<svg class="s" viewBox="1 1 14 14"><rect x="1" y="1" width="14" height="14" rx="4" fill="{tile}"/>'
            f'<g transform="translate(0 {DY})"><path d="{H}" fill="{cabeca}" stroke="{cabeca}" stroke-width=".5" stroke-linejoin="round"/>{rosto(det)}</g></svg>')
LIM, INK, ESC, BR, CLARO, VE = '#C5EF6B', '#161A0C', '#171614', '#FFFFFF', '#F1EFE9', '#5C7F10'
def lock(sim, cor_t, fundo, secoes, borda=False, gap=1.5):
    b = ';border:1px solid #e4e4e4' if borda else ''
    return (f'<div class="lk" data-s="{secoes}" data-g="{gap}" style="background:{fundo}{b};color:{cor_t}">'
            f'<div class="guias"></div><div class="par">{sim}<span class="pal" style="-webkit-text-stroke:.7px {cor_t}">TekaFlow</span></div></div>')
linhas = ''
# comparação da boca, só o símbolo grande
def par_boca():
    out = ''
    for nome in ('atual', 'maior'):
        MODO[0] = nome
        out += f'<div class="bc" style="background:{LIM}"><div class="gs">{simbolo(INK, INK)}</div><small>{nome}</small></div>'
    MODO[0] = 'maior'
    return out
linhas += '<h2>Boca do gato</h2><div class="tri bocas">' + par_boca() + '</div>'
for g, rot in ((1.0, 'espaço de 1 seção'), (0.75, 'espaço de 0,75 seção'), (0.5, 'espaço de 0,5 seção')):
    linhas += f'<h2>{rot}</h2><div class="tri">' + lock(simbolo(INK, INK), INK, LIM, 4, False, g) + lock(simbolo(LIM, LIM), CLARO, ESC, 4, False, g) + lock(simbolo(VE, VE, BR), INK, BR, 4, True, g) + '</div>'
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow, espaço entre o símbolo e a palavra</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@500&display=swap">
<style>
*{{box-sizing:border-box}} body{{margin:0;padding:32px 16px 64px;background:#fff;color:#161616;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}}
main{{max-width:1120px;margin:0 auto}} h1{{font-size:24px;margin:0 0 6px}} p.l{{margin:0;color:#666;max-width:70ch;font-size:14px}} h2{{font-size:15px;margin:30px 0 8px;color:#555;font-weight:600}}
.tri{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}}
.lk{{position:relative;border-radius:16px;height:190px;overflow:hidden}}
.par{{position:absolute;left:28px;top:0;display:flex;align-items:flex-start;gap:0}}
.pal{{font-family:'Satoshi',system-ui,sans-serif;font-weight:500;letter-spacing:-.02em;line-height:1;white-space:nowrap}}
.bocas{{grid-template-columns:repeat(auto-fit,minmax(200px,260px))}} .bc{{border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:10px}} .bc .gs svg{{width:150px;height:150px}} .bc small{{color:#161A0C;font-size:13px}}
.guias div{{position:absolute;left:0;right:0;height:1px;background:currentColor;opacity:.16}}
</style></head><body><main>
<h1>TekaFlow, espaço entre o símbolo e a palavra</h1>
<p class="l">Proporção de 4 seções, como você escolheu. Aqui o que muda é o espaço entre o símbolo e a palavra, medido em seções (uma seção é metade da altura das maiúsculas). A boca do gato aparece em duas versões, e as três linhas usam a maior.</p>
{linhas}
</main>
<script>
const c=document.createElement('canvas').getContext('2d');
function medir(){{
  document.querySelectorAll('.lk').forEach(lk=>{{
    const S=+lk.dataset.s, fs=46, H=lk.clientHeight;
    const pal=lk.querySelector('.pal'), sim=lk.querySelector('.s'), par=lk.querySelector('.par');
    pal.style.fontSize=fs+'px';
    c.font='500 '+fs+'px Satoshi'; const m=c.measureText('T');
    const cap=m.actualBoundingBoxAscent, asc=m.fontBoundingBoxAscent, desc=m.fontBoundingBoxDescent;
    const unit=cap/2, symH=unit*S;
    const base=(fs-(asc+desc))/2+asc;           // linha de base dentro de uma linha de altura 1
    const capCentro=base-cap/2;                  // centro das maiúsculas
    const topo=H/2-capCentro;                    // coloca o centro das maiúsculas no meio do cartão
    pal.style.position='absolute'; pal.style.left=(symH+Math.round(unit*(+lk.dataset.g)))+'px'; pal.style.top=topo+'px';
    sim.style.position='absolute'; sim.style.left='0'; sim.style.width=symH+'px'; sim.style.height=symH+'px'; sim.style.top=(H/2-symH/2)+'px';
    par.style.height=H+'px'; par.style.width=(symH+Math.round(unit*(+lk.dataset.g))+pal.getBoundingClientRect().width+4)+'px';
    const g=lk.querySelector('.guias'); g.innerHTML='';
    const total=Math.max(S,2); const topoGuia=H/2-unit*S/2;
    for(let i=0;i<=S;i++){{const d=document.createElement('div'); d.style.top=(topoGuia+i*unit)+'px'; g.appendChild(d);}}
  }});
}}
document.fonts.load('500 46px Satoshi').then(()=>document.fonts.ready).then(medir);
window.addEventListener('load',()=>setTimeout(medir,300));
</script></body></html>'''
(base/'espaco.html').write_text(html); print('ok')
