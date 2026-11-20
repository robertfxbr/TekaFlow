/** Detector de fala por energia, portado do original: separa a fala do silêncio e diz quando uma fala acabou. */
const TAXA = 16000
export const VAD = { limiar: 0.012, silencioMs: 700, preRolagemMs: 300, maximoMs: 15000 }

const ms = (amostras: number) => (amostras / TAXA) * 1000
export function rms(f: Float32Array): number { let s = 0; for (const x of f) s += x * x; return f.length ? Math.sqrt(s / f.length) : 0 }

/** A cada quadro devolve o que entra na fala em andamento e se ela acabou. */
export function criarVad() {
  let falando = false
  let falaMs = 0
  let silencioMs = 0
  let antes: Float32Array[] = []
  let antesMs = 0
  return {
    empurrar(quadro: Float32Array): { enviar: Float32Array[]; fim: boolean; comecou: boolean; nivel: number } {
      const duracao = ms(quadro.length)
      const nivel = rms(quadro)
      const alto = nivel > VAD.limiar
      if (!falando) {
        if (!alto) {
          antes.push(quadro); antesMs += duracao
          while (antes.length > 1 && antesMs - ms(antes[0].length) >= VAD.preRolagemMs) antesMs -= ms(antes.shift()!.length)
          return { enviar: [], fim: false, comecou: false, nivel }
        }
        falando = true; falaMs = antesMs; silencioMs = 0
        const enviar = [...antes, quadro]
        antes = []; antesMs = 0; falaMs += duracao
        return { enviar, fim: false, comecou: true, nivel }
      }
      falaMs += duracao
      silencioMs = alto ? 0 : silencioMs + duracao
      const fim = silencioMs >= VAD.silencioMs || falaMs >= VAD.maximoMs
      if (fim) { falando = false; falaMs = 0; silencioMs = 0 }
      return { enviar: [quadro], fim, comecou: false, nivel }
    },
  }
}
