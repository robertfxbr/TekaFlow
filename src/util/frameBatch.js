// Texto que chega em pedaços (a resposta da IA): guarda só o valor mais novo
// e aplica no máximo uma vez por quadro de tela. A IA manda dezenas de
// pedaços por segundo; aplicar cada um redesenhava a tela a cada pedaço e a
// resposta terminava de aparecer segundos depois de chegar.
//
// Com a janela escondida o navegador pausa os quadros; o temporizador de
// reserva aplica mesmo assim. flush() aplica o que faltar na hora (fim da
// resposta), para o texto final nunca ficar para trás.
const FALLBACK_MS = 100;

export function frameBatch(apply) {
  let latest;
  let pending = false;
  let frame = 0;
  let timer = 0;
  const run = () => {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    frame = 0;
    timer = 0;
    if (!pending) return;
    pending = false;
    apply(latest);
  };
  return {
    push(value) {
      latest = value;
      pending = true;
      if (frame || timer) return;
      frame = requestAnimationFrame(run);
      timer = setTimeout(run, FALLBACK_MS);
    },
    flush: run,
  };
}
