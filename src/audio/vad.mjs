// Detector de fala por energia (VAD) de uma fonte de áudio (mic ou PC).
//
// Decide duas coisas a cada quadro de áudio:
//   - o que vai para o Whisper: só a fala, com um pouco de áudio antes
//     (pré-rolagem, para não comer a primeira sílaba) e o silêncio do fim.
//     Silêncio entre falas fica de fora.
//   - quando a fala acabou (flush): depois de um silêncio curto, ou quando a
//     fala fica longa demais.
//
// Antes, todo o áudio ia para o Whisper e o limite de 15 s contava a partir
// do último flush. Depois de uma pausa longa, a primeira fala disparava o
// limite no primeiro quadro: o Whisper recebia todo o silêncio da pausa
// (até 8 min) mais 8 ms de voz, alucinava em cima do silêncio, gastava CPU,
// e a fala de verdade perdia o começo.
//
// O tempo é contado pelas amostras recebidas, não pelo relógio, para o
// comportamento não depender de atraso no processamento.

export const VAD_DEFAULTS = {
  sampleRate: 16000,
  threshold: 0.012,   // RMS mínimo para contar como fala
  silenceMs: 1100,    // silêncio que encerra a fala
  preRollMs: 300,     // áudio guardado antes do início da fala
  softMaxMs: 10000,   // fala longa: corta na próxima pausa curta...
  softPauseMs: 200,   // (pausa entre palavras, não a queda de energia de uma consoante)
  hardMaxMs: 15000,   // ...ou aqui, mesmo sem pausa
};

export function rmsOf(float) {
  let sum = 0;
  for (let i = 0; i < float.length; i++) sum += float[i] * float[i];
  return float.length ? Math.sqrt(sum / float.length) : 0;
}

export function createVad(options = {}) {
  const o = { ...VAD_DEFAULTS, ...options };
  const msOf = (samples) => (samples / o.sampleRate) * 1000;
  let inSpeech = false;  // há fala desde o último flush
  let speechMs = 0;      // duração do trecho em andamento (com pausas internas)
  let silenceMs = 0;     // silêncio desde o último quadro de voz
  let preRoll = [];      // quadros recentes de silêncio, antes da fala
  let preRollMs = 0;

  // Devolve { send: [Float32Array...], flush: boolean, rms }
  function push(float) {
    const frameMs = msOf(float.length);
    const rms = rmsOf(float);
    const loud = rms > o.threshold;
    const send = [];
    let flush = false;

    if (!inSpeech) {
      if (!loud) {
        // Silêncio entre falas: só guarda o finalzinho
        preRoll.push(float);
        preRollMs += frameMs;
        while (preRoll.length > 1 && preRollMs - msOf(preRoll[0].length) >= o.preRollMs) {
          preRollMs -= msOf(preRoll.shift().length);
        }
        return { send, flush, rms };
      }
      // Começo de fala: manda a pré-rolagem junto
      inSpeech = true;
      speechMs = preRollMs;
      silenceMs = 0;
      send.push(...preRoll);
      preRoll = [];
      preRollMs = 0;
    }

    send.push(float);
    speechMs += frameMs;
    if (loud) silenceMs = 0;
    else silenceMs += frameMs;

    if (silenceMs >= o.silenceMs) flush = true;                 // a fala acabou
    else if (speechMs >= o.hardMaxMs) flush = true;             // longa demais
    else if (speechMs >= o.softMaxMs && silenceMs >= o.softPauseMs) flush = true; // longa: corta na pausa
    if (flush) reset();
    return { send, flush, rms };
  }

  // Fala pendente (sem flush ainda)?
  function pending() { return inSpeech; }

  function reset() {
    inSpeech = false;
    speechMs = 0;
    silenceMs = 0;
    preRoll = [];
    preRollMs = 0;
  }

  return { push, pending, reset };
}
