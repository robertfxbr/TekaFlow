"""Gera marca/moodboard.html (16:9, 1920 por 1080): bento arredondado, seis quadros grandes, sem legenda.
Cores e peças aprovadas mantidas (logo limão com formas ao fundo, letra em cartaz escura, tom de voz azul céu, adesivos com borda branca).
Só mudaram: o verde de fundo do ícone, o quadro branco, o "Flow" do cartaz e a ordem dos quadros.
Rode da pasta marca/: python3 _construcao/moodboard-visual.py
Depois exporte o PNG com o Chrome sem tela (ver marca/_construcao/LEIA-ME.md)."""
import sys
sys.path.insert(0, "_construcao")
from ondas import ondas_quadradas

L = "logo/"
GRAF, SUP, LIM, AZUL, BR, VERMELHO = "#1A1B1E", "#25262A", "#C5EF6B", "#5BC0FF", "#FFFFFF", "#E5484D"
GATO_AV = f'<i class="av gato"><img src="{L}gato-fundo-escuro.svg" alt=""></i>'

# elemento central: o símbolo do gato com o selo de notificação, e as ondas em quadradinho em volta, sobre o grafite
ONDAS = (f'<svg viewBox="0 0 926 506" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
         f'{ondas_quadradas(463, 253, 150, 132, 6.4, 9, 7, L + "gato-fundo-escuro.svg", fundo=SUP)}</svg>')

# quadro do símbolo, sozinho, sobre a superfície
CIRCULO = f'<div class="ic"><img src="{L}simbolo-fundo-escuro.svg" alt="TekaFlow"><b class="badge">1</b></div>'

html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>TekaFlow, moodboard</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@500,600,700&display=swap">
<style>
:root{{--gr:{GRAF};--su:{SUP};--li:{LIM};--az:{AZUL};--br:{BR};--fd:'Chillax',system-ui,sans-serif}}
*{{box-sizing:border-box;margin:0}} html,body{{width:1920px;height:1080px;overflow:hidden;background:#fff}}
.board{{width:1920px;height:1080px;padding:24px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:20px}}
.t{{position:relative;overflow:hidden;border-radius:34px;min-width:0;min-height:0}}
.centro{{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:auto}}
/* letra em cartaz, escuro, com a pílula no topo */
.cartaz{{background:var(--gr)}} .cartaz .gigante{{position:absolute;left:-12px;bottom:-62px;font:700 300px/1 var(--fd);color:var(--li);letter-spacing:-.04em}}
.pil{{display:flex;align-items:center;gap:10px;border-radius:999px;padding:6px 22px 6px 6px;font:600 23px var(--fd);width:fit-content;background:var(--br);color:var(--gr)}}
.cartaz .pil{{position:absolute;left:28px;top:26px}}
.av{{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-style:normal}} .av.gato{{background:var(--gr);overflow:hidden}} .av.gato img{{width:78%;height:78%;margin-top:2px;display:block}}
/* tom de voz */
.tom{{background:var(--az);padding:40px 38px;display:flex;flex-direction:column;justify-content:space-between}} .tom p{{font:600 37px/1.14 var(--fd);color:var(--gr);letter-spacing:-.01em}} .tom p span{{display:block;white-space:nowrap}}
.tom .chips{{display:flex;gap:18px;white-space:nowrap}} .tom .chips span{{display:inline-block;border-radius:999px;padding:8px 16px;font:600 16px var(--fd)}}
.tom .chips{{display:flex;gap:8px;white-space:nowrap}} .tom .chips span{{display:inline-block;border-radius:999px;padding:8px 16px;font:600 16px var(--fd)}}
/* ondas */
.ondas{{background:var(--gr);grid-column:span 2}} .ondas svg{{position:absolute;inset:0;width:100%;height:100%}}
/* logo principal: limão com formas suaves ao fundo */
.logo{{background:var(--li);grid-column:span 2}} .logo i{{position:absolute;background:#B9E15C;border-radius:110px}}
.logo .b1{{left:-5%;top:-24%;width:34%;height:58%}} .logo .b2{{right:-6%;bottom:-28%;width:46%;height:62%}} .logo .b3{{right:16%;top:-20%;width:20%;height:40%;opacity:.55}}
/* símbolo com selo */
.circulo{{background:var(--su)}} .ic{{position:absolute;left:50%;top:50%;width:210px;height:210px;transform:translate(-50%,-50%)}} .ic img{{width:100%;height:100%;display:block}}
.badge{{position:absolute;top:-17px;right:-19px;background:{VERMELHO};color:#fff;border-radius:999px;font:700 30px var(--fd);min-width:56px;height:56px;display:grid;place-items:center;box-shadow:0 0 0 6px var(--su)}}
/* adesivos */
.ades{{background:var(--li)}} .ades .ad{{position:absolute;display:flex;align-items:center;gap:10px;border-radius:999px;padding:10px 26px;font:600 31px var(--fd);border:6px solid #fff}} .ades .ad em,.ades .ad u{{font-style:normal;text-decoration:none}}
.a1{{left:9%;top:11%;background:var(--gr);color:var(--li);transform:rotate(-6deg);padding-left:8px}} .a2{{left:30%;top:33%;background:#fff;color:var(--gr);transform:rotate(4deg)}}
.a3{{left:8%;top:56%;background:var(--az);color:var(--gr);transform:rotate(-3deg)}} .a4{{left:34%;top:78%;background:var(--gr);color:var(--li);transform:rotate(5deg)}}
</style></head><body><div class="board">
 <div class="t cartaz"><span class="gigante">Teka</span><div class="pil">{GATO_AV}<span>ouvindo…</span></div></div>
 <div class="t tom"><p><span>Seu companheiro</span><span>discreto de reuniões.</span></p><div class="chips"><span style="background:var(--gr);color:#fff">Mac e Windows</span><span style="background:var(--li);color:var(--gr)">No seu computador</span></div></div>
 <div class="t ondas">{ONDAS}</div>

 <div class="t logo"><i class="b1"></i><i class="b2"></i><i class="b3"></i><img class="centro" src="{L}logo-horizontal-fundo-limao.svg" alt="TekaFlow" style="width:66%"></div>
 <div class="t circulo">{CIRCULO}</div>
 <div class="t ades"><span class="ad a1">{GATO_AV}<b>ouvindo</b></span><span class="ad a2"><b>pensando</b><em>· · ·</em></span><span class="ad a3"><b>escrevendo</b></span><span class="ad a4"><b>diga isso</b></span></div>
</div></body></html>"""
open("moodboard.html", "w").write(html)
print("ok")
