// Atualização do TekaFlow pelo GitHub Releases. Pacote leve: a release traz tekaflow-mac-update.json e tekaflow-mac-app-<versão>.asar
// (só o código do app). O app baixa, confere o SHA-512, guarda em <userData>/app-updates e reinicia.
// Os nomes dos arquivos são próprios do Mac para não serem confundidos com os do app antigo do Windows.
// Adaptado do projeto original de Robert (github.com/robertfxbr/openPerssua), licença MIT.
const { app, shell } = require("electron")
const crypto = require("crypto")
const bundles = require("./appBundle.cjs")

const REPOS = ["robertfxbr/TekaFlow", "robertfxbr/openPerssua"]
const MANIFESTO = "tekaflow-mac-update.json"
const MAX_BYTES = 80 * 1024 * 1024
const versaoAtual = () => global.tekaVersion || app.getVersion()
const versaoInstalador = () => global.tekaShellVersion || app.getVersion()
const ehNova = (remota, local) => Boolean(bundles.parseVersion(remota) && bundles.parseVersion(local) && bundles.compareVersions(remota, local) > 0)

const urlSegura = (a) => (a && typeof a.browser_download_url === "string" && REPOS.some((r) => a.browser_download_url.toLowerCase().startsWith(`https://github.com/${r}/releases/download/`.toLowerCase())) ? a.browser_download_url : null)

function lerManifesto(d, versaoDaRelease) {
  if (!d || typeof d !== "object") return null
  const { version, shellMin, file, sha512, size } = d
  if (!bundles.parseVersion(version) || bundles.compareVersions(version, versaoDaRelease) !== 0) return null
  if (!bundles.parseVersion(shellMin)) return null
  if (typeof file !== "string" || !/^tekaflow-mac-app-[\d.]+\.asar$/.test(file)) return null
  if (typeof sha512 !== "string" || !/^[A-Za-z0-9+/]{80,100}={0,2}$/.test(sha512)) return null
  if ((Number(size) || 0) > MAX_BYTES) return null
  return { version, shellMin, file, sha512, size: Number(size) || 0 }
}

let ultima = null

async function buscarRelease() {
  for (const repo of REPOS) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "TekaFlow-atualizador" }, signal: AbortSignal.timeout(10000) })
    if (res.status === 404) continue
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    return res.json()
  }
  return null
}

async function verificar() {
  try {
    const rel = await buscarRelease()
    if (!rel) return { ok: true, nova: false, atual: versaoAtual() }
    const versao = String(rel.tag_name || "").replace(/^v/i, "")
    const nova = ehNova(versao, versaoAtual())
    const assets = Array.isArray(rel.assets) ? rel.assets : []
    const pagina = String(rel.html_url || "").startsWith("https://github.com/") ? rel.html_url : `https://github.com/${REPOS[0]}/releases`
    let leve = null
    if (nova) {
      const man = assets.find((a) => a.name === MANIFESTO)
      if (urlSegura(man)) {
        try {
          const r = await fetch(urlSegura(man), { signal: AbortSignal.timeout(15000) })
          const m = r.ok ? lerManifesto(await r.json(), versao) : null
          const asar = m && assets.find((a) => a.name === m.file)
          if (m && urlSegura(asar) && bundles.compareVersions(versaoInstalador(), m.shellMin) >= 0) leve = { ...m, url: urlSegura(asar) }
        } catch { /* sem pacote leve: só a página */ }
      }
    }
    ultima = { versao, leve }
    return { ok: true, nova, atual: versaoAtual(), versao, notas: String(rel.body || "").slice(0, 1500), pagina, podeInstalar: Boolean(leve), tamanho: leve?.size || 0 }
  } catch (e) {
    return { ok: false, erro: "Não consegui falar com o GitHub. Confira a conexão e tente de novo." }
  }
}

async function baixar() {
  const rel = ultima
  if (!rel?.leve) return { ok: false, erro: "Esta versão não tem atualização automática. Baixe pela página." }
  try {
    const res = await fetch(rel.leve.url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const dados = Buffer.from(await res.arrayBuffer())
    if (dados.length > MAX_BYTES) throw new Error("arquivo maior que o esperado")
    if (crypto.createHash("sha512").update(dados).digest("base64") !== rel.leve.sha512) return { ok: false, erro: "O arquivo baixado não confere com o da versão. Nada foi trocado." }
    bundles.installBundle(app.getPath("userData"), { version: rel.leve.version, shellMin: rel.leve.shellMin, sha512: rel.leve.sha512, data: dados })
    return { ok: true, versao: rel.leve.version }
  } catch {
    return { ok: false, erro: "O download falhou. Tente de novo." }
  }
}

function reiniciar() {
  app.relaunch()
  setTimeout(() => app.quit(), 200)
  return { ok: true }
}

const abrirPagina = (url) => { shell.openExternal(typeof url === "string" && url.startsWith("https://github.com/") ? url : `https://github.com/${REPOS[0]}/releases`); return { ok: true } }
const info = () => ({ versao: versaoAtual(), instalador: versaoInstalador(), leve: Boolean(global.tekaBundle) })

module.exports = { verificar, baixar, reiniciar, abrirPagina, info, ehNova, lerManifesto }
