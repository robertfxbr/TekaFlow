// Banco local do TekaFlow (SQLite, a mesma biblioteca do projeto original).
const Database = require("better-sqlite3")
const fs = require("node:fs")
const path = require("node:path")
const crypto = require("node:crypto")

const MIN = 60 * 1000
const DIA = 24 * 60 * MIN

/** Cria o banco, as tabelas e, na primeira abertura, algumas sessões de exemplo para a tela não ficar vazia. */
function abrir(pastaDeDados) {
  fs.mkdirSync(pastaDeDados, { recursive: true })
  const db = new Database(path.join(pastaDeDados, "tekaflow.db"))
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")
  db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"))
  // Sem sessões de exemplo: o app mostra só o que é real.
  return db
}

function aQuando(diasAtras, hora, minuto) {
  const d = new Date()
  d.setHours(hora, minuto, 0, 0)
  return d.getTime() - diasAtras * DIA
}

function semearExemplos(db) {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM sessions").get()
  if (n > 0) return
  const exemplos = [
    ["Entrevista técnica, Acme", "Entrevista técnica", aQuando(0, 14, 20), 42, 9],
    ["Cold call, Lumen Energia", "Cold call", aQuando(0, 10, 5), 18, 5],
    ["Apresentação ao CEO, Orbe", "CEO", aQuando(1, 16, 40), 55, 12],
    ["Call em inglês, Northwind", "Inglês", aQuando(8, 9, 30), 31, 7],
  ]
  const inserir = db.prepare("INSERT INTO sessions (id, started_at, ended_at, subject, tag, questions, status) VALUES (?, ?, ?, ?, ?, ?, 'ended')")
  const tudo = db.transaction(() => {
    for (const [titulo, tag, inicio, minutos, perguntas] of exemplos) {
      inserir.run(crypto.randomUUID(), inicio, inicio + minutos * MIN, titulo, tag, perguntas)
    }
  })
  tudo()
}

/** As sessões, da mais nova para a mais antiga, e os totais do painel da tela inicial. */
function listar(db) {
  const sessoes = db
    .prepare("SELECT id, started_at AS inicio, ended_at AS fim, subject AS titulo, tag, questions AS perguntas FROM sessions ORDER BY started_at DESC")
    .all()
  const totais = db
    .prepare("SELECT COUNT(*) AS sessoes, COALESCE(SUM(ended_at - started_at), 0) AS ms, COALESCE(SUM(questions), 0) AS respostas FROM sessions")
    .get()
  return { sessoes, totais: { sessoes: totais.sessoes, minutos: Math.round(totais.ms / MIN), respostas: totais.respostas } }
}

/** Lê todas as configurações como um objeto. */
function lerConfig(db) {
  const config = {}
  for (const { key, value } of db.prepare("SELECT key, value FROM settings").all()) {
    try { config[key] = JSON.parse(value) } catch { config[key] = value }
  }
  return config
}

function salvarConfig(db, chave, valor) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(chave, JSON.stringify(valor))
}

function apagarConfig(db, chave) {
  db.prepare("DELETE FROM settings WHERE key = ?").run(chave)
}

module.exports = { abrir, listar, lerConfig, salvarConfig, apagarConfig }
