// Conexão real com as IAs: login do ChatGPT, Claude Code instalado e chaves de API.
// O login do ChatGPT segue o fluxo padrão OAuth com PKCE e retorno em localhost, o mesmo que o Codex CLI usa.
// A base original do Robert (OpenPerssua) usa o mesmo caminho; os créditos estão no README do app.
const { shell, safeStorage } = require("electron")
const crypto = require("node:crypto")
const http = require("node:http")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { execFile } = require("node:child_process")

const ISSUER = "https://auth.openai.com"
const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"
const PORTAS = [1455, 1457]

function criar(db, banco) {
  const ler = () => db.lerConfig(banco).ia || { conectadas: [], ativa: null }
  const gravar = (ia) => db.salvarConfig(banco, "ia", ia)
  const guardarSegredo = (nome, valor) => {
    const bruto = JSON.stringify(valor)
    const cifrado = safeStorage.isEncryptionAvailable() ? "c:" + safeStorage.encryptString(bruto).toString("base64") : "p:" + bruto
    db.salvarConfig(banco, "segredo_" + nome, cifrado)
  }
  const marcar = (id) => {
    const ia = ler()
    if (!ia.conectadas.includes(id)) ia.conectadas.push(id)
    if (!ia.ativa) ia.ativa = id
    gravar(ia)
    return ia
  }

  function esperarRetorno(estado) {
    return new Promise((resolve, reject) => {
      const tentar = (i) => {
        if (i >= PORTAS.length) return reject(new Error("As portas 1455 e 1457 estão ocupadas."))
        const porta = PORTAS[i]
        let ok, falha
        const codigo = new Promise((a, b) => { ok = a; falha = b })
        const servidor = http.createServer((req, res) => {
          const u = new URL(req.url, `http://localhost:${porta}`)
          if (u.pathname !== "/auth/callback") return res.end()
          if (u.searchParams.get("state") !== estado) return res.writeHead(400).end("state inválido")
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
          res.end(fs.readFileSync(path.join(__dirname, "sucesso.html"), "utf8"))
          ok(u.searchParams.get("code"))
          servidor.close()
        })
        const limite = setTimeout(() => { servidor.close(); falha(new Error("O login demorou mais de 5 minutos.")) }, 5 * 60 * 1000)
        codigo.finally(() => clearTimeout(limite)).catch(() => {})
        servidor.on("error", () => tentar(i + 1))
        servidor.listen(porta, "localhost", () => resolve({ porta, codigo, cancelar: () => { servidor.close(); falha(new Error("Cancelado.")) } }))
      }
      tentar(0)
    })
  }

  let cancelarLogin = null
  async function conectarChatgpt() {
    try {
      const verifier = crypto.randomBytes(32).toString("base64url")
      const challenge = crypto.createHash("sha256").update(verifier).digest("base64url")
      const estado = crypto.randomBytes(16).toString("hex")
      const { porta, codigo, cancelar } = await esperarRetorno(estado)
      cancelarLogin = cancelar
      const url = new URL(`${ISSUER}/oauth/authorize`)
      const q = { response_type: "code", client_id: CLIENT_ID, redirect_uri: `http://localhost:${porta}/auth/callback`, scope: "openid profile email offline_access", code_challenge: challenge, code_challenge_method: "S256", state: estado }
      Object.entries(q).forEach(([k, v]) => url.searchParams.set(k, v))
      await shell.openExternal(url.toString())
      const code = await codigo
      const r = await fetch(`${ISSUER}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "authorization_code", client_id: CLIENT_ID, code, code_verifier: verifier, redirect_uri: `http://localhost:${porta}/auth/callback` }),
      })
      if (!r.ok) return { ok: false, erro: `A OpenAI recusou o login (${r.status}).` }
      guardarSegredo("chatgpt", await r.json())
      return { ok: true, ia: marcar("chatgpt") }
    } catch (e) {
      return { ok: false, erro: e.message }
    } finally {
      cancelarLogin = null
    }
  }

  const rodar = (cmd, args) => new Promise((res) => execFile(cmd, args, { timeout: 15000 }, (e, out) => res(e ? null : out.trim())))
  async function verificarClaude() {
    const candidatos = [path.join(os.homedir(), ".local/bin/claude"), "/opt/homebrew/bin/claude", "/usr/local/bin/claude"].filter((p) => fs.existsSync(p))
    if (!candidatos.length) return { ok: false, erro: "Não achei o Claude Code neste Mac." }
    const versao = await rodar(candidatos[0], ["--version"])
    if (!versao) return { ok: false, erro: "O Claude Code não respondeu." }
    const estado = await rodar(candidatos[0], ["auth", "status"])
    let logado = false
    try { logado = JSON.parse(estado).loggedIn === true } catch {}
    if (!logado) return { ok: false, erro: "O Claude Code está instalado, mas sem login. Abra o terminal e rode claude para entrar." }
    return { ok: true, ia: marcar("claude") }
  }

  const PROVEDORES = [
    { id: "anthropic", cartao: "chave", prefixo: "sk-ant-", url: "https://api.anthropic.com/v1/models", cab: (k) => ({ "x-api-key": k, "anthropic-version": "2023-06-01" }) },
    { id: "openai", cartao: "chave", prefixo: "sk-", url: "https://api.openai.com/v1/models", cab: (k) => ({ Authorization: `Bearer ${k}` }) },
    { id: "google", cartao: "gemini", prefixo: "AIza", alt: "AQ.", url: "https://generativelanguage.googleapis.com/v1beta/models", cab: (k) => ({ "x-goog-api-key": k }) },
  ]
  async function conectarChave(chave) {
    const p = PROVEDORES.find((x) => chave.startsWith(x.prefixo) || (x.alt && chave.startsWith(x.alt)))
    if (!p) return { ok: false, erro: "Não reconheci esse começo de chave." }
    try {
      const r = await fetch(p.url, { headers: p.cab(chave), signal: AbortSignal.timeout(15000) })
      if (r.status === 401 || r.status === 403 || r.status === 400) return { ok: false, erro: "Chave recusada. Confira se copiou inteira." }
      if (!r.ok) return { ok: false, erro: `O serviço respondeu ${r.status}.` }
    } catch {
      return { ok: false, erro: "Sem conexão com o serviço. Confira a internet." }
    }
    guardarSegredo(p.id, { chave })
    return { ok: true, ia: marcar(p.cartao), provedor: p.id }
  }

  return {
    estado: () => ler(),
    conectarChatgpt,
    cancelarChatgpt: () => cancelarLogin?.(),
    verificarClaude,
    conectarChave,
    desconectar: (id) => {
      const i = ler()
      i.conectadas = i.conectadas.filter((x) => x !== id)
      if (i.ativa === id) i.ativa = i.conectadas[0] ?? null
      if (i.modelos) delete i.modelos[id]
      gravar(i)
      const segredos = { chatgpt: ["chatgpt"], gemini: ["google"], chave: ["openai", "anthropic"], claude: [] }[id] || []
      for (const nome of segredos) db.apagarConfig(banco, "segredo_" + nome)
      return i
    },
    selecionar: (id) => { const ia = ler(); ia.ativa = id; gravar(ia); return ia },
  }
}
module.exports = { criar }
