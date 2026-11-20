#!/usr/bin/env node
// Gate de escrita e personalidade do TekaFlow. Tom: Tranquilo e Despretensioso (marca/posicionamento.md).
// Confere o texto que uma pessoa lê: README, docs, notas de release e as frases da interface (design-system/src).
// Só reprova o que for NOVO em relação a design-system/.harness/voz-baseline.json. Uso: node scripts/voz-da-marca.mjs [--baseline]
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const baselineArq = path.join(raiz, "design-system", ".harness", "voz-baseline.json")

/** Cada regra: o que quebra para quem lê e como corrigir. nivel "bloqueia" reprova; "aviso" só informa. */
const REGRAS = [
  { id: "travessao", nivel: "bloqueia", re: /[—–]/g, msg: "Travessão no texto. Use vírgula, dois-pontos ou ponto.", so: "texto" },
  { id: "exclamacao", nivel: "bloqueia", re: /[A-Za-zÀ-ÿ0-9)]!(?=\s|$)/g, msg: "Ponto de exclamação. A marca fala em voz baixa, sem alarde.", so: "texto" },
  { id: "promessa", nivel: "bloqueia", re: /\b(garante|garantido|garantida|garantimos|sempre|resposta certa|resultado certo|em segundos|em minutos|na hora certa)\b/gi, msg: "Promessa de tempo, resultado ou 'sempre'. A marca não promete.", so: "texto" },
  { id: "linguagem-dos-concorrentes", nivel: "bloqueia", re: /(invis[ií]vel|indetect[aá]vel|arma secreta|(?:^|\s)n[ºo°]\s?1\b|(?:^|\s)#1(?![\w])|\bsecreto\b|trapa[cç]a)/gi, msg: "Linguagem que os concorrentes já ocupam. A marca diz 'discreto'.", so: "texto" },
  { id: "gratis-local", nivel: "bloqueia", re: /(de gra[cç]a|gr[aá]tis|totalmente local|100% local|100% privado)/gi, msg: "A IA conectada pode ter custo e a conversa vai para o serviço escolhido. Não diga 'de graça' nem 'totalmente local'.", so: "texto" },
  { id: "urgencia", nivel: "bloqueia", re: /\b(n[aã]o perca|corra|imperd[ií]vel|incr[ií]vel|revolucion[aá]rio|poderos[oa]|agora mesmo|urgente)\b/gi, msg: "Palavra de urgência ou exagero. Fale baixo e diga o próximo passo.", so: "texto" },
  { id: "teka-sozinho", nivel: "bloqueia", re: /\bTeka\b(?!Flow)/g, msg: "O nome na tela é sempre TekaFlow, nunca Teka sozinho.", so: "texto" },
  { id: "jargao-de-ia", nivel: "bloqueia", re: /\b(defensible|honest|unpack|delve|underscore|alavancar|sinergia|disruptiv[oa]|jornada de transforma[cç][aã]o)\b/gi, msg: "Jargão que não é do dia a dia. Use a palavra simples.", so: "texto" },
  { id: "nao-e-x-e-y", nivel: "bloqueia", re: /\bn[aã]o [eé] [^.,;:\n]{1,40}[,;] [eé] /gi, msg: "Construção 'não é X, é Y'. Diga direto o que é.", so: "texto" },
  { id: "caixa-alta", nivel: "aviso", re: /\b[A-ZÀ-Ý]{5,}\b/g, msg: "Palavra em caixa alta. A marca evita gritar; só rótulo curto e discreto.", so: "interface" },
  { id: "ordem-em-vez-de-convite", nivel: "aviso", re: /\b(Inicie sua jornada|Comece sua jornada|Desbloqueie|Turbine)\b/gi, msg: "Ordem ou promessa. Prefira convite: 'Começar', 'se quiser'.", so: "texto" },
]

const pastasIgnoradas = new Set(["node_modules", "dist", "dist-app", "release", "renderer", ".git", ".harness", "referencias", "prototipos", "robert-openperssua", "TekaFlow-publico"])
function listar(dir, ok, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (pastasIgnoradas.has(nome)) continue
    const p = path.join(dir, nome)
    const st = statSync(p)
    if (st.isDirectory()) listar(p, ok, acc)
    else if (ok(p)) acc.push(p)
  }
  return acc
}

// 1. Prosa que o público lê: README, docs, release, notas da release. Documentos internos de marca e decisão ficam de fora (citam as palavras proibidas como exemplo).
const prosa = [
  // O README.md daqui é interno quando existe o README.publico.md (que vira o README na cópia pública).
  ...[existsSync(path.join(raiz, "README.publico.md")) ? "README.publico.md" : "README.md", "RELEASE.md", ".github/release-notes.md"].map((f) => path.join(raiz, f)).filter(existsSync),
  ...(existsSync(path.join(raiz, "docs")) ? listar(path.join(raiz, "docs"), (p) => p.endsWith(".md")) : []),
]
// 2. Frases da interface: texto entre aspas e texto dentro de JSX, em telas e protótipos do app.
const telas = ["design-system/src/app", "design-system/src/prototipo", "design-system/src/prototipo-app"].map((d) => path.join(raiz, d)).filter(existsSync).flatMap((d) => listar(d, (p) => p.endsWith(".tsx")))
const htmlApp = [path.join(raiz, "app", "electron", "sucesso.html")].filter(existsSync)

function trechosDeInterface(codigo) {
  const out = []
  codigo.split("\n").forEach((linha, i) => {
    if (/^\s*(\/\/|\*|\/\*|import )/.test(linha)) return
    // strings entre aspas com pelo menos duas palavras e letras acentuadas ou espaço (frases), sem cara de classe CSS
    for (const m of linha.matchAll(/(["'`])((?:(?!\1).){6,})\1/g)) {
      const t = m[2]
      if (/=>|\);|window\.|\.api\b/.test(t)) continue // pedaço de código entre duas aspas
      if (!/[A-Za-zÀ-ÿ]{3,}\s+[A-Za-zÀ-ÿ]{2,}/.test(t)) continue
      if (/[:\[\]]|^\s*[a-z-]+(\s+[a-z0-9:\/\[\]-]+)+$/.test(t) && !/[À-ÿ]/.test(t)) continue // classe do Tailwind
      out.push({ linha: i + 1, texto: t })
    }
    // texto solto dentro de JSX: >Texto aqui<
    for (const m of linha.matchAll(/>([^<>{}]{6,})</g)) {
      if (/[A-Za-zÀ-ÿ]{3,}/.test(m[1])) out.push({ linha: i + 1, texto: m[1] })
    }
  })
  return out
}

const achados = []
const varrer = (arquivo, trechos, tipo) => {
  for (const { linha, texto } of trechos) {
    for (const r of REGRAS) {
      if (r.so === "interface" && tipo !== "interface") continue
      for (const m of texto.matchAll(r.re)) {
        achados.push({ arquivo: path.relative(raiz, arquivo), linha, regra: r.id, nivel: r.nivel, msg: r.msg, trecho: m[0] })
      }
    }
  }
}
for (const arq of prosa) {
  const linhas = readFileSync(arq, "utf8").split("\n")
  let emCodigo = false
  const trechos = []
  linhas.forEach((l, i) => {
    if (/^```/.test(l)) { emCodigo = !emCodigo; return }
    if (emCodigo || /^\s*\|[-: |]+\|\s*$/.test(l) || /^\s*(import|<img|<a |<p |<\/)/.test(l)) return
    trechos.push({ linha: i + 1, texto: l.replace(/`[^`]*`/g, "").replace(/\]\([^)]*\)/g, "]").replace(/<[^>]+>/g, " ") })
  })
  varrer(arq, trechos, "texto")
}
for (const arq of telas) varrer(arq, trechosDeInterface(readFileSync(arq, "utf8")), "interface")
for (const arq of htmlApp) varrer(arq, readFileSync(arq, "utf8").split("\n").map((t, i) => ({ linha: i + 1, texto: t.replace(/<[^>]+>/g, " ") })), "texto")

const chave = (a) => [a.regra, a.arquivo, a.trecho].join("|")
const bloqueios = achados.filter((a) => a.nivel === "bloqueia")
const avisos = achados.filter((a) => a.nivel === "aviso")

if (process.argv.includes("--baseline")) {
  mkdirSync(path.dirname(baselineArq), { recursive: true })
  writeFileSync(baselineArq, JSON.stringify({ criadoEm: new Date().toISOString(), bloqueios: bloqueios.map(chave) }, null, 2) + "\n")
  console.log(`Baseline de voz guardado: ${bloqueios.length} ocorrências atuais`)
}
const base = existsSync(baselineArq) ? JSON.parse(readFileSync(baselineArq, "utf8")).bloqueios : []
const sobra = [...base]
const novos = []
for (const a of bloqueios) { const i = sobra.indexOf(chave(a)); if (i >= 0) sobra.splice(i, 1); else novos.push(a) }

for (const a of novos) console.log(`  - ${a.arquivo}:${a.linha} · "${a.trecho}" · ${a.msg}`)
console.log(`Voz da marca: ${novos.length} novo(s) bloqueio(s), ${bloqueios.length - novos.length} antigo(s) no baseline, ${avisos.length} aviso(s)`)
process.exit(novos.length ? 1 : 0)
