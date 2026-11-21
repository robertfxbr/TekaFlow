"""Gera marca/animacoes-gato.html: as animações do gato por estado, ao vivo, com o motor real do app.
Antes, compile o motor: (cd ../design-system && npx tsc src/lib/gato-animacao.ts --ignoreConfig --outDir <pasta> --target es2022 --module esnext --skipLibCheck)
Rode da pasta marca/: python3 _construcao/animacoes-gato.py <pasta>/gato-animacao.js"""
import sys, pathlib
motor = pathlib.Path(sys.argv[1]).read_text().replace("export const ", "const ").replace("export function ", "function ").replace("export type", "//")

CARDS = [
    ("Idle", "idle", {"bocaRepouso": [1, 1.7, 1]},
     "O padrão onde há logo. Sorri com os olhos em arco, respira de leve e segue o mouse com os olhos, devagar e com um pequeno atraso. De tempos em tempos pisca, abre os olhos, pisca duas vezes e volta a sorrir. A boca é a da logo.",
     "Toda logo com o gato, como a da tela 1, no repouso."),
    ("Parado", "idle", {"bocaRepouso": [1, 1.7, 1], "parado": True},
     "Sorrindo e quieto: sem piscar, sem respirar, sem passear o olhar. Só se mexe quando fala.",
     "Gato do “sugiro dizer”, depois que a sugestão termina."),
    ("Falando", "falando", {"bocaRepouso": [1, 1.7, 1]},
     "Os olhos abertos, mais juntos, e a boca em risquinhos. Pisca e mexe um pouco. A troca dos olhos acontece numa piscada.",
     "Logo da tela 1 e “sugiro dizer”, enquanto o texto é escrito."),
    ("Lendo", "lendo", {"bocaRepouso": [1, 1.7, 1]},
     "Como falando, com o olhar indo para onde alguém escreve.",
     "Disponível no motor, para acompanhar um texto na tela."),
    ("Pensando e escrevendo", "pensando", {"bocaRepouso": [1, 1.7, 1]},
     "O loading padrão. O gato fica estático: só os olhos e a boca se mexem. Os olhos abertos piscam normalmente de vez em quando e passeiam para cima e para os lados, e os pontinhos da boca crescem em onda.",
     "Quando o app pensa ou escreve."),
]
cards_html = "".join(
    f'<article class="card"><div class="gato" id="g{i}"></div><h3>{t}</h3><p>{d}</p><p class="onde"><b>Onde:</b> {o}</p></article>'
    for i, (t, e, op, d, o) in enumerate(CARDS))
cards_js = ",".join(f'["g{i}","{e}",{str(op).replace("True","true").replace("False","false")}]' for i, (t, e, op, d, o) in enumerate(CARDS))

html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TekaFlow · Animações do gato</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&display=swap">
<style>
:root{{--bg:#1A1B1E;--sup:#25262A;--lim:#C5EF6B;--azul:#5BC0FF;--tx:#fff;--mu:#A3A4A8;--fd:'Chillax',system-ui,sans-serif}}
*{{box-sizing:border-box;margin:0}}
body{{background:var(--bg);color:var(--tx);font:15px/1.55 -apple-system,system-ui,sans-serif;padding:40px;max-width:1180px;margin-inline:auto}}
h1{{font:600 30px var(--fd);letter-spacing:-.01em}} .sub{{color:var(--mu);margin:6px 0 36px;max-width:680px}}
h2{{font:600 20px var(--fd);margin:44px 0 6px}} .nota{{color:var(--mu);margin:0 0 16px;max-width:680px}}
.palco{{background:var(--sup);border-radius:24px;display:grid;grid-template-columns:320px 1fr;gap:32px;padding:32px;align-items:center}}
.palco .vitrine{{position:relative;height:280px;display:grid;place-items:center;overflow:hidden;border-radius:16px;background:var(--bg)}}
.palco .vitrine svg.ondas{{position:absolute;left:50%;top:50%;width:560px;height:560px;transform:translate(-50%,-50%);overflow:visible;pointer-events:none}}
.palco .gato{{position:relative;width:120px;height:120px}}
.botoes{{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}} button{{font:inherit;color:var(--tx);background:transparent;border:1px solid #4d4e53;border-radius:999px;padding:8px 16px;cursor:pointer}}
button:hover{{border-color:var(--tx)}} button.on{{background:var(--lim);border-color:var(--lim);color:var(--bg)}}
.ler{{color:var(--mu);font-size:14px;max-width:520px}} .ler b{{color:var(--tx);font-weight:600}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}}
.card{{background:var(--sup);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:8px}}
.card .gato{{width:96px;height:96px;margin-bottom:8px}} .card h3{{font:600 18px var(--fd)}} .card p{{color:#d6d7da;font-size:14px}} .card .onde{{color:var(--mu);margin-top:auto;padding-top:8px}} .card .onde b{{color:var(--lim);font-weight:600}}
.gato svg{{width:100%;height:100%;display:block;color:var(--lim)}}
.ondas-regras{{display:grid;grid-template-columns:1fr 1fr;gap:16px}} .ondas-regras .card p b{{color:var(--lim)}}
.rod{{margin-top:44px;color:var(--mu);font-size:14px}} a{{color:var(--lim)}}
@media(max-width:860px){{.palco{{grid-template-columns:1fr}} .ondas-regras{{grid-template-columns:1fr}}}}
</style></head><body>
<h1>Animações do gato, por estado</h1>
<p class="sub">Tudo aqui roda ao vivo, com o mesmo motor que o aplicativo usa. Em cima, um gato para você trocar de estado. Embaixo, cada estado parado no seu lugar, com o que ele faz e onde aparece.</p>

<h2>Experimente</h2>
<p class="nota">Troque o estado e veja a transição, os olhos trocando numa piscada e as ondas acelerando quando ele fala.</p>
<div class="palco">
  <div class="vitrine"><svg class="ondas" id="ondas" viewBox="-300 -300 600 600" aria-hidden="true"></svg><div class="gato" id="palco"></div></div>
  <div>
    <div class="botoes" id="estados">
      <button data-e="idle" class="on">Idle</button><button data-e="parado">Parado</button><button data-e="falando">Falando</button>
      <button data-e="lendo">Lendo</button><button data-e="pensando">Pensando e escrevendo</button>
    </div>
    <p class="ler" id="leitura"></p>
  </div>
</div>

<h2>Os estados do gato</h2>
<p class="nota">O motor é <code>gato-animacao.ts</code> e o componente é <code>GatoAnimado</code>. A boca de repouso é a da logo, com três barras.</p>
<div class="grade">{cards_html}</div>

<h2>As ondas em quadradinho</h2>
<p class="nota">Saem do gato da logo, no formato do ícone, e perdem a cor: limão, azul céu, sumir. Mudam de ritmo conforme o gato fala.</p>
<div class="ondas-regras">
  <article class="card"><h3>Parado</h3><p>Lentas e fracas: uma volta a cada <b>16 segundos</b>, opacidade máxima de <b>4,5%</b>.</p></article>
  <article class="card"><h3>Falando ou pensando</h3><p>Mais rápidas e mais presentes: uma volta a cada <b>5,4 segundos</b>, opacidade máxima de <b>13,5%</b>, com um fade curto de cerca de meio segundo na troca.</p></article>
</div>

<h2>Guardados</h2>
<p class="nota">As outras onze opções de loading que a gente olhou estão guardadas em <a href="rascunhos/loading-gato-opcoes.html">rascunhos/loading-gato-opcoes.html</a>. O escolhido foi o dos pontinhos na boca.</p>

<p class="rod">Código: <code>design-system/src/lib/gato-animacao.ts</code>, <code>components/gato-animado.tsx</code> e <code>prototipo/telas/chegar-grafismos.tsx</code>. Resumo da marca em <a href="consolidado.md">consolidado.md</a>.</p>

<script>
{motor}

const REDUZIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
let n = 0;
function desenhar(el) {{
  const id = 'm' + (++n);
  el.innerHTML = '<svg viewBox="3 2.9 10 10" role="img" aria-label="Gato do TekaFlow"><defs><mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#000"/><g transform="translate(0 .25)"><path d="' + CABECA_GATO + '" fill="#fff" stroke="#fff" stroke-width=".5" stroke-linejoin="round"/><path d="M4.95 5.8L5.05 4.8L6.15 5.4Z" fill="#000" stroke="#000" stroke-width=".25" stroke-linejoin="round"/><path d="M11.05 5.8L10.95 4.8L9.85 5.4Z" fill="#000" stroke="#000" stroke-width=".25" stroke-linejoin="round"/><rect data-gato="oE" fill="#000"/><rect data-gato="oD" fill="#000"/><path data-gato="aE" fill="none" stroke="#000" stroke-width=".55" stroke-linecap="round"/><path data-gato="aD" fill="none" stroke="#000" stroke-width=".55" stroke-linecap="round"/><rect data-gato="b0" fill="#000"/><rect data-gato="b1" fill="#000"/><rect data-gato="b2" fill="#000"/></g></mask></defs><g data-gato="corpo"><rect width="16" height="16" fill="currentColor" mask="url(#' + id + ')"/></g></svg>';
  return el.firstElementChild;
}}
const BOCA = [1, 1.7, 1];
const estadoDe = (e) => e === 'parado' ? 'idle' : e;

// cartões
[{cards_js}].forEach(([id, e, op]) => {{
  const c = criarGato(desenhar(document.getElementById(id)), REDUZIR, op);
  c.ir(e);
}});

// palco interativo
let ctrl, estado = 'idle';
function montarPalco() {{
  if (ctrl) ctrl.destruir();
  ctrl = criarGato(desenhar(document.getElementById('palco')), REDUZIR, {{ bocaRepouso: BOCA, parado: estado === 'parado' }});
  ctrl.ir(estadoDe(estado));
}}
const TEXTOS = {{
  idle: '<b>Idle.</b> Sorri com os olhos em arco e segue o mouse devagar, com um pequeno atraso: mexa o cursor perto do gato. De tempos em tempos pisca, abre os olhos, pisca duas vezes e volta a sorrir. As ondas ficam lentas e fracas.',
  parado: '<b>Parado.</b> Sorrindo, sem piscar nem respirar. As ondas ficam lentas e fracas.',
  falando: '<b>Falando.</b> Olhos abertos e boca em risquinhos. As ondas aceleram e ficam mais presentes.',
  lendo: '<b>Lendo.</b> Como falando, com o olhar indo para onde alguém escreve.',
  pensando: '<b>Pensando e escrevendo.</b> O loading padrão. O gato fica estático, só os olhos e a boca se mexem. As ondas aceleram.'
}};
function ir(e) {{
  const antesParado = estado === 'parado';
  estado = e;
  document.querySelectorAll('#estados button').forEach(b => b.classList.toggle('on', b.dataset.e === e));
  document.getElementById('leitura').innerHTML = TEXTOS[e];
  if ((e === 'parado') !== antesParado) montarPalco(); else ctrl.ir(estadoDe(e));
}}
document.querySelectorAll('#estados button').forEach(b => b.onclick = () => ir(b.dataset.e));
montarPalco(); ir('idle');

// ondas em quadradinho, as mesmas do app
const LIM = '#C5EF6B', AZ = '#5BC0FF', SUP = '#25262A';
const mist = (a, b, k) => a + (b - a) * k;
const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const cor = (a, b, k) => {{ const A = hx(a), B = hx(b); return 'rgb(' + A.map((v, i) => Math.round(mist(v, B[i], k))).join(' ') + ')'; }};
const svg = document.getElementById('ondas');
const aneis = [];
for (let i = 0; i < 6; i++) {{
  const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  r.setAttribute('x', -60); r.setAttribute('y', -60); r.setAttribute('width', 120); r.setAttribute('height', 120); r.setAttribute('rx', 34);
  r.setAttribute('fill', 'none'); r.setAttribute('vector-effect', 'non-scaling-stroke'); r.setAttribute('opacity', 0);
  svg.appendChild(r); aneis.push(r);
}}
let fase = 0, vel = 1 / 16, forca = .5, antes = performance.now();
(function quadro(agora) {{
  const dt = Math.min(.05, (agora - antes) / 1000); antes = agora;
  const rapido = ['falando', 'lendo', 'pensando'].includes(estado);
  vel += ((rapido ? 1 / 5.4 : 1 / 16) - vel) * (1 - Math.exp(-2.5 * dt));
  forca += ((rapido ? 1.5 : .5) - forca) * (1 - Math.exp(-7 * dt));
  fase += vel * dt;
  aneis.forEach((el, i) => {{
    const p = (fase + i / 6) % 1;
    const o = p < .1 ? mist(0, .09, p / .1) : p < .55 ? mist(.09, .05, (p - .1) / .45) : mist(.05, 0, (p - .55) / .45);
    const c = p < .25 ? LIM : p < .6 ? cor(LIM, AZ, (p - .25) / .35) : cor(AZ, SUP, (p - .6) / .4);
    el.setAttribute('transform', 'scale(' + mist(1, 9, p).toFixed(3) + ')');
    el.setAttribute('opacity', (o * forca).toFixed(4));
    el.setAttribute('stroke', c);
    el.setAttribute('stroke-width', (p < .5 ? mist(2.5, 1.5, p / .5) : mist(1.5, .75, (p - .5) / .5)).toFixed(2));
  }});
  if (!REDUZIR) requestAnimationFrame(quadro);
}})(antes);
</script>
</body></html>"""
open("animacoes-gato.html", "w").write(html)
print("ok", len(html) // 1000, "KB")
