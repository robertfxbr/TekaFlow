#!/usr/bin/env node
// O gate do TekaFlow. Roda antes de todo commit (gancho) e na release.
// Passos: tipos, build, harness do design system (só bloqueia o que for NOVO em relação ao baseline), detector de design do impeccable, voz e escrita da marca.
// Uso: node scripts/gate.mjs [--baseline]   (--baseline guarda o estado atual do harness como ponto de partida)
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const ds = path.join(raiz, "design-system")
const baselineArq = path.join(ds, ".harness", "baseline.json")
// As skills podem estar no computador (~/.claude/skills), na pasta da família ds-skill ou dentro do projeto (.claude/skills).
const pastasDeSkills = [path.join(raiz, ".claude", "skills"), path.join(homedir(), ".claude", "skills")]
const achar = (...rel) => { for (const base of pastasDeSkills) for (const r of [rel, ["ds-skill", "skills", ...rel]]) { const c = path.join(base, ...r); if (existsSync(c)) return c } return path.join(pastasDeSkills[1], ...rel) }
const ci = process.env.CI === "true"
let falhou = false
const rodar = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
const passo = (nome, ok, detalhe = "") => { console.log(`${ok ? "OK    " : "FALHA "} ${nome}${detalhe ? ` · ${detalhe}` : ""}`); if (!ok) falhou = true }

// 1. Tipos
const tsc = rodar("npx", ["tsc", "--noEmit", "-p", "tsconfig.app.json"], ds)
passo("Checagem de tipos", tsc.status === 0, tsc.status === 0 ? "" : (tsc.stdout || tsc.stderr).split("\n").slice(0, 8).join("\n"))

// 2. Build da tela
const build = rodar("npx", ["vite", "build"], ds)
passo("Build da tela", build.status === 0, build.status === 0 ? "" : (build.stdout + build.stderr).split("\n").slice(-8).join("\n"))

// 3. Harness do design system, contra o baseline (o harness e o impeccable moram nas skills locais; na release na nuvem não existem)
const harness = achar("ds-harness", "scripts", "validar-rodada.mjs")
if (!existsSync(harness)) {
  console.log(`${ci ? "PULOU " : "FALHA "} Harness do design system · skill ds-harness não encontrada (veja docs/CONTRIBUINDO.md)`)
  if (!ci) falhou = true
} else {
  const r = rodar(process.execPath, [harness, "--repo", ".", "--json"], ds)
  let j
  try { j = JSON.parse(r.stdout) } catch { j = null }
  if (!j) passo("Harness do design system", false, "saída ilegível")
  else {
    const chave = (c, a) => [c.controle, (a.onde || "").split(":")[0], a.detalhe || "", a.titulo].join("|")
    const atuais = j.controls.flatMap((c) => (c.achados || []).filter((a) => a.nivel === "bloqueia").map((a) => chave(c, a)))
    const naoRodou = j.controls.filter((c) => c.status === "not-run").map((c) => c.controle)
    if (process.argv.includes("--baseline")) {
      mkdirSync(path.dirname(baselineArq), { recursive: true })
      writeFileSync(baselineArq, JSON.stringify({ criadoEm: new Date().toISOString(), bloqueios: atuais }, null, 2) + "\n")
      console.log(`Baseline guardado: ${atuais.length} bloqueios atuais`)
    }
    const base = existsSync(baselineArq) ? JSON.parse(readFileSync(baselineArq, "utf8")).bloqueios : []
    // Cada bloqueio de base "gasta" uma ocorrência; o que sobrar é novo.
    const sobra = [...base]
    const novos = []
    for (const k of atuais) { const i = sobra.indexOf(k); if (i >= 0) sobra.splice(i, 1); else novos.push(k) }
    passo("Harness do design system", novos.length === 0 && naoRodou.length === 0,
      novos.length ? `${novos.length} bloqueio(s) novo(s):\n  - ${novos.map((k) => k.split("|").slice(1).join(" · ")).join("\n  - ")}` : naoRodou.length ? `controle(s) não executado(s): ${naoRodou.join(", ")}` : `${atuais.length} bloqueios, todos já no baseline`)
  }
}

// 4. Detector de design do impeccable, nos arquivos de tela tocados (todos os de src/app e src/prototipo se rodar fora de commit)
const detect = achar("impeccable", "scripts", "detect.mjs")
if (!existsSync(detect)) console.log(`${ci ? "PULOU " : "AVISO "} Detector de design · skill impeccable não encontrada`)
else {
  const staged = rodar("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM"], raiz).stdout.split("\n").filter((f) => /design-system\/src\/.*\.(tsx|css)$/.test(f)).map((f) => path.join(raiz, f))
  const alvos = staged.length ? staged : [path.join(ds, "src", "app")]
  const r = rodar(process.execPath, [detect, "--json", "--no-advisory", ...alvos], ds)
  let achados = []
  try { const j = JSON.parse(r.stdout); achados = Array.isArray(j) ? j : j.findings || j.results || [] } catch { /* sem JSON: considera pelo código de saída */ achados = r.status === 0 ? [] : [{ rule: "detector", message: (r.stdout || r.stderr).slice(0, 300) }] }
  passo("Detector de design (impeccable)", achados.length === 0, achados.length ? achados.slice(0, 6).map((a) => `${a.rule || a.id || "regra"} ${a.file || ""}${a.line ? ":" + a.line : ""} ${a.message || ""}`).join("\n  - ") : "")
}

// 5. Escrita e personalidade da marca: tom Tranquilo e Despretensioso (só reprova o que for novo, contra design-system/.harness/voz-baseline.json)
const voz = rodar(process.execPath, [path.join(raiz, "scripts", "voz-da-marca.mjs"), ...(process.argv.includes("--baseline") ? ["--baseline"] : [])], raiz)
const vozLinhas = (voz.stdout || voz.stderr).trim().split("\n")
passo("Escrita e voz da marca", voz.status === 0, voz.status === 0 ? vozLinhas.at(-1) : vozLinhas.join("\n"))

// 6. Revisão de escrita (skill review-escrita, varredura de cacoetes de IA): só quando a skill existe neste computador; avisa e não reprova
const cacoetes = [path.join(homedir(), ".claude", "skills", "review", "scripts", "varrer-cacoetes.mjs"), path.join(homedir(), "Documents", "AI-Workspace", "Skills", "review", "scripts", "varrer-cacoetes.mjs")].find(existsSync)
if (!cacoetes) console.log(`${ci ? "PULOU " : "AVISO "} Varredura de cacoetes de escrita · skill review não encontrada`)
else {
  const textos = ["README.publico.md", "README.md", "RELEASE.md"].map((f) => path.join(raiz, f)).filter(existsSync).slice(0, 1)
  const c = rodar(process.execPath, [cacoetes, ...textos], raiz)
  const saida = (c.stdout || "").trim().split("\n").filter(Boolean)
  console.log(`${c.status === 0 ? "OK    " : "AVISO "} Varredura de cacoetes de escrita${c.status === 0 ? "" : `\n  ${saida.slice(0, 6).join("\n  ")}`}`)
}

console.log(falhou ? "\nGate: REPROVADO" : "\nGate: aprovado")
process.exit(falhou ? 1 : 0)
