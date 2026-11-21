"""Grade de olhos por boca. Rode da pasta marca/: python3 _construcao/expressoes.py"""
import sys; sys.path.insert(0, "_construcao")
from gato import *

def celula(face):
    out=''
    for escuro in (True, False):
        if escuro: tl,det,cab,cg=LIM,LIM,None,LIM
        else:      tl,det,cab,cg=VERDE,VERDE,BR,VERDE
        out+=f'<div class="{"d" if escuro else "l"}">{tile(face,tl,det,cab,64)}{gato(face,cg,64)}</div>'
    return out
cab=''.join(f'<div class="h"><b>{n_}</b><span>{d}</span></div>' for n_,d,_ in BOCAS)
linhas=''
for i,(on,od,ofn) in enumerate(OLHOS,1):
    cels=''.join(f'<div class="c">{celula(lambda c,ofn=ofn,bf=bf: ofn(c)+bf(c))}<em>{i}{chr(64+j)}</em></div>' for j,(bn,bd,bf) in enumerate(BOCAS,1))
    linhas+=f'<div class="r"><div class="t"><b>{i}. {on}</b><span>{od}</span></div>{cels}</div>'
html=f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Olhos e bocas do gato</title><style>
body{{margin:0;background:#ECEEE8;color:#1A1B1E;font:14px/1.5 -apple-system,system-ui,sans-serif;padding:32px 40px 60px}}
h1{{font-size:22px;margin:0 0 4px}} .l0{{color:#666;margin:0 0 16px;max-width:820px}}
.bar{{display:flex;gap:8px;margin-bottom:18px}} .bar button{{font:inherit;padding:6px 14px;border-radius:999px;border:1px solid #bbb;background:#fff;cursor:pointer}}
.bar button.on{{background:#1A1B1E;color:#fff;border-color:#1A1B1E}}
.g{{display:grid;grid-template-columns:170px repeat(5,1fr);gap:10px;align-items:stretch}}
.h{{display:flex;flex-direction:column;gap:0;padding-bottom:4px}} .h b{{font-size:14px}} .h span{{font-size:11px;color:#666}}
.r{{display:contents}} .t{{display:flex;flex-direction:column;justify-content:center}} .t b{{font-size:14px}} .t span{{font-size:11px;color:#666}}
.c{{position:relative;border-radius:12px;display:flex;align-items:center;justify-content:center;padding:14px 8px;background:#1A1B1E}}
.c div{{display:flex;gap:14px;align-items:center}} .c em{{position:absolute;left:8px;top:4px;font:10px/1 -apple-system,sans-serif;opacity:.55;font-style:normal;color:#999}}
body.claro .c{{background:#fff}} body.claro .d{{display:none}} body:not(.claro) .l{{display:none}}
</style></head><body><h1>Olhos e bocas do gato</h1>
<p class="l0">A boca de três barras fica, e os olhos partem do desenho que já temos. Em cada linha, um olhar; em cada coluna, um estado da boca. Cada quadro mostra a marca quadrada e o gato sem o quadrado, com o código para você escolher (por exemplo, 2C). Traço de 0,55.</p>
<div class="bar"><button class="on" onclick="m(0,this)">Fundo escuro</button><button onclick="m(1,this)">Fundo claro</button></div>
<div class="g"><div></div>{cab}{linhas}</div>
<script>function m(c,b){{document.body.classList.toggle('claro',!!c);document.querySelectorAll('.bar button').forEach(x=>x.classList.remove('on'));b.classList.add('on')}}</script>
</body></html>"""
open('expressoes-gato.html','w').write(html)
