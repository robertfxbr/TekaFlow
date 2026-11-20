// Modelos Whisper locais: baixar do Hugging Face, guardar na pasta do app e transcrever com o whisper.cpp.
const { app } = require("electron")
const fs = require("node:fs")
const path = require("node:path")
const { execFile } = require("node:child_process")

const BASE = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/"
const MODELOS = {
  small: { arquivo: "ggml-small-q5_1.bin", bytes: 190085487 },
  medium: { arquivo: "ggml-medium-q5_0.bin", bytes: 539212467 },
  turbo: { arquivo: "ggml-large-v3-turbo-q5_0.bin", bytes: 574041195 },
  large: { arquivo: "ggml-large-v3-q5_0.bin", bytes: 1081140203 },
}
const pasta = () => path.join(app.getPath("userData"), "modelos")
const caminho = (id) => path.join(pasta(), MODELOS[id].arquivo)
const motor = () => ["/opt/homebrew/bin/whisper-cli", "/usr/local/bin/whisper-cli"].find((p) => fs.existsSync(p)) || null

const baixando = new Map() // id -> AbortController

function status() {
  const modelos = {}
  for (const id of Object.keys(MODELOS)) {
    const f = caminho(id)
    modelos[id] = { baixado: fs.existsSync(f) && fs.statSync(f).size === MODELOS[id].bytes, baixando: baixando.has(id) }
  }
  return { motor: Boolean(motor()), modelos }
}

async function baixar(id, avisar) {
  if (!MODELOS[id] || baixando.has(id)) return
  fs.mkdirSync(pasta(), { recursive: true })
  const destino = caminho(id)
  const parcial = destino + ".part"
  const ctl = new AbortController()
  baixando.set(id, ctl)
  try {
    const r = await fetch(BASE + MODELOS[id].arquivo, { signal: ctl.signal })
    if (!r.ok) throw new Error(`O servidor respondeu ${r.status}.`)
    const total = Number(r.headers.get("content-length")) || MODELOS[id].bytes
    const out = fs.createWriteStream(parcial)
    let lido = 0, ultimo = 0
    for await (const pedaco of r.body) {
      out.write(pedaco)
      lido += pedaco.length
      const pct = Math.floor((lido / total) * 100)
      if (pct !== ultimo) { ultimo = pct; avisar({ id, pct }) }
    }
    await new Promise((ok) => out.end(ok))
    if (fs.statSync(parcial).size !== MODELOS[id].bytes) throw new Error("O arquivo baixou incompleto.")
    fs.renameSync(parcial, destino)
    avisar({ id, pct: 100 })
  } catch (e) {
    fs.rm(parcial, () => {})
    avisar({ id, erro: ctl.signal.aborted ? null : (e.message || "Falhou o download.") })
  } finally {
    baixando.delete(id)
  }
}

const cancelar = (id) => baixando.get(id)?.abort()
const apagar = (id) => { try { fs.rmSync(caminho(id), { force: true }) } catch {} }

/** Transcreve um WAV com o modelo escolhido. Devolve { ok, texto } ou { ok:false, erro }. */
function transcrever(wav, id) {
  const bin = motor()
  if (!bin) return Promise.resolve({ ok: false, erro: "O motor do Whisper não está instalado. No terminal: brew install whisper-cpp" })
  if (!MODELOS[id] || !fs.existsSync(caminho(id))) return Promise.resolve({ ok: false, erro: "O modelo ainda não foi baixado." })
  return new Promise((resolve) =>
    execFile(bin, ["-m", caminho(id), "-f", wav, "-l", "pt", "-nt", "-np"], { timeout: 120000, maxBuffer: 4 * 1024 * 1024 }, (e, out) => {
      if (e) return resolve({ ok: false, erro: "O Whisper não conseguiu transcrever." })
      resolve({ ok: true, texto: out.replace(/\[[^\]]*\]/g, "").trim() })
    })
  )
}

module.exports = { MODELOS, status, baixar, cancelar, apagar, transcrever }
