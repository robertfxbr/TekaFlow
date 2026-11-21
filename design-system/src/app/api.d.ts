/** A ponte que a janela do aplicativo oferece à tela. Só existe dentro do Electron. */
export type SessaoDoBanco = { id: string; inicio: number; fim: number | null; titulo: string; tag: string | null; perguntas: number }
export type Sessoes = { sessoes: SessaoDoBanco[]; totais: { sessoes: number; minutos: number; respostas: number } }
export type TekaApi = {
  info: () => Promise<{ versao: string; plataforma: string }>
  listarSessoes: () => Promise<Sessoes>
  lerConfig: () => Promise<Record<string, unknown>>
  salvarConfig: (chave: string, valor: unknown) => Promise<void>
  prepararCofre: () => Promise<boolean>
  statusPermissoes: () => Promise<{ mic: "liberada" | "pendente" | "negada"; tela: "liberada" | "pendente" | "negada"; voz: "liberada" | "pendente" | "negada" }>
  pedirPermissao: (id: string) => Promise<boolean>
  abrirAjustes: (id: string) => Promise<void>
  modelosIa: (id: string) => Promise<{ ok: boolean; erro?: string; modelos?: { id: string; nome: string; recomendado?: boolean }[] }>
  escolherModelo: (id: string, modelo: string) => Promise<unknown>
  desconectarIa: (id: string) => Promise<{ conectadas: string[]; ativa: string | null }>
  statusWhisper: () => Promise<{ motor: boolean; usando: string; modelos: Record<string, { baixado: boolean; baixando: boolean }> }>
  baixarWhisper: (id: string) => Promise<void>
  cancelarWhisper: (id: string) => Promise<void>
  apagarWhisper: (id: string) => Promise<void>
  usarTranscricao: (id: string) => Promise<void>
  aoProgressoWhisper: (retorno: (m: { id: string; pct?: number; erro?: string | null }) => void) => () => void
  estadoIa: () => Promise<{ conectadas: string[]; ativa: string | null; modelos?: Record<string, string> }>
  conectarChatgpt: () => Promise<{ ok: boolean; erro?: string }>
  cancelarChatgpt: () => Promise<void>
  verificarClaude: () => Promise<{ ok: boolean; erro?: string }>
  conectarChave: (chave: string) => Promise<{ ok: boolean; erro?: string; provedor?: "openai" | "anthropic" | "google" }>
  selecionarIa: (id: string) => Promise<unknown>
  listarPasta: (pasta: string) => Promise<{ nome: string; caminho: string; tamanho: number }[]>
  /** Ouve o microfone por alguns segundos com o Apple Speech (pt-BR) e devolve o que entendeu. */
  transcreverTeste: (segundos: number) => Promise<{ ok: boolean; texto?: string; erro?: string }>
  /** Manda uma pergunta mínima à IA conectada e em uso. */
  /** Reconhece a fala de um WAV (16 kHz, mono) gravado pelo app. */
  transcreverAudio: (wav: ArrayBuffer) => Promise<{ ok: boolean; texto?: string; erro?: string }>
  testarIa: (id?: string) => Promise<{ ok: boolean; ms?: number; erro?: string; modelo?: string; resposta?: string; perguntas?: string[]; acertos?: boolean[] }>
  /** Pergunta sobre os arquivos marcados da pasta, usando a IA em uso. `arquivos` são caminhos relativos à pasta. */
  perguntar: (pergunta: string, pasta: string, arquivos: string[], curto?: boolean, conversa?: string) => Promise<{ ok: boolean; texto?: string; fontes?: string[]; erro?: string }>
  verificarAtualizacao: () => Promise<{ ok: boolean; erro?: string; nova?: boolean; atual?: string; versao?: string; notas?: string; pagina?: string; podeInstalar?: boolean; tamanho?: number }>
  baixarAtualizacao: () => Promise<{ ok: boolean; erro?: string; versao?: string }>
  reiniciarParaAtualizar: () => Promise<{ ok: boolean }>
  abrirPaginaDaVersao: (url: string) => Promise<{ ok: boolean }>
  abrirJanelaReuniao: () => Promise<void>
  fecharJanelaReuniao: () => Promise<void>
  iniciarReuniao: (dados: { titulo?: string; transcricao?: string; modelo?: string; contexto?: unknown }) => Promise<{ id: string; pasta: string }>
  falarNaReuniao: (id: string, fala: { quem: "Você" | "Outros"; texto: string }) => Promise<boolean>
  sugerirNaReuniao: (id: string, s: { pergunta: string; resposta: string; fontes?: string[]; ms?: number }) => Promise<boolean>
  encerrarReuniao: (id: string) => Promise<boolean>
  abrirPastaDaReuniao: (pasta: string) => Promise<string>
  escolherPasta: () => Promise<string | null>
  /** Menu Desenvolvimento: a janela pede para ir a uma etapa. Devolve a função que cancela o pedido. */
  aoPedirEtapa: (retorno: (etapa: number | "inicio" | "refazer") => void) => () => void
}

declare global {
  interface Window {
    api?: TekaApi
  }
}
