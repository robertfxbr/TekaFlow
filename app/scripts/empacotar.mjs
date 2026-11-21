// Gera o TekaFlow.app: copia a tela montada para dentro do aplicativo e empacota.
import { cp, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { packager } from "@electron/packager"

const aqui = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.join(aqui, "..")

await rm(path.join(raiz, "renderer"), { recursive: true, force: true })
await cp(path.join(raiz, "..", "design-system", "dist"), path.join(raiz, "renderer"), { recursive: true })

// O banco (better-sqlite3) é um módulo nativo: precisa ser compilado para o Electron, não para o Node da máquina.
// Sem isto, o app empacotado não abre ("compiled against a different Node.js version").
const { rebuild } = await import("@electron/rebuild")
const { createRequire } = await import("node:module")
const electronVersion = createRequire(import.meta.url)("electron/package.json").version
await rebuild({ buildPath: raiz, electronVersion, arch: process.arch, force: true, onlyModules: ["better-sqlite3"] })

const caminhos = await packager({
  dir: raiz,
  out: path.join(raiz, "dist-app"),
  name: "TekaFlow",
  platform: "darwin",
  arch: process.arch,
  overwrite: true,
  icon: path.join(raiz, "assets", "icone"),
  extraResource: [path.join(raiz, "native", "fala")],
  appBundleId: "com.carloshenrique.tekaflow",
  extendInfo: {
    NSMicrophoneUsageDescription: "O TekaFlow ouve a sua voz para transcrever a reunião.",
    NSSpeechRecognitionUsageDescription: "O TekaFlow usa o reconhecimento de voz do Mac para transcrever.",
    NSAudioCaptureUsageDescription: "O TekaFlow ouve o áudio do computador, onde a outra pessoa fala.",
    NSScreenCaptureUsageDescription: "O TekaFlow ouve o áudio do computador, onde a outra pessoa fala.",
  },
  prune: true,
  ignore: [/^\/dist-app/, /^\/scripts/, /^\/assets/, /^\/native/, /^\/README\.md$/],
})
console.log("Aplicativo gerado em:", caminhos.join(", "))

// Instala em Aplicativos para abrir com duplo clique e abre.
import { execSync } from "node:child_process"
const app = path.join(caminhos[0], "TekaFlow.app")

// Para a release: sem instalar nem abrir. Assina "ad hoc" (sem conta Apple) e gera o .zip que vai para o GitHub.
if (process.env.SEM_INSTALAR) {
  execSync(`codesign --force --sign - "${app}/Contents/Resources/fala"; codesign --force --deep --sign - "${app}"; mkdir -p "${path.join(raiz, "release")}"; ditto -c -k --keepParent "${app}" "${path.join(raiz, "release", `TekaFlow-${process.arch === "arm64" ? "mac-apple-silicon" : "mac-intel"}.zip`)}"`, { stdio: "inherit", shell: "/bin/zsh" })
  // Pacote leve (só o código do app) e o manifesto, para quem já tem o TekaFlow se atualizar sem baixar tudo de novo.
  const { createPackage } = await import("@electron/asar")
  const { mkdtemp, copyFile, readFile, writeFile } = await import("node:fs/promises")
  const { createHash } = await import("node:crypto")
  const pacote = JSON.parse(await readFile(path.join(raiz, "package.json"), "utf8"))
  const tmp = await mkdtemp(path.join((await import("node:os")).tmpdir(), "tekaflow-leve-"))
  await cp(path.join(raiz, "electron"), path.join(tmp, "electron"), { recursive: true })
  await cp(path.join(raiz, "renderer"), path.join(tmp, "renderer"), { recursive: true })
  await copyFile(path.join(raiz, "package.json"), path.join(tmp, "package.json"))
  const nomeAsar = `tekaflow-mac-app-${pacote.version}.asar`
  const destAsar = path.join(raiz, "release", nomeAsar)
  await createPackage(tmp, destAsar)
  const bytes = await readFile(destAsar)
  await writeFile(path.join(raiz, "release", "tekaflow-mac-update.json"), JSON.stringify({ version: pacote.version, shellMin: pacote.shellMin, file: nomeAsar, sha512: createHash("sha512").update(bytes).digest("base64"), size: bytes.length }, null, 2) + "\n")
  console.log("Release gerada em app/release/")
  process.exit(0)
}
execSync(`pkill -x TekaFlow || true; rm -rf /Applications/TekaFlow.app; cp -R "${app}" /Applications/TekaFlow.app; ID=$(security find-identity -p codesigning | grep -q "TekaFlow Local" && echo "TekaFlow Local" || echo "-"); codesign --force --sign "$ID" /Applications/TekaFlow.app/Contents/Resources/fala; codesign --force --deep --sign "$ID" /Applications/TekaFlow.app; osascript -e 'tell application "Finder" to open POSIX file "/Applications/TekaFlow.app"'`, { stdio: "inherit", shell: "/bin/zsh" })
