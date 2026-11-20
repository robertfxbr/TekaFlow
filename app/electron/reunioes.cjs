// Salva cada reunião em disco, aos poucos, só acrescentando. Nada da transcrição se perde.
// Pasta: ~/Documents/TekaFlow/Reuniões/AAAA-MM-DD HH-MM Título/
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const crypto = require("node:crypto")

const RAIZ = path.join(os.homedir(), "Documents", "TekaFlow", "Reuniões")
const PASSO = 60 * 1000

const dois = (n) => String(n).padStart(2, "0")
const relogio = (ms) => `${dois(Math.floor(ms / 60000))}:${dois(Math.floor((ms % 60000) / 1000))}`

function criarReunioes(banco) {
  /** Reuniões abertas agora, por id. */
  const abertas = new Map()

  const gravarJson = (r) => fs.writeFileSync(path.join(r.pasta, "reuniao.json"), JSON.stringify(r.dados, null, 2))
  /** Abre o arquivo, grava e fecha: o que foi dito já está no disco. */
  const acrescentar = (r, arquivo, linha) => fs.appendFileSync(path.join(r.pasta, arquivo), JSON.stringify(linha) + "\n")

  function refazerLegivel(r) {
    const arq = path.join(r.pasta, "transcricao.jsonl")
    if (!fs.existsSync(arq)) return
    const linhas = fs.readFileSync(arq, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
    fs.writeFileSync(path.join(r.pasta, "transcricao.md"), linhas.map((l) => `[${relogio(l.t)}] ${l.quem}: ${l.texto}`).join("\n") + "\n")
  }

  function salvarAgora(r) {
    r.dados.duracaoMs = Date.now() - r.dados.inicio
    refazerLegivel(r)
    gravarJson(r)
  }

  function iniciar({ titulo, transcricao, modelo, contexto }) {
    const id = crypto.randomUUID()
    const inicio = Date.now()
    const d = new Date(inicio)
    const nome = titulo || "Reunião"
    const pasta = path.join(RAIZ, `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())} ${dois(d.getHours())}-${dois(d.getMinutes())} ${nome.replace(/[\\/:]/g, "-")}`)
    fs.mkdirSync(pasta, { recursive: true })
    const r = { id, pasta, dados: { id, titulo: nome, inicio, fim: null, duracaoMs: 0, estado: "gravando", participantes: ["Você", "Outros"], contexto: contexto || null, modelos: { transcricao: transcricao || null, analise: modelo || null } } }
    gravarJson(r)
    banco.prepare("INSERT INTO sessions (id, started_at, ended_at, subject, tag, questions, status) VALUES (?, ?, NULL, ?, NULL, 0, 'active')").run(id, inicio, nome)
    r.relogio = setInterval(() => { try { salvarAgora(r) } catch {} }, PASSO)
    abertas.set(id, r)
    return { id, pasta }
  }

  function falar(id, { quem, texto }) {
    const r = abertas.get(id)
    if (!r || !texto) return false
    acrescentar(r, "transcricao.jsonl", { t: Date.now() - r.dados.inicio, quem, texto })
    return true
  }

  function sugerir(id, { pergunta, resposta, fontes, ms }) {
    const r = abertas.get(id)
    if (!r) return false
    acrescentar(r, "sugestoes.jsonl", { t: Date.now() - r.dados.inicio, pergunta, resposta, fontes: fontes || [], ms: ms ?? null })
    banco.prepare("UPDATE sessions SET questions = questions + 1 WHERE id = ?").run(id)
    return true
  }

  function encerrar(id) {
    const r = abertas.get(id)
    if (!r) return false
    clearInterval(r.relogio)
    r.dados.fim = Date.now()
    r.dados.estado = "concluida"
    salvarAgora(r)
    banco.prepare("UPDATE sessions SET ended_at = ?, status = 'ended' WHERE id = ?").run(r.dados.fim, id)
    abertas.delete(id)
    return true
  }

  /** Ao abrir o app: reuniões que ficaram "gravando" (queda, falta de energia) viram "interrompida", com o que foi salvo. */
  function recuperar() {
    const pendentes = banco.prepare("SELECT id FROM sessions WHERE status = 'active'").all()
    for (const { id } of pendentes) {
      let fim = Date.now()
      try {
        const pasta = fs.readdirSync(RAIZ).map((n) => path.join(RAIZ, n)).find((p) => { try { return JSON.parse(fs.readFileSync(path.join(p, "reuniao.json"), "utf8")).id === id } catch { return false } })
        if (pasta) {
          const dados = JSON.parse(fs.readFileSync(path.join(pasta, "reuniao.json"), "utf8"))
          const arq = path.join(pasta, "transcricao.jsonl")
          const ultimo = fs.existsSync(arq) ? fs.statSync(arq).mtimeMs : dados.inicio
          fim = Math.max(dados.inicio, ultimo)
          dados.fim = fim
          dados.estado = "interrompida"
          dados.duracaoMs = fim - dados.inicio
          fs.writeFileSync(path.join(pasta, "reuniao.json"), JSON.stringify(dados, null, 2))
          refazerLegivel({ pasta })
        }
      } catch {}
      banco.prepare("UPDATE sessions SET ended_at = ?, status = 'interrupted' WHERE id = ?").run(fim, id)
    }
  }

  return { iniciar, falar, sugerir, encerrar, recuperar, abertas: () => [...abertas.keys()], raiz: RAIZ }
}

module.exports = { criarReunioes }
