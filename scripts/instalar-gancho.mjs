#!/usr/bin/env node
// Instala o gancho de pre-commit do gate. Só vale na raiz do repositório do TekaFlow.
import { chmodSync, existsSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import path from "node:path"

const topo = spawnSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).stdout.trim()
const aqui = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
if (!topo) { console.error("Isto não é um repositório git."); process.exit(1) }
if (path.resolve(topo) !== aqui) { console.error(`O repositório git está em ${topo}, não em ${aqui}. O gancho só é instalado no repositório do TekaFlow.`); process.exit(1) }
const arq = path.join(topo, ".git", "hooks", "pre-commit")
if (existsSync(arq)) { console.error("Já existe um pre-commit. Não sobrescrevi."); process.exit(1) }
writeFileSync(arq, '#!/bin/sh\n# Gate do TekaFlow: tipos, build, harness (só o novo) e detector de design.\nexec node scripts/gate.mjs\n')
chmodSync(arq, 0o755)
console.log("Gancho instalado:", arq)
