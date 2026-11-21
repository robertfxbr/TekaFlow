// Ponto de entrada do app. Decide entre o código que veio no instalador e uma atualização leve já baixada e conferida (appBundle.cjs).
// Adaptado do projeto original de Robert (github.com/robertfxbr/openPerssua), licença MIT.
// Fica pequeno e sem dependências: se ele quebrar, nada abre.
const path = require("path")
const Module = require("module")
const { app } = require("electron")
const bundles = require("./appBundle.cjs")

const SHELL_VERSION = require("../package.json").version
global.tekaShellVersion = SHELL_VERSION
global.tekaVersion = SHELL_VERSION
global.tekaBundle = null

const abrirDoInstalador = () => require("./main.cjs")

function iniciar() {
  // Desenvolvimento e testes sempre usam o código local
  if (process.env.TEKA_DEV_URL || process.env.TEKA_NO_LIGHT_UPDATE === "1") return abrirDoInstalador()

  const userData = bundles.resolveUserData(app)
  const pick = bundles.pickBundle(userData, SHELL_VERSION)
  if (!pick.bundle) return abrirDoInstalador()

  // O pacote não leva node_modules: o banco (better-sqlite3) vem do instalador. Os arquivos de dentro do pacote
  // passam a procurar também na pasta node_modules da instalação.
  const installModules = path.join(__dirname, "..", "node_modules")
  const bundleRoot = path.resolve(pick.bundle) + path.sep
  const original = Module._nodeModulePaths
  Module._nodeModulePaths = function (from) {
    const paths = original.call(this, from)
    if ((path.resolve(from) + path.sep).startsWith(bundleRoot)) paths.push(installModules)
    return paths
  }
  bundles.markBootAttempt(userData, pick.version)
  global.tekaVersion = pick.version
  global.tekaBundle = pick.bundle
  try {
    require(path.join(pick.bundle, "electron", "main.cjs"))
  } catch (err) {
    // Falhou já no carregamento: descarta o pacote e reabre com o código do instalador.
    try {
      require("fs").writeFileSync(path.join(bundles.updatesDir(userData), "ultimo-erro.txt"), `${new Date().toISOString()} pacote ${pick.version}\n${err?.stack || err}\n`)
    } catch { /* sem onde gravar, segue o plano */ }
    bundles.pickBundle(userData, SHELL_VERSION) // a marca de abertura faz o descarte
    app.relaunch()
    app.exit(0)
  }
}

iniciar()
