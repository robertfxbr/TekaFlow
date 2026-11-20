/** Gravação de voz do app real: abre o microfone escolhido e devolve um WAV de 16 kHz, mono, 16 bits. */
async function acharMicrofone(): Promise<string | undefined> {
  const config = await window.api!.lerConfig()
  const nome = typeof config.microfone === "string" ? config.microfone.trim() : ""
  if (!nome) return undefined
  const entradas = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput")
  return (entradas.find((d) => d.label === nome) ?? entradas.find((d) => d.label && (d.label.includes(nome) || nome.includes(d.label))))?.deviceId
}

export type Gravacao = { parar: () => Promise<ArrayBuffer>; /** Volume agora, de 0 a 1. */ nivel: () => number; /** O maior volume da gravação inteira, de 0 a 1. */ pico: () => number; descartar: () => void; /** Devolve o que foi gravado até agora e recomeça do zero, sem fechar o microfone. */ cortar: () => ArrayBuffer }

/** Fala em WAV de 16 kHz, mono, 16 bits. */
export function empacotarWav(pedacos: Float32Array[]): ArrayBuffer {
  const total = pedacos.reduce((n, p) => n + p.length, 0)
  const buf = new ArrayBuffer(44 + total * 2)
  const v = new DataView(buf)
  const txt = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  txt(0, "RIFF"); v.setUint32(4, 36 + total * 2, true); txt(8, "WAVE"); txt(12, "fmt "); v.setUint32(16, 16, true)
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 16000, true); v.setUint32(28, 32000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  txt(36, "data"); v.setUint32(40, total * 2, true)
  let o = 44
  for (const p of pedacos) for (const x of p) { v.setInt16(o, Math.max(-1, Math.min(1, x)) * 0x7fff, true); o += 2 }
  return buf
}

/** `origem`: "mic" abre o microfone escolhido; "sistema" pega o som do computador (os outros na chamada). */
export async function iniciarGravacao(fonte: "mic" | "sistema" = "mic", aoQuadro?: (dados: Float32Array) => void): Promise<Gravacao> {
  let stream: MediaStream
  if (fonte === "sistema") {
    const tela = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    tela.getVideoTracks().forEach((t) => t.stop())
    if (tela.getAudioTracks().length === 0) throw new Error("sem som do sistema")
    stream = new MediaStream(tela.getAudioTracks())
  } else {
    const deviceId = await acharMicrofone()
    stream = await navigator.mediaDevices.getUserMedia({ audio: { ...(deviceId ? { deviceId: { exact: deviceId } } : {}), echoCancellation: false, noiseSuppression: false } })
  }
  const ac = new AudioContext({ sampleRate: 16000 })
  await ac.resume().catch(() => {})
  const origem = ac.createMediaStreamSource(stream)
  const no = ac.createScriptProcessor(2048, 1, 1)
  let pedacos: Float32Array[] = []
  let agora = 0
  let maior = 0
  no.onaudioprocess = (e) => {
    const dados = new Float32Array(e.inputBuffer.getChannelData(0))
    if (aoQuadro) aoQuadro(dados)
    else pedacos.push(dados)
    let soma = 0
    for (const x of dados) { soma += x * x; if (Math.abs(x) > maior) maior = Math.abs(x) }
    agora = Math.min(1, Math.sqrt(soma / dados.length) * 5)
  }
  origem.connect(no)
  no.connect(ac.destination)
  const encerrar = async () => {
    origem.disconnect()
    no.disconnect()
    stream.getTracks().forEach((t) => t.stop())
    await ac.close().catch(() => {})
  }
  return {
    nivel: () => agora,
    pico: () => maior,
    descartar: () => void encerrar(),
    cortar: () => { const wav = empacotarWav(pedacos); pedacos = []; maior = 0; return wav },
    parar: async () => {
      origem.disconnect()
      no.disconnect()
      stream.getTracks().forEach((t) => t.stop())
      await ac.close().catch(() => {})
      return empacotarWav(pedacos)
    },
  }
}
