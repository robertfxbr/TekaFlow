"""Gera marca/moodboard-grafismos.html: conceitos aplicados ao TekaFlow, mais as referências reais de origem.
As imagens ficam em referencias/grafismos-2/. Rode da pasta marca/: python3 _construcao/moodboard-grafismos.py"""
import html as H
import sys
sys.path.insert(0, '_construcao')
from ondas import ondas_quadradas

R = "../referencias/grafismos-2/"
FONTES = {
    "human": ("Human", "https://designcompass.org/en/2026/07/22/human-spoken-language-identity/"),
    "wordibly": ("Wordibly, Big Human", "https://www.bighuman.com/work/wordibly-case-study"),
    "descript": ("Descript, Ramotion", "https://www.ramotion.com/descript-brand-identity-and-web-design/"),
    "pictoplasma": ("Pictoplasma, andstudio", "https://www.creativeboom.com/work/how-two-simple-dots-gave-pictoplasma-a-face-after-20-years-of-neutral-design/"),
    "microdot": ("Microdot, Standard Projects", "https://www.creativeboom.com/news/the-paradox-of-branding-invisible-work-how-standard-projects-solves-microdots-big-challenge"),
    "understudy": ("Understudy, Révolté", "https://contra.com/p/2WvORUcg-understudy-visual-identity-project"),
    "hearingau": ("Hearing Australia, Landor", "https://www.creativeboom.com/work/landor-celebrates-sound-with-a-new-identity-for-hearing-australia-that-you-can-hear-see-and-feel/"),
    "rev": ("Rev", "https://www.rev.com/blog/rev-announcements/introducing-revs-rebranded-visual-identity"),
    "phlox": ("Phlox, Révolté", "https://contra.com/p/cLBYFFL3-phlox-brand-identity-development"),
    "clueso": ("Clueso", "https://www.clueso.io/blog/the-clueso-brand"),
    "beya": ("BEYA, KR8", "https://the-brandidentity.com/project/kr8-introduce-a-rorschach-test-like-pattern-system-across-beyas-fluid-flexible-identity-system"),
    "nyphil": ("New York Philharmonic, Pentagram", "https://www.pentagram.com/work/new-york-philharmonic"),
    "gimlet": ("Gimlet, GrandArmy", "https://www.itsnicethat.com/articles/grandarmy-gimlet-rebrand-graphic-design-160819"),
    "wonda": ("Wonda, Good Habit", "https://www.creativeboom.com/work/good-habit-builds-a-new-brand-identity-for-the-new-ai-marketing-tool-wonda/"),
    "saltycat": ("Salty Cat, Darya Batyr", "https://contra.com/p/s3kLWFmv-playful-identity-for-a-sassy-cat-food-brand"),
    "mivov": ("Mivov, Serkan Hürsgünel", "https://contra.com/p/gBUFmBMX-mivov-dijital-marketing-agency-logo"),
    "iqonic": ("IQONIC, Lorenzo Rocco", "https://contra.com/p/rsUosULv-iqonic-brand-identity-creation"),
}

# Caminhos escolhidos por ele: fala escrita, som em círculos (ondinhas que perdem cor) e a letra como grafismo.
ESCOLHIDOS = [
    ("01", "A fala escrita", "Pílulas, marca-texto, adesivos de palavras e uma letra dentro de uma bolinha. A conversa vira texto na tela, e o texto vira o grafismo.",
     [("wordibly", "06", "Adesivos de palavras em pílulas"), ("wordibly", "03", "Letras em bolinhas sobre a foto"),
      ("wordibly", "10", "Marca-texto dentro da interface"), ("wordibly", "01", "Foto, pílula e legenda no mesmo plano"),
      ("human", "01", "Símbolos de transcrição viram a identidade"), ("human", "02", "A palavra falada na tela, como campanha"),
      ("descript", "01", "Uma letra feita de linhas de texto"), ("descript", "05", "O mesmo ícone em quatro fundos")]),
    ("02", "O som em círculos, em ondinhas que perdem cor", "Anéis que se abrem a partir de um ponto. Para o TekaFlow, sem relevo: ondinhas que vão perdendo a cor conforme se afastam.",
     [("hearingau", "01", "Três quadros: ondas, pontos e anéis"), ("hearingau", "02", "Anéis concêntricos saindo de um ponto"),
      ("hearingau", "04", "Anéis, pontos e linhas em quadros"), ("hearingau", "06", "O mesmo anel na tela"),
      ("rev", "05", "Círculos de tamanhos diferentes")]),
    ("03", "A letra como grafismo", "Tipografia grande, em curva ou carimbo, fazendo o trabalho de uma ilustração.",
     [("nyphil", "01", "O nome em círculo, cortado por uma reta"), ("nyphil", "06", "A mesma ideia em cartaz"),
      ("gimlet", "02", "Letras de impressão em tipo móvel"), ("gimlet", "08", "Recortes e colagem como textura"),
      ("wonda", "02", "Frase em fonte grossa como imagem"), ("wonda", "03", "Texto com um desenho no meio"),
      ("wonda", "05", "Aviso de porta com a mesma voz"), ("rev", "02", "Nome e símbolo sobre malha de construção")]),
]

# Caminhos guardados, que ele não escolheu (ou descartou)
GUARDADOS = [
    ("Descartado: dois pontos viram um rosto", [("pictoplasma", "02", "Dois pontos viram a marca inteira"), ("pictoplasma", "04", "Mesma regra em dezenas de peças"),
        ("understudy", "07", "Um círculo vazado atravessa o rosto"), ("microdot", "01", "Cinco pontos, mais nada")]),
    ("Guardado: pontos que se dissolvem", [("phlox", "02", "Uma flor de pontos, do cheio ao vazio"), ("phlox", "07", "A mesma forma em adesivos"),
        ("microdot", "05", "Fita adesiva com pontos grandes"), ("rev", "07", "Faixas com textura de linha")]),
    ("Guardado: peças que se encaixam", [("clueso", "03", "Peças de quebra-cabeça com encaixes"), ("clueso", "05", "Cavidades, saliências e lados retos"),
        ("beya", "01", "Formas simétricas, quase rostos"), ("beya", "07", "Cinco cartazes da mesma gramática")]),
    ("Guardado: o gato sem o clichê", [("saltycat", "07", "Rosto de gato só em linhas, e patas"), ("saltycat", "05", "Silhueta preta, recorte forte"),
        ("mivov", "02", "O gato escondido dentro de uma letra"), ("mivov", "01", "O mesmo traço em foto")]),
    ("Guardado: ouvir, por desenho", [("rev", "03", "Gravura de uma orelha com uma espiral"), ("rev", "04", "A espiral construída em proporção áurea"),
        ("iqonic", "01", "Um contorno vermelho corta a fotografia"), ("iqonic", "03", "O mesmo contorno em papelaria")]),
]


def esc(s):
    return H.escape(s)


def fig(k, f, leg):
    nome, url = FONTES[k]
    return (f'<figure data-img="{R}{k}/{f}.jpg" data-leg="{esc(leg)}" data-src="{esc(nome)}" data-url="{url}">'
            f'<img loading="lazy" src="{R}{k}/{f}.jpg" alt="{esc(leg)}"><figcaption><b>{esc(leg)}</b><span>{esc(nome)}</span></figcaption></figure>')


# ---------- Conceitos aplicados ao TekaFlow ----------
LOGO = "logo/"
PAL = lambda cor: f"{LOGO}palavra-{cor}.svg"


def av(txt, bg, fg):
    return f'<i class="av" style="background:{bg};color:{fg}">{txt}</i>'


def pilula(av_html, conteudo, extra=""):
    return f'<div class="pil {extra}">{av_html}<span>{conteudo}</span></div>'


GATO_AV = f'<i class="av gato"><img src="{LOGO}gato-fundo-escuro.svg" alt=""></i>'

TILE_FALA = f"""
<div class="tile escuro fala">
  <div class="pilulas">
    {pilula(av("E", "#fff", "#1A1B1E"), "Conta um pouco da sua trajetória.", "p1")}
    {pilula(av("V", "#5BC0FF", "#1A1B1E"), "Passei cinco anos em design de produto, numa fintech.", "p2")}
    {pilula(av("E", "#fff", "#1A1B1E"), "Teve algum desafio técnico no checkout?", "p3")}
    {pilula(GATO_AV, 'Na migração, <mark>defendi manter a fila</mark> até <mark>medir a latência</mark>.', "p4")}
  </div>
  <p class="leg">A fala escrita: cada fala é uma pílula. As antigas vão perdendo cor, a sugestão do gato acende em limão.</p>
</div>"""

TILE_BOLINHAS = f"""
<div class="tile limao bol">
  <i class="c gt" style="--s:150px;left:8%;top:14%;background:#1A1B1E"><img src="{LOGO}gato-fundo-escuro.svg" alt=""></i>
  <i class="c l" style="--s:70px;left:36%;top:10%;background:#1A1B1E;color:#C5EF6B">T</i>
  <i class="c l" style="--s:92px;left:48%;top:42%;background:#fff;color:#1A1B1E">e</i>
  <i class="c l" style="--s:60px;left:29%;top:58%;background:#5BC0FF;color:#1A1B1E">k</i>
  <i class="c l" style="--s:84px;left:66%;top:12%;background:#fff;color:#1A1B1E">a</i>
  <i class="c l" style="--s:64px;left:77%;top:46%;background:#1A1B1E;color:#C5EF6B">F</i>
  <i class="c l" style="--s:52px;left:60%;top:70%;background:#5BC0FF;color:#1A1B1E">l</i>
  <i class="c l" style="--s:76px;left:84%;top:68%;background:#fff;color:#1A1B1E">o</i>
  <i class="c l" style="--s:46px;left:12%;top:74%;background:#1A1B1E;color:#C5EF6B">w</i>
  <p class="leg">A letra dentro da bolinha: o nome vira confete, e o gato entra como mais uma bolinha.</p>
</div>"""

TILE_ONDAS = f"""
<div class="tile escuro ondas">
  <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-label="Ondinhas em quadradinho saindo de trás do ícone">
    <rect width="640" height="400" fill="#1A1B1E"/>
    {ondas_quadradas(210, 200, 150, 104, 4.6, 7, 6, LOGO + "simbolo-fundo-escuro.svg")}
  </svg>
  <p class="leg">As ondinhas saem no formato do ícone, de trás de um quadradinho escuro que protege o gato, e perdem a cor, do limão ao azul céu até sumir.</p>
</div>"""

TILE_LETRA = f"""
<div class="tile escuro letra">
  <span class="gigante">Teka</span>
  <span class="flow">Flow</span>
  <div class="pil p4 solta">{GATO_AV}<span>ouvindo…</span></div>
  <p class="leg">A letra como cartaz: o nome em Chillax gigante, cortado pela borda, com uma pílula do gato por cima.</p>
</div>"""

TILE_ADESIVOS = f"""
<div class="tile claro ades">
  <span class="ad a1">{GATO_AV}<b>ouvindo</b></span>
  <span class="ad a2"><b>pensando</b><em>·</em><em>·</em><em>·</em></span>
  <span class="ad a3"><b>escrevendo</b></span>
  <span class="ad a4"><b>pronto</b><u>✓</u></span>
  <span class="ad a5"><b>diga isso</b></span>
  <p class="leg">Adesivos de estado: o app fala com o usuário em pílulas, no mesmo jeito da fala escrita.</p>
</div>"""

TILE_CARTAZ = f"""
<div class="tile escuro cartaz">
  <svg viewBox="0 0 1280 480" preserveAspectRatio="xMidYMid slice" aria-label="Banner com ondinhas e a fala escrita">
    <rect width="1280" height="480" fill="#1A1B1E"/>
    {ondas_quadradas(260, 240, 190, 130, 3.2, 8, 6, LOGO + "simbolo-fundo-escuro.svg")}
    <image href="{PAL('branco')}" x="520" y="92" width="250" height="44" preserveAspectRatio="xMinYMid meet"/>
  </svg>
  <div class="cx">
    {pilula(av("E", "#fff", "#1A1B1E"), "Como você lidaria com um prazo que não fecha?", "p2")}
    {pilula(GATO_AV, 'Fale do <mark>risco primeiro</mark>, depois do <mark>plano</mark>.', "p4")}
  </div>
  <p class="leg">Os três juntos: ondinhas que perdem cor, a fala escrita em pílulas e a palavra TekaFlow.</p>
</div>"""

TILES = [
    ("Fala em pílulas", "Referência: Wordibly, Human", TILE_FALA),
    ("Letra em bolinha", "Referência: Wordibly", TILE_BOLINHAS),
    ("Ondinhas que perdem cor", "Referência: Hearing Australia, sem o relevo", TILE_ONDAS),
    ("A letra como cartaz", "Referência: Pentagram, Wonda", TILE_LETRA),
    ("Adesivos de estado", "Referência: Wordibly", TILE_ADESIVOS),
    ("Os três juntos", "Composição", TILE_CARTAZ),
]


def tile_html(i, nome, ref, corpo):
    larga = " larga" if i in (4, 5) else ""
    return f'<article class="cartao{larga}"><h3>{esc(nome)}<small>{esc(ref)}</small></h3>{corpo}</article>'


aplicados = "".join(tile_html(i, *t) for i, t in enumerate(TILES))


def sec_esc(n, t, ideia, fotos):
    return (f'<section class="ref"><div class="txt"><span class="n">{n}</span><h2>{esc(t)}</h2><p>{esc(ideia)}</p></div>'
            f'<div class="fotos">{"".join(fig(*f) for f in fotos)}</div></section>')


refs = "".join(sec_esc(*c) for c in ESCOLHIDOS)
guard = "".join(f'<details><summary>{esc(t)}</summary><div class="fotos g">{"".join(fig(*f) for f in fs)}</div></details>' for t, fs in GUARDADOS)
fontes = "".join(f'<li><a href="{u}" target="_blank" rel="noopener">{esc(n)}</a></li>' for n, u in FONTES.values())
total = sum(len(c[3]) for c in ESCOLHIDOS) + sum(len(g[1]) for g in GUARDADOS)

html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Moodboard de grafismos</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@500,600,700&display=swap">
<style>
:root{{--bg:#1A1B1E;--card:#25262A;--tx:#fff;--mu:#9a9b9f;--lim:#C5EF6B;--azul:#5BC0FF;--linha:#35363b;--fd:'Chillax',system-ui,sans-serif}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--tx);font:15px/1.55 -apple-system,system-ui,sans-serif;padding:40px 40px 80px;max-width:1400px;margin-inline:auto}}
h1{{font-size:28px;margin:0 0 6px;letter-spacing:-.01em}} .sub{{color:var(--mu);margin:0 0 32px;max-width:780px}}
.escolha{{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 44px}} .escolha span{{padding:6px 14px;border-radius:999px;border:1px solid var(--linha);font-size:13px;color:#d6d7da}} .escolha .sim{{border-color:var(--lim);color:var(--lim)}} .escolha .nao{{text-decoration:line-through;color:var(--mu)}}
h2.bloco{{font-size:20px;margin:0 0 4px}} .bloco-sub{{color:var(--mu);margin:0 0 18px;font-size:14px}}
.aplicados{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:64px}}
.cartao{{background:var(--card);border-radius:16px;padding:14px 14px 16px}} .cartao.larga{{grid-column:span 2}}
.cartao h3{{margin:0 0 10px;font-size:14px;font-weight:600;display:flex;justify-content:space-between;gap:10px;align-items:baseline}} .cartao h3 small{{font-weight:400;color:var(--mu);font-size:12px}}
.tile{{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:8/5}} .cartao.larga .tile{{aspect-ratio:16/6}}
.tile .leg{{position:absolute;left:14px;right:14px;bottom:10px;margin:0;font-size:12px;opacity:.75;line-height:1.35}}
.escuro{{background:#1A1B1E;color:#fff}} .limao{{background:#C5EF6B;color:#1A1B1E}} .claro{{background:#fff;color:#1A1B1E}}
/* pílulas */
.pil{{display:flex;align-items:center;gap:10px;border-radius:999px;padding:7px 18px 7px 7px;font-family:var(--fd);font-weight:500;font-size:16px;width:fit-content;max-width:100%}}
.av{{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:600 14px var(--fd);font-style:normal}} .av img{{display:block}}
.av.gato{{background:#1A1B1E;overflow:hidden}}
.pilulas{{position:absolute;left:22px;right:22px;top:22px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}}
.p1{{border:1.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.28)}} .p2{{border:1.5px solid rgba(255,255,255,.3);color:rgba(255,255,255,.45);margin-left:34px}}
.p3{{border:1.5px solid rgba(255,255,255,.55);color:rgba(255,255,255,.78)}} .p4{{background:#C5EF6B;color:#1A1B1E;margin-left:34px;font-weight:600}}
mark{{background:#5BC0FF;color:#1A1B1E;border-radius:6px;padding:0 6px}}
/* bolinhas */
.bol .c{{position:absolute;width:var(--s);height:var(--s);border-radius:50%;display:grid;place-items:center;font-style:normal;overflow:hidden}} .bol .c img{{width:100%;height:100%}} .bol .c.gt img{{width:72%;height:72%}} .av.gato img{{width:78%;height:78%;margin-top:2px}}
.bol .c.l{{font:600 calc(var(--s)*.5) var(--fd)}}
/* ondas */
.ondas svg,.cartaz svg{{position:absolute;inset:0;width:100%;height:100%}}
/* letra */
.letra .gigante{{position:absolute;left:-14px;bottom:-64px;font:700 330px/1 var(--fd);color:#C5EF6B;letter-spacing:-.04em}} .letra .flow{{position:absolute;right:28px;top:20px;font:600 40px var(--fd);color:#fff}}
.letra .leg{{background:#1A1B1E;padding:6px 10px;border-radius:8px;right:auto;opacity:.9}} .letra .solta{{position:absolute;right:30px;bottom:58px;background:#fff;color:#1A1B1E;font-weight:600}}
/* adesivos */
.ades .ad{{position:absolute;display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 20px;font:600 20px var(--fd);box-shadow:0 1px 0 rgba(0,0,0,.08)}}
.ades .ad b{{font-weight:600}} .ades .ad em{{font-style:normal}} .ades .ad u{{text-decoration:none}}
.a1{{left:7%;top:12%;background:#C5EF6B;transform:rotate(-6deg);padding-left:8px}} .a2{{left:42%;top:8%;background:#1A1B1E;color:#fff;transform:rotate(4deg)}} .a3{{left:60%;top:34%;background:#5BC0FF;transform:rotate(-3deg)}}
.a4{{left:12%;top:46%;background:#fff;border:2px solid #1A1B1E;transform:rotate(5deg)}} .a5{{left:38%;top:58%;background:#C5EF6B;transform:rotate(-4deg)}}
/* cartaz */
.cartaz .cx{{position:absolute;left:41%;top:40%;display:flex;flex-direction:column;gap:10px;align-items:flex-start}}
.cartaz .p2{{margin-left:0}} .cartaz .p4{{margin-left:26px}}
/* referências */
.ref{{display:grid;grid-template-columns:260px 1fr;gap:30px;padding:34px 0;border-top:1px solid var(--linha)}} .n{{font-size:13px;color:var(--lim)}} .ref h2{{margin:2px 0 10px;font-size:20px}} .txt{{position:sticky;top:24px;align-self:start}} .txt p{{margin:0;color:#d6d7da;font-size:14px}}
.fotos{{columns:3 220px;column-gap:14px}}
figure{{margin:0 0 14px;break-inside:avoid;background:var(--card);border-radius:12px;overflow:hidden;cursor:zoom-in}} figure img{{display:block;width:100%;height:auto}}
figcaption{{padding:9px 12px 11px;font-size:12px;color:var(--mu);display:flex;flex-direction:column;gap:2px}} figcaption b{{color:#e7e8ea;font-weight:500}}
details{{border-top:1px solid var(--linha);padding:14px 0}} summary{{cursor:pointer;color:#d6d7da;font-size:14px}} .fotos.g{{margin-top:14px;columns:4 200px}}
.fontes{{margin-top:40px;border-top:1px solid var(--linha);padding-top:24px;color:var(--mu);font-size:13px}} .fontes ul{{columns:3 240px;padding-left:18px}} .fontes a{{color:var(--mu)}}
/* ampliar */
#ampliar{{position:fixed;inset:0;background:rgba(10,10,12,.94);display:none;z-index:50;align-items:center;justify-content:center;flex-direction:column;gap:12px;padding:24px;cursor:zoom-out}} #ampliar.on{{display:flex}}
#ampliar img{{max-width:min(1400px,94vw);max-height:80vh;object-fit:contain;border-radius:10px}} #ampliar p{{margin:0;color:#d6d7da;font-size:14px;text-align:center}} #ampliar a{{color:var(--lim)}}
@media(max-width:900px){{.aplicados{{grid-template-columns:1fr}} .cartao.larga{{grid-column:auto}} .ref{{grid-template-columns:1fr}} .txt{{position:static}}}}
</style></head><body>
<h1>Grafismos do TekaFlow: o que você escolheu, aplicado</h1>
<p class="sub">Três caminhos ficaram: a fala escrita, o som em círculos que perdem cor e a letra como grafismo. Os dois pontos que viram rosto saíram. Abaixo, cada conceito aplicado ao TekaFlow, e depois as {total} referências reais de onde eles vêm. Clique em qualquer imagem para ampliar.</p>
<div class="escolha"><span class="sim">01 A fala escrita</span><span class="sim">02 O som em ondinhas que perdem cor</span><span class="sim">03 A letra como grafismo</span><span class="nao">Dois pontos viram um rosto</span></div>

<h2 class="bloco">Aplicado ao TekaFlow</h2>
<p class="bloco-sub">Primeira leitura dos três conceitos com as cores e a fonte da marca. O desenho é rascunho: serve para você dizer o que mantém.</p>
<div class="aplicados">{aplicados}</div>

<h2 class="bloco">Referências dos caminhos escolhidos</h2>
<p class="bloco-sub">Estudos de caso reais, feitos por gente.</p>
{refs}

<h2 class="bloco" style="margin-top:40px">Guardados</h2>
<p class="bloco-sub">Os outros caminhos continuam aqui, caso voltem.</p>
{guard}

<div class="fontes"><b>Fontes dos estudos de caso</b><ul>{fontes}</ul></div>

<div id="ampliar"><img alt=""><p></p></div>
<script>
const box=document.getElementById('ampliar'),im=box.querySelector('img'),tx=box.querySelector('p');
document.querySelectorAll('figure[data-img]').forEach(f=>f.addEventListener('click',()=>{{im.src=f.dataset.img;tx.innerHTML=f.dataset.leg+' · <a href="'+f.dataset.url+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+f.dataset.src+'</a>';box.classList.add('on')}}));
box.addEventListener('click',()=>box.classList.remove('on'));addEventListener('keydown',e=>{{if(e.key==='Escape')box.classList.remove('on')}});
</script>
</body></html>"""
open("moodboard-grafismos.html", "w").write(html)
print(total, "referências,", len(TILES), "conceitos")
