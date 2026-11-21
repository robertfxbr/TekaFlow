// A ponte entre a tela e o sistema. A tela só enxerga `window.api`.
const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
  info: () => ipcRenderer.invoke("app:info"),
  listarSessoes: () => ipcRenderer.invoke("sessoes:listar"),
  lerConfig: () => ipcRenderer.invoke("config:ler"),
  salvarConfig: (chave, valor) => ipcRenderer.invoke("config:salvar", chave, valor),
  prepararCofre: () => ipcRenderer.invoke("cofre:preparar"),
  statusPermissoes: () => ipcRenderer.invoke("permissoes:status"),
  pedirPermissao: (id) => ipcRenderer.invoke("permissoes:pedir", id),
  abrirAjustes: (id) => ipcRenderer.invoke("permissoes:abrirAjustes", id),
  modelosIa: (id) => ipcRenderer.invoke("ia:modelos", id),
  escolherModelo: (id, modelo) => ipcRenderer.invoke("ia:modelo", id, modelo),
  desconectarIa: (id) => ipcRenderer.invoke("ia:desconectar", id),
  statusWhisper: () => ipcRenderer.invoke("whisper:status"),
  baixarWhisper: (id) => ipcRenderer.invoke("whisper:baixar", id),
  cancelarWhisper: (id) => ipcRenderer.invoke("whisper:cancelar", id),
  apagarWhisper: (id) => ipcRenderer.invoke("whisper:apagar", id),
  usarTranscricao: (id) => ipcRenderer.invoke("whisper:usar", id),
  aoProgressoWhisper: (retorno) => {
    const ouvinte = (_e, m) => retorno(m)
    ipcRenderer.on("whisper:progresso", ouvinte)
    return () => ipcRenderer.removeListener("whisper:progresso", ouvinte)
  },
  estadoIa: () => ipcRenderer.invoke("ia:estado"),
  conectarChatgpt: () => ipcRenderer.invoke("ia:chatgpt"),
  cancelarChatgpt: () => ipcRenderer.invoke("ia:chatgpt-cancelar"),
  verificarClaude: () => ipcRenderer.invoke("ia:claude"),
  conectarChave: (chave) => ipcRenderer.invoke("ia:chave", chave),
  selecionarIa: (id) => ipcRenderer.invoke("ia:selecionar", id),
  listarPasta: (pasta) => ipcRenderer.invoke("pasta:listar", pasta),
  transcreverTeste: (segundos) => ipcRenderer.invoke("teste:transcrever", segundos),
  transcreverAudio: (wav) => ipcRenderer.invoke("teste:transcrever-audio", wav),
  testarIa: (id) => ipcRenderer.invoke("teste:ia", id),
  perguntar: (pergunta, pasta, arquivos, curto, conversa) => ipcRenderer.invoke("ia:perguntar", pergunta, pasta, arquivos, curto, conversa),
  verificarAtualizacao: () => ipcRenderer.invoke("atualizacao:verificar"),
  baixarAtualizacao: () => ipcRenderer.invoke("atualizacao:baixar"),
  reiniciarParaAtualizar: () => ipcRenderer.invoke("atualizacao:reiniciar"),
  abrirPaginaDaVersao: (url) => ipcRenderer.invoke("atualizacao:pagina", url),
  abrirJanelaReuniao: () => ipcRenderer.invoke("reuniao:janela-abrir"),
  fecharJanelaReuniao: () => ipcRenderer.invoke("reuniao:janela-fechar"),
  iniciarReuniao: (dados) => ipcRenderer.invoke("reuniao:iniciar", dados),
  falarNaReuniao: (id, fala) => ipcRenderer.invoke("reuniao:falar", id, fala),
  sugerirNaReuniao: (id, s) => ipcRenderer.invoke("reuniao:sugerir", id, s),
  encerrarReuniao: (id) => ipcRenderer.invoke("reuniao:encerrar", id),
  abrirPastaDaReuniao: (pasta) => ipcRenderer.invoke("reuniao:abrirPasta", pasta),
  escolherPasta: () => ipcRenderer.invoke("pasta:escolher"),
  /** Menu Desenvolvimento: pede para a tela ir a uma etapa do onboarding (1 a 6) ou ao início ("inicio"). */
  aoPedirEtapa: (retorno) => {
    const ouvinte = (_evento, etapa) => retorno(etapa)
    ipcRenderer.on("dev:etapa", ouvinte)
    return () => ipcRenderer.removeListener("dev:etapa", ouvinte)
  },
})
