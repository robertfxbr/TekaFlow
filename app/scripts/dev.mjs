// Sobe a tela (Vite, no Design System) e abre a janela do aplicativo apontando para ela.
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const aqui = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.join(aqui, "..")
const PORTA = 5190
const URL_TELA = `http://localhost:${PORTA}/app.html`

const vite = spawn("npx", ["vite", "--port", String(PORTA), "--strictPort"], { cwd: path.join(raiz, "..", "design-system"), stdio: "inherit" })

async function esperarTela() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(URL_TELA)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error("A tela não subiu em 30 segundos.")
}

try {
  await esperarTela()
} catch (e) {
  console.error(e.message)
  vite.kill()
  process.exit(1)
}

const electron = spawn(path.join(raiz, "node_modules", ".bin", "electron"), ["."], { cwd: raiz, stdio: "inherit", env: { ...process.env, TEKA_DEV_URL: URL_TELA } })
electron.on("exit", (codigo) => {
  vite.kill()
  process.exit(codigo ?? 0)
})
process.on("SIGINT", () => { electron.kill(); vite.kill() })
