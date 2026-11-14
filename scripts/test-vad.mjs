// Testes do detector de fala (src/audio/vad.mjs) com áudio sintético.
// Quadros de 1024 amostras a 16 kHz (64 ms), como manda o pcm-worklet;
// VAD_FRAME=128 testa o bloco cru do navegador.
import { createVad } from '../src/audio/vad.mjs';

const FRAME = Number(process.env.VAD_FRAME) || 1024; // o worklet junta 1024 amostras (64 ms)
const MS = FRAME / 16;
let failures = 0;
const check = (name, ok, extra = '') => { if (!ok) failures++; console.log(ok ? 'ok  ' : 'FAIL', name, ok ? '' : extra); };

// sinal: lista de [segundos, amplitude]; tom de 220 Hz quando amplitude > 0
function run(signal, opts) {
  const vad = createVad(opts);
  const flushes = [];
  let sent = 0;       // amostras mandadas desde o último flush
  let totalSent = 0;
  let t = 0;          // ms
  let n = 0;
  for (const [secs, amp] of signal) {
    const frames = Math.round((secs * 1000) / MS);
    for (let f = 0; f < frames; f++) {
      const x = new Float32Array(FRAME);
      for (let i = 0; i < FRAME; i++, n++) x[i] = amp ? amp * Math.sin((2 * Math.PI * 220 * n) / 16000) : 0.0005 * Math.sin(n);
      const r = vad.push(x);
      for (const c of r.send) { sent += c.length; totalSent += c.length; }
      t += MS;
      if (r.flush) { flushes.push({ atS: +(t / 1000).toFixed(2), audioS: +(sent / 16000).toFixed(2) }); sent = 0; }
    }
  }
  return { flushes, totalSentS: totalSent / 16000, pendingS: sent / 16000, pending: vad.pending() };
}

// 1. O bug: pausa longa e depois uma fala. Antes: 1º flush com 20 s de
//    silêncio + 8 ms de voz. Agora: um flush só, com a fala inteira.
{
  const r = run([[20, 0], [3, 0.05], [2, 0]]);
  check('pausa longa: um flush só', r.flushes.length === 1, JSON.stringify(r.flushes));
  const a = r.flushes[0]?.audioS ?? 0;
  check('pausa longa: só a fala vai (≈ 0,3 + 3 + 1,1 s)', a > 4.2 && a < 4.6, `audio=${a}`);
}

// 2. Muitos minutos de silêncio não mandam nada ao Whisper
{
  const r = run([[600, 0]]);
  check('10 min de silêncio: nada enviado', r.totalSentS === 0 && r.flushes.length === 0, JSON.stringify(r));
}

// 3. Pré-rolagem: o começo da fala vai junto (não come a 1ª sílaba)
{
  const r = run([[5, 0], [1, 0.05], [2, 0]]);
  const a = r.flushes[0]?.audioS ?? 0;
  check('pré-rolagem de 0,3 s antes da fala', a >= 2.35 && a <= 2.55, `audio=${a}`);
}

// 4. Duas falas separadas por pausa curta viram duas falas
{
  const r = run([[1, 0], [2, 0.05], [1.5, 0], [2, 0.05], [2, 0]]);
  check('duas falas: dois flushes', r.flushes.length === 2, JSON.stringify(r.flushes));
}

// 5. Pausa curta dentro da fala (0,5 s) não corta
{
  const r = run([[1, 0], [2, 0.05], [0.5, 0], [2, 0.05], [2, 0]]);
  check('respiração de 0,5 s não corta', r.flushes.length === 1, JSON.stringify(r.flushes));
}

// 6. Monólogo sem pausa: corta no teto de 15 s e não perde áudio
{
  const r = run([[40, 0.05], [2, 0]]);
  check('fala contínua de 40 s: cortes de 15 s', r.flushes.length === 3 && r.flushes[0].audioS <= 15.1, JSON.stringify(r.flushes));
  const total = r.flushes.reduce((s, f) => s + f.audioS, 0);
  check('fala contínua: nenhum áudio de fala perdido', total >= 40, `total=${total}`);
}

// 7. Fala longa com pausas entre palavras: corta numa pausa depois de 10 s
{
  const sig = [[0.5, 0]];
  for (let i = 0; i < 20; i++) sig.push([0.9, 0.05], [0.25, 0]);
  sig.push([2, 0]);
  const r = run(sig);
  const first = r.flushes[0];
  check('fala longa com pausas: corta na pausa, entre 10 e 15 s', first && first.audioS >= 10 && first.audioS < 15 && r.flushes.length >= 2, JSON.stringify(r.flushes));
}

// 8. Fala curta ("sim") passa do mínimo de 0,5 s do Whisper
{
  const r = run([[3, 0], [0.25, 0.05], [2, 0]]);
  check('"sim" curto vira um flush com > 0,5 s', r.flushes.length === 1 && r.flushes[0].audioS > 0.5, JSON.stringify(r.flushes));
}

// 9. Escuta parada no meio da fala: o áudio já foi enviado (o stop faz o flush)
{
  const r = run([[1, 0], [2, 0.05]]);
  check('fala em andamento fica pendente para o stop', r.pending && r.pendingS > 2, JSON.stringify(r));
}

console.log(failures ? `${failures} falha(s)` : 'PASS: detector de fala');
process.exit(failures ? 1 : 0);
