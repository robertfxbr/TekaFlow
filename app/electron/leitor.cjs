// Lê arquivos de texto e PDF de uma pasta, com o caminho sempre preso dentro dela.
const fs = require("node:fs")
const path = require("node:path")

const EXTENSOES = new Set([".md", ".txt", ".pdf"])

async function extrairPdf(arquivo) {
  const { PDFParse } = require("pdf-parse")
  const leitor = new PDFParse({ data: new Uint8Array(fs.readFileSync(arquivo)) })
  try {
    const r = await leitor.getText()
    return (r.text || "").replace(/^-- \d+ of \d+ --$/gm, "")
  } finally {
    await leitor.destroy().catch(() => {})
  }
}

// Devolve o caminho absoluto se ele ficar dentro da pasta (seguindo links simbólicos), senão null.
function resolverDentro(pasta, relativo) {
  if (typeof relativo !== "string" || !relativo || path.isAbsolute(relativo)) return null
  let raiz, alvo
  try {
    raiz = fs.realpathSync(path.resolve(pasta))
    alvo = fs.realpathSync(path.resolve(raiz, relativo))
  } catch { return "inexistente" }
  return alvo === raiz || !alvo.startsWith(raiz + path.sep) ? null : alvo
}

async function lerArquivos(pasta, caminhosRelativos, limiteCaracteres = 60000) {
  const trechos = []
  const ignorados = []
  let restante = limiteCaracteres
  for (const rel of caminhosRelativos || []) {
    const motivo = (m) => ignorados.push({ arquivo: String(rel), motivo: m })
    const ext = path.extname(String(rel)).toLowerCase()
    if (!EXTENSOES.has(ext)) { motivo("Só leio .md, .txt e .pdf."); continue }
    const abs = resolverDentro(pasta, rel)
    if (abs === "inexistente") { motivo("Não achei esse arquivo."); continue }
    if (!abs) { motivo("Esse arquivo não está dentro da pasta."); continue }
    try {
      if (!fs.statSync(abs).isFile()) { motivo("Não é um arquivo."); continue }
      if (restante <= 0) { motivo("Passou do limite de texto."); continue }
      let texto = ext === ".pdf" ? await extrairPdf(abs) : fs.readFileSync(abs, "utf8")
      texto = texto.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
      if (!texto) { motivo(ext === ".pdf" ? "Esse PDF não tem texto selecionável (talvez seja imagem)." : "O arquivo está vazio."); continue }
      if (texto.length > restante) {
        texto = texto.slice(0, restante) + "\n[... texto cortado por ser longo demais]"
        ignorados.push({ arquivo: String(rel), motivo: "Li só o começo, o resto passou do limite." })
      }
      restante -= texto.length
      trechos.push({ arquivo: String(rel), texto })
    } catch (e) {
      motivo("Não consegui abrir esse arquivo.")
    }
  }
  return { trechos, ignorados }
}

module.exports = { lerArquivos }
