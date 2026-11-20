// A janela do TekaFlow para Mac. Abre a tela inicial e guarda as sessões num banco local.
const { app, BrowserWindow, screen, Menu, ipcMain, shell, systemPreferences, dialog, session, desktopCapturer, safeStorage } = require("electron")
const path = require("node:path")
const fs = require("node:fs")
const db = require("./db.cjs")
const ia = require("./ia.cjs")
const whisper = require("./whisper.cjs")
const { criarReunioes } = require("./reunioes.cjs")
const atualizador = require("./atualizador.cjs")
const bundles = require("./appBundle.cjs")
const { execFile } = require("node:child_process")

/** O ajudante de voz fica em native/ no desenvolvimento e em Resources/ no app empacotado. */
const AJUDANTE = app.isPackaged ? path.join(process.resourcesPath, "fala") : path.join(__dirname, "..", "native", "fala")
const falarArgs = (args, ms) => new Promise((ok) => execFile(AJUDANTE, args, { timeout: ms }, (e, out) => ok(e ? "" : out.trim())))
const falar = (cmd) => new Promise((ok) => execFile(AJUDANTE, [cmd], { timeout: 60000 }, (e, out) => ok(e ? "pendente" : out.trim())))

// Fase de desenvolvimento: sem o pedido do cofre de senhas do Mac a cada versão nova. Antes do lançamento, isto sai e o app passa a ser assinado.
app.commandLine.appendSwitch("use-mock-keychain")

const LARGURA = 1040
const ALTURA = 640
let banco = null
let janelaPrincipal = null
let janelaReuniao = null

/** A reunião abre numa janelinha só dela, sem o app por trás: o app principal some enquanto ela existe. */
function abrirJanelaReuniao() {
  if (janelaReuniao && !janelaReuniao.isDestroyed()) { janelaReuniao.focus(); return }
  const area = screen.getPrimaryDisplay().workArea
  const w = 380, h = 620
  janelaReuniao = new BrowserWindow({
    width: w, height: h, x: area.x + area.width - w - 24, y: area.y + 24,
    frame: false, resizable: false, maximizable: false, fullscreenable: false, minimizable: true,
    alwaysOnTop: true, hasShadow: true, title: "TekaFlow, reunião", backgroundColor: "#25262A",
    webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  })
  janelaReuniao.setAlwaysOnTop(true, "floating")
  const dev = process.env.TEKA_DEV_URL
  if (dev) janelaReuniao.loadURL(dev + "#reuniao")
  else janelaReuniao.loadFile(path.join(__dirname, "..", "renderer", "app.html"), { hash: "reuniao" })
  if (janelaPrincipal && !janelaPrincipal.isDestroyed()) janelaPrincipal.hide()
  janelaReuniao.on("closed", () => {
    janelaReuniao = null
    if (janelaPrincipal && !janelaPrincipal.isDestroyed()) { janelaPrincipal.show(); janelaPrincipal.focus() }
  })
}

function criarJanela() {
  const janela = new BrowserWindow({
    width: LARGURA,
    height: ALTURA,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: "TekaFlow",
    backgroundColor: "#1A1B1E",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 13 },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  janela.once("ready-to-show", () => janela.show())

  // Para conferir a tela sem olhar: com TEKA_CAPTURA=<arquivo.png>, o aplicativo tira uma foto da janela e fecha.
  if (process.env.TEKA_CAPTURA) {
    janela.webContents.once("did-finish-load", () =>
      setTimeout(async () => {
        const imagem = await janela.webContents.capturePage()
        fs.writeFileSync(process.env.TEKA_CAPTURA, imagem.toPNG())
        app.quit()
      }, 3000)
    )
  }
  // Link para fora do app abre no navegador, nunca dentro da janela.
  janela.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  const dev = process.env.TEKA_DEV_URL
  if (dev) {
    janela.loadURL(dev)
  } else {
    const arquivo = path.join(__dirname, "..", "renderer", "app.html")
    if (!fs.existsSync(arquivo)) {
      janela.loadURL("data:text/html;charset=utf-8," + encodeURIComponent("<body style='font-family:system-ui;background:#1A1B1E;color:#fff;padding:40px'>A tela ainda não foi montada. Rode <code>npm run dev</code> ou <code>npm run empacotar</code>.</body>"))
    } else {
      janela.loadFile(arquivo)
    }
  }
  return janela
}

/** O menu do Mac, com um menu "Desenvolvimento" para pular entre as etapas do onboarding e refazê-lo do zero. */
function montarMenu() {
  const para = (etapa) => () => BrowserWindow.getFocusedWindow()?.webContents.send("dev:etapa", etapa)
  const etapas = [
    "Chegar", "Transcrição", "Cérebro", "Permissões e testes", "Contexto",
  ].map((nome, i) => ({ label: `${i + 1}. ${nome}`, click: para(i + 1) }))
  const modelo = [
    { role: "appMenu" },
    { role: "editMenu" },
    { role: "windowMenu" },
    {
      label: "Desenvolvimento",
      submenu: [
        { label: "Refazer o onboarding", accelerator: "CmdOrCtrl+Shift+O", click: para("refazer") },
        { type: "separator" },
        ...etapas,
        { label: "Tela inicial", click: para("inicio") },
        { type: "separator" },
        { role: "reload" },
        { role: "toggleDevTools" },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(modelo))
}

/** Modo passeio (só para conferência): com TEKA_PASSEIO=<pasta>, o app percorre as telas, tira uma foto de cada uma e fecha. */
async function passeio(janela, pasta) {
  fs.mkdirSync(pasta, { recursive: true })
  const wc = janela.webContents
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
  // O Radix só reage a mousedown/pointerdown, então o clique de teste manda a sequência completa.
  const clicar = (texto, indice = 0) => wc.executeJavaScript(`(() => { const lista = [...document.querySelectorAll("button,[role=tab]")].filter((x) => x.textContent.trim() === ${JSON.stringify(texto)}); const b = lista[${indice}]; if (!b) return false; for (const t of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) b.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); return true })()`)
  const digitar = (placeholder, valor) => wc.executeJavaScript(`(() => { const i = [...document.querySelectorAll("input")].find((x) => (x.placeholder || "").includes(${JSON.stringify(placeholder)})); if (!i) return false; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(i, ${JSON.stringify(valor)}); i.dispatchEvent(new Event("input", { bubbles: true })); return true })()`)
  let n = 0
  // Espera o texto esperado aparecer na tela antes de tirar a foto, para não fotografar a tela errada.
  const ate = async (texto, limite = 10000) => {
    const fim = Date.now() + limite
    while (Date.now() < fim) {
      if (await wc.executeJavaScript(`document.body.innerText.includes(${JSON.stringify(texto)})`)) return true
      await esperar(300)
    }
    return false
  }
  const foto = async (nome, texto) => {
    const achou = texto ? await ate(texto) : true
    await esperar(1500)
    const img = await wc.capturePage()
    n += 1
    fs.writeFileSync(path.join(pasta, `${String(n).padStart(2, "0")}-${nome}${achou ? "" : "-NAO-CARREGOU"}.png`), img.toPNG())
  }
  const etapa = (e) => wc.send("dev:etapa", e)
  await esperar(3000)
  const passos = [
    ["onboarding-1-chegar", "Fico por aqui"], ["onboarding-2-transcricao", "Como o TekaFlow vai ouvir"], ["onboarding-3-cerebro", "Conecte a IA"],
    ["onboarding-4-permissoes-e-testes", "Libere o que"], ["onboarding-5-contexto", "Dê contexto"],
  ]
  for (let i = 0; i < passos.length; i++) { etapa(i + 1); await foto(passos[i][0], passos[i][1]) }

  // Estados de erro e avisos do onboarding
  etapa(3); await ate("Conecte a IA")
  await clicar("Pular"); await foto("estado-cerebro-pular-aviso", "Escolha uma IA para continuar"); await clicar("Escolher uma IA"); await esperar(800)
  await clicar("Conectar", 0); await foto("estado-modal-chatgpt", "Entrar com o ChatGPT"); await clicar("Cancelar"); await esperar(800)
  await clicar("Conectar", 2); await ate("Conectar o Gemini"); await esperar(600)
  await digitar("AQ.Ab", "AQ.Ab8RN6FAKEKEYFAKEKEYFAKEKEY123456"); await esperar(500)
  await foto("estado-modal-gemini-chave-digitada", "Chave do Gemini reconhecida")
  await clicar("Testar e conectar"); await foto("estado-modal-gemini-chave-recusada", "recus"); await clicar("Cancelar"); await esperar(800)
  await clicar("Conectar", 3); await ate("Cole a sua chave"); await esperar(600)
  await digitar("sk-", "xyz123456"); await foto("estado-modal-chave-nao-reconhecida", "Não reconheci"); await clicar("Cancelar"); await esperar(800)
  etapa(4); await ate("Libere o que")
  await clicar("Testar", 3); await foto("estado-testar-ia-sem-conexao", "O que aconteceu")
  await clicar("Testar", 1); await foto("estado-testar-transcricao", "O que aconteceu")

  etapa("inicio"); await foto("app-inicio", "Bem-vindo")
  await clicar("Iniciar uma sessão"); await foto("estado-inicio-indisponivel", "Indisponível"); await clicar("Entendi"); await esperar(800)
  await clicar("Sessões"); await foto("app-sessoes", "Nenhuma sessão ainda")
  await clicar("Contexto"); await foto("app-contexto-sem-ia", "A IA não foi configurada")
  await clicar("Configurações"); await foto("config-modelos-transcricao", "Já está no seu Mac")
  await clicar("Análise"); await foto("config-modelos-analise", "Escolha qual IA vai responder")
  await clicar("Permissões"); await foto("config-permissoes", "Libere o que")
  await clicar("Geral"); await foto("config-geral", "Modo fantasma")
  await clicar("Atalhos"); await foto("config-atalhos", "Iniciar e parar a sessão")
  await clicar("Sobre"); await foto("config-sobre", "De onde veio")
  await clicar("Atualizar"); await foto("estado-config-atualizar-indisponivel", "Indisponível")
  app.quit()
}

app.whenReady().then(() => {
  banco = db.abrir(path.join(app.getPath("userData")))
  ipcMain.handle("app:info", () => ({ versao: atualizador.info().versao, plataforma: process.platform }))
  ipcMain.handle("atualizacao:verificar", () => atualizador.verificar())
  ipcMain.handle("atualizacao:baixar", () => atualizador.baixar())
  ipcMain.handle("atualizacao:reiniciar", () => atualizador.reiniciar())
  ipcMain.handle("atualizacao:pagina", (_e, url) => atualizador.abrirPagina(url))
  // A janela abriu: se o código veio de uma atualização, ela está boa e a marca de abertura sai.
  try { bundles.confirmBoot(app.getPath("userData")) } catch {}
  if (process.env.TEKA_LOG_VERSAO) { console.log("TEKA_VERSAO", JSON.stringify(atualizador.info())); setTimeout(() => app.quit(), 1500) }
  ipcMain.handle("sessoes:listar", () => db.listar(banco))
  const reunioes = criarReunioes(banco)
  reunioes.recuperar()
  ipcMain.handle("reuniao:janela-abrir", () => abrirJanelaReuniao())
  ipcMain.handle("reuniao:janela-fechar", () => { if (janelaReuniao && !janelaReuniao.isDestroyed()) janelaReuniao.close() })
  ipcMain.handle("reuniao:iniciar", (_e, dados) => reunioes.iniciar(dados || {}))
  ipcMain.handle("reuniao:falar", (_e, id, fala) => reunioes.falar(id, fala))
  ipcMain.handle("reuniao:sugerir", (_e, id, s) => reunioes.sugerir(id, s))
  ipcMain.handle("reuniao:encerrar", (_e, id) => reunioes.encerrar(id))
  ipcMain.handle("reuniao:abrirPasta", (_e, pasta) => shell.openPath(pasta))
  app.on("before-quit", () => { try { for (const id of reunioes.abertas()) reunioes.encerrar(id) } catch {} })
  ipcMain.handle("config:ler", () => db.lerConfig(banco))
  ipcMain.handle("config:salvar", (_e, chave, valor) => db.salvarConfig(banco, chave, valor))
  // Permissões reais do Mac. "voz" ainda não tem leitura própria: depende do ajudante do Apple Speech.
  const painel = { mic: "Privacy_Microphone", tela: "Privacy_ScreenCapture", voz: "Privacy_SpeechRecognition", acess: "Privacy_Accessibility" }
  const abrirAjustes = (id) => shell.openExternal(`x-apple.systempreferences:com.apple.preference.security?${painel[id]}`)
  const traduz = (st) => (st === "granted" ? "liberada" : st === "not-determined" ? "pendente" : "negada")
  session.defaultSession.setPermissionRequestHandler((_wc, permissao, cb) => cb(permissao === "media"))
  ipcMain.handle("permissoes:status", async () => ({
    voz: await falar("status"),
    mic: traduz(systemPreferences.getMediaAccessStatus("microphone")),
    tela: traduz(systemPreferences.getMediaAccessStatus("screen")),
  }))
  ipcMain.handle("permissoes:pedir", async (_e, id) => {
    if (id === "mic") {
      const ok = await systemPreferences.askForMediaAccess("microphone")
      if (!ok) abrirAjustes("mic")
      return ok
    }
    if (id === "tela") {
      // Tentar capturar é o que faz o app aparecer na lista de Gravação de tela e pede a permissão.
      // Se o Mac ainda não perguntou, a tentativa mostra o pedido dele; se já foi negado, só os Ajustes resolvem.
      if (systemPreferences.getMediaAccessStatus("screen") === "denied") { abrirAjustes("tela"); return false }
      await falar("tela")
      await desktopCapturer.getSources({ types: ["screen"], thumbnailSize: { width: 1, height: 1 } }).catch(() => {})
      return false
    }
    if (id === "voz") {
      const r = await falar("pedir")
      if (r === "negada") abrirAjustes("voz")
      return r === "liberada"
    }
    abrirAjustes(id)
    return false
  })
  // Mostra já na tela de permissões o pedido do cofre de senhas do Mac (onde ficam os logins das IAs), para não aparecer depois do nada.
  ipcMain.handle("cofre:preparar", () => { try { return safeStorage.isEncryptionAvailable() && !!safeStorage.encryptString("tekaflow") } catch { return false } })
  ipcMain.handle("permissoes:abrirAjustes", (_e, id) => abrirAjustes(id))
  ipcMain.handle("pasta:escolher", async () => {
    const r = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), { properties: ["openDirectory", "createDirectory"], title: "Escolha a pasta de contexto" })
    return r.canceled ? null : r.filePaths[0]
  })
  const conexoes = ia.criar(db, banco)
  ipcMain.handle("ia:estado", () => conexoes.estado())
  ipcMain.handle("ia:chatgpt", () => conexoes.conectarChatgpt())
  ipcMain.handle("ia:chatgpt-cancelar", () => conexoes.cancelarChatgpt())
  ipcMain.handle("ia:claude", () => conexoes.verificarClaude())
  ipcMain.handle("ia:chave", (_e, chave) => conexoes.conectarChave(String(chave).trim()))
  ipcMain.handle("ia:desconectar", (_e, id) => conexoes.desconectar(id))
  ipcMain.handle("ia:selecionar", (_e, id) => conexoes.selecionar(id))
  ipcMain.handle("pasta:listar", (_e, pasta) => {
    const ok = new Set([".pdf", ".md", ".txt"])
    const itens = []
    const andar = (dir, prof) => {
      if (prof > 3 || itens.length >= 300) return
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (f.name.startsWith(".")) continue
        const cam = path.join(dir, f.name)
        if (f.isDirectory()) andar(cam, prof + 1)
        else if (ok.has(path.extname(f.name).toLowerCase())) itens.push({ nome: f.name, caminho: path.relative(pasta, cam), tamanho: fs.statSync(cam).size })
      }
    }
    try { andar(pasta, 0) } catch {}
    return itens
  })
  // Áudio do computador: o teste pede a tela com áudio e o app entrega o som do sistema.
  session.defaultSession.setDisplayMediaRequestHandler(async (_req, cb) => {
    try {
      const fontes = await desktopCapturer.getSources({ types: ["screen"], thumbnailSize: { width: 1, height: 1 } })
      cb({ video: fontes[0], audio: "loopback" })
    } catch { cb({}) }
  })
  ipcMain.handle("teste:transcrever", async (_e, segundos) => {
    const n = Math.max(1, Math.min(15, Number(segundos) || 5))
    const out = await falarArgs(["transcrever", String(n)], (n + 40) * 1000)
    try { return JSON.parse(out.split("\n").filter(Boolean).pop()) } catch { return { ok: false, erro: "O reconhecimento de voz não respondeu." } }
  })
  ipcMain.handle("whisper:status", () => ({ ...whisper.status(), usando: db.lerConfig(banco).transcricao || "apple" }))
  ipcMain.handle("whisper:baixar", (e, id) => { void whisper.baixar(id, (m) => e.sender.send("whisper:progresso", m)) })
  ipcMain.handle("whisper:cancelar", (_e, id) => whisper.cancelar(id))
  ipcMain.handle("whisper:apagar", (_e, id) => { whisper.apagar(id); if ((db.lerConfig(banco).transcricao || "apple") === id) db.salvarConfig(banco, "transcricao", "apple") })
  ipcMain.handle("whisper:usar", (_e, id) => db.salvarConfig(banco, "transcricao", id))
  ipcMain.handle("teste:transcrever-audio", async (_e, wav) => {
    const arq = path.join(app.getPath("temp"), `tekaflow-voz-${Date.now()}.wav`)
    try {
      fs.writeFileSync(arq, Buffer.from(wav))
      const usando = db.lerConfig(banco).transcricao || "apple"
      if (usando !== "apple") return await whisper.transcrever(arq, usando)
      const out = await falarArgs(["arquivo", arq], 45000)
      return JSON.parse(out.split("\n").filter(Boolean).pop())
    } catch { return { ok: false, erro: "O reconhecimento de voz não respondeu." } } finally { fs.rm(arq, () => {}) }
  })
  let pergunta = null
  try { pergunta = require("./pergunta.cjs").criarPergunta(db, banco) } catch (e) { console.error("pergunta.cjs:", e.message) }
  ipcMain.handle("ia:modelos", (_e, id) => (pergunta ? pergunta.modelos(id) : { ok: false, erro: "A IA ainda não está pronta." }))
  ipcMain.handle("ia:modelo", (_e, id, modelo) => { const i = conexoes.estado(); i.modelos = { ...(i.modelos || {}), [id]: modelo }; db.salvarConfig(banco, "ia", i); return i })
  ipcMain.handle("teste:ia", (_e, id) => (pergunta ? pergunta.ping(id) : { ok: false, erro: "A IA ainda não está pronta." }))
  ipcMain.handle("ia:perguntar", (_e, texto, pasta, arquivos, curto, conversa) => (pergunta ? pergunta.perguntar({ pergunta: texto, pasta, arquivos, curto, conversa }) : { ok: false, erro: "A IA ainda não está pronta." }))
  montarMenu()
  janelaPrincipal = criarJanela()
  if (process.env.TEKA_PASSEIO) janelaPrincipal.webContents.once("did-finish-load", () => void passeio(janelaPrincipal, process.env.TEKA_PASSEIO))
  app.on("activate", () => { if (janelaReuniao && !janelaReuniao.isDestroyed()) return; if (BrowserWindow.getAllWindows().length === 0) janelaPrincipal = criarJanela(); else if (janelaPrincipal && !janelaPrincipal.isVisible()) janelaPrincipal.show() })
})

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit())
app.on("before-quit", () => banco?.close())
