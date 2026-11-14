// Copia o áudio do microfone/loopback para a página, numa thread de áudio
// dedicada. É um arquivo próprio porque a CSP do app (script-src 'self')
// não deixa carregar o módulo a partir de um blob:.
//
// O navegador entrega blocos de 128 amostras (8 ms a 16 kHz). Mandar cada
// um seria 125 mensagens por segundo por fonte, e cada uma vira um envio
// IPC para o Whisper. Junta 1024 amostras (64 ms) antes de mandar.
const BATCH = 1024;

class PcmWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(BATCH);
    this.len = 0;
  }

  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch || !ch.length) return true;
    let i = 0;
    while (i < ch.length) {
      const n = Math.min(BATCH - this.len, ch.length - i);
      this.buf.set(ch.subarray(i, i + n), this.len);
      this.len += n;
      i += n;
      if (this.len === BATCH) {
        // o buffer vai inteiro (transferido) e um novo começa
        this.port.postMessage(this.buf, [this.buf.buffer]);
        this.buf = new Float32Array(BATCH);
        this.len = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm-worklet', PcmWorklet);
