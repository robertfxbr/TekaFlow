import { memo, useCallback, useEffect, useRef, useState } from "react"
import { IconAlertTriangle, IconCheck, IconChevronRight, IconCopy, IconFolder, IconPlayerStop, IconSparkles } from "@tabler/icons-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import gato from "@/assets/marca/gato-fundo-escuro.svg"
import { detectarPergunta, parecidas } from "./deteccao"
import { criarVad } from "./vad"
import { empacotarWav, iniciarGravacao, type Gravacao } from "./voz"

type Estado = "espera" | "rodando" | "ok" | "aviso" | "erro"
type Chave = "mic" | "trans" | "ia"
type Linha = { estado: Estado; nome: string }
type Aviso = { id: number; tom: "aviso" | "erro" | "info"; titulo: string; texto: string }
type Opcao = { id: string; nome: string }
type Fala = { id: number; tipo: "voce" | "outros"; fixo: string; rascunho: string; ultimo: number } | { id: number; tipo: "sugestao"; pergunta: string; texto: string; fontes: string[]; ms: number; estado: "pensando" | "ok" | "erro" }
type NovaFala = Fala extends infer U ? (U extends { id: number } ? Omit<U, "id"> : never) : never

const NOMES_TRANSCRICAO: Record<string, string> = { apple: "Apple Speech", small: "Whisper Small", medium: "Whisper Medium", turbo: "Whisper Large v3 Turbo", large: "Whisper Large v3" }
const NOMES_IA: Record<string, string> = { chatgpt: "ChatGPT", claude: "Claude Code", openai: "OpenAI", anthropic: "Claude", google: "Gemini" }
const ROTULOS: Record<Chave, string> = { mic: "Microfone", trans: "Transcrição", ia: "Modelo" }
const PRAZO_MS = 20000
const PAUSA_QUE_QUEBRA_MS = 3000
const SOM_MINIMO = 0.02
const TEMPO_DOS_AVISOS = 10000

/** As palavras entram uma a uma. Palavra nova, que chega com o texto crescendo, aparece na hora com um deslize curto. */
const Palavras = memo(function Palavras({ texto, atraso = 0 }: { texto: string; atraso?: number }) {
  return (
    <>
      {texto.split(" ").filter(Boolean).map((p, i) => (
        <span key={i} className="inline-block animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-200" style={atraso ? { animationDelay: `${i * atraso}ms` } : undefined}>{p}&nbsp;</span>
      ))}
    </>
  )
})

/** Copia o texto de um balão. Aparece ao passar o mouse. */
function BotaoCopiar({ texto, visivel = false }: { texto: string; visivel?: boolean }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      type="button"
      aria-label="Copiar"
      onClick={() => { void navigator.clipboard.writeText(texto).then(() => { setCopiado(true); window.setTimeout(() => setCopiado(false), 1500) }).catch(() => {}) }}
      className={cn("flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-opacity hover:bg-muted hover:text-foreground", visivel ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100")}
    >
      {copiado ? <IconCheck className="size-3.5" /> : <IconCopy className="size-3.5" />}
    </button>
  )
}

/** Três pontinhos que pulam: está ouvindo ou pensando. */
function Pontinhos() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Ouvindo">
      {[0, 1, 2].map((i) => <i key={i} className="size-1.5 animate-pulse rounded-full bg-current" style={{ animationDelay: `${i * 200}ms`, animationDuration: "1.2s" }} />)}
    </span>
  )
}

/** Ícone de estado de uma linha da conferência. */
function Selo({ estado }: { estado: Estado }) {
  const base = "flex size-5 shrink-0 items-center justify-center rounded-full"
  if (estado === "ok") return <span className={cn(base, "bg-success/20 text-success")}><IconCheck className="size-3" /></span>
  if (estado === "aviso") return <span className={cn(base, "bg-warning/20 text-warning")}><IconAlertTriangle className="size-3" /></span>
  if (estado === "erro") return <span className={cn(base, "bg-destructive/20 text-destructive")}><IconAlertTriangle className="size-3" /></span>
  if (estado === "rodando") return <span className={cn(base, "bg-muted text-muted-foreground")}><Spinner className="size-3" /></span>
  return <span className={cn(base, "bg-muted text-muted-foreground opacity-60")} />
}

async function nomeDoMicrofone(): Promise<string> {
  const config = await window.api!.lerConfig()
  const salvo = typeof config.microfone === "string" ? config.microfone.trim() : ""
  return salvo || "Padrão do sistema"
}

/** A janela da reunião: ao iniciar, confere microfone, transcrição e modelo. Nada disso para a reunião. */
export function Reuniao({ onSair, sozinha = false }: { onSair: () => void; /** Na janelinha própria: o painel ocupa a janela inteira. */ sozinha?: boolean }) {
  const [linhas, setLinhas] = useState<Record<Chave, Linha>>({
    mic: { estado: "espera", nome: "Padrão do sistema" },
    trans: { estado: "espera", nome: "Apple Speech" },
    ia: { estado: "espera", nome: "" },
  })
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [conferindo, setConferindo] = useState(true)
  const [encerrar, setEncerrar] = useState(false)
  const [opcoes, setOpcoes] = useState<Record<Chave, Opcao[]>>({ mic: [], trans: [], ia: [] })
  const [falas, setFalas] = useState<Fala[]>([])
  const falasRef = useRef<Fala[]>([])
  const publicar = useCallback(() => setFalas(falasRef.current.slice()), [])
  const [ouvindo, setOuvindo] = useState<{ mic: boolean; sis: boolean }>({ mic: false, sis: false })
  const rolo = useRef<HTMLDivElement>(null)
  const grudado = useRef(true)
  const [, setSalvoEm] = useState<string | null>(null)
  const [contexto, setContexto] = useState<{ caminho: string; nomePasta: string; arquivos: string[] } | null>(null)
  const contextoRef = useRef<typeof contexto>(null)
  useEffect(() => {
    window.api?.lerConfig().then((c) => {
      const x = c.contexto as { caminho?: string; nomePasta?: string; arquivos?: string[] } | null | undefined
      if (x?.caminho) { const v = { caminho: x.caminho, nomePasta: x.nomePasta ?? "Pasta", arquivos: x.arquivos ?? [] }; contextoRef.current = v; setContexto(v) }
    })
  }, [])
  const reuniaoId = useRef<string | null>(null)
  type FonteViva = { vad: ReturnType<typeof criarVad>; atual: Float32Array[]; fala: number | null; ocupado: boolean; ultimoRascunho: number; contador: number }
  const novaFonte = (): FonteViva => ({ vad: criarVad(), atual: [], fala: null, ocupado: false, ultimoRascunho: 0, contador: 0 })
  const aoVivo = useRef<{ mic: Gravacao | null; sis: Gravacao | null; fontes: Record<"mic" | "sis", FonteViva>; rapido: boolean; recentes: { t: number; texto: string }[] }>({ mic: null, sis: null, fontes: { mic: novaFonte(), sis: novaFonte() }, rapido: false, recentes: [] })
  const proximo = useRef(1)
  const temporizador = useRef<number | null>(null)
  const rodada = useRef(0)

  const mudar = useCallback((k: Chave, p: Partial<Linha>) => setLinhas((l) => ({ ...l, [k]: { ...l[k], ...p } })), [])
  const avisar = useCallback((a: Omit<Aviso, "id">) => setAvisos((l) => [...l, { ...a, id: proximo.current++ }]), [])

  // Quando há erro, aviso ou mensagem, tudo some depois de 10 segundos. Se deu tudo certo, a conferência some logo.
  const agendarSumico = useCallback((tudoCerto: boolean) => {
    if (temporizador.current) window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => { setConferindo(false); setAvisos([]) }, tudoCerto ? 900 : TEMPO_DOS_AVISOS)
  }, [])

  const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

  /** Microfone e transcrição juntos: escuta até captar uma fala que vire texto, por até 20 segundos. */
  const conferirVoz = useCallback(async (limite: number, vivo: () => boolean): Promise<boolean> => {
    mudar("mic", { estado: "rodando", nome: await nomeDoMicrofone() })
    const st = await window.api!.statusWhisper().catch(() => null)
    mudar("trans", { estado: "rodando", nome: NOMES_TRANSCRICAO[st?.usando ?? "apple"] ?? "Apple Speech" })
    let g: Gravacao
    try { g = await iniciarGravacao() } catch {
      mudar("mic", { estado: "erro" }); mudar("trans", { estado: "aviso" })
      avisar({ tom: "erro", titulo: "Não consegui abrir o microfone", texto: "Confira a permissão do microfone nos Ajustes do Mac ou escolha outra entrada." })
      return false
    }
    let ouviu = false, virouTexto = false
    let motivo: string | undefined
    while (vivo() && Date.now() < limite && !virouTexto) {
      await esperar(150)
      if (g.pico() < SOM_MINIMO) continue
      if (!ouviu) { ouviu = true; mudar("mic", { estado: "ok" }) }
      // Espera a fala acabar (voz baixa por 0,7 s) ou 6 s no máximo, e transcreve o que foi dito.
      const t0 = Date.now()
      let quieto = 0
      while (vivo() && Date.now() - t0 < 6000 && quieto < 700) { await esperar(100); quieto = g.nivel() < 0.05 ? quieto + 100 : 0 }
      const r = await window.api!.transcreverAudio(g.cortar()).catch(() => null)
      if (r?.ok && r.texto?.trim()) virouTexto = true
      else motivo = r?.erro
    }
    g.descartar()
    if (!vivo()) return false
    if (!ouviu) {
      mudar("mic", { estado: "aviso" }); mudar("trans", { estado: "aviso" })
      avisar({ tom: "aviso", titulo: "Não estamos captando som", texto: "O microfone não envia nada. Se você continuar assim, a reunião não será transcrita. Ela segue aberta e continua tentando." })
      return false
    }
    if (!virouTexto) {
      mudar("trans", { estado: "aviso" })
      avisar({ tom: "aviso", titulo: "A fala não virou texto", texto: motivo ?? "O microfone captou som, mas nenhuma fala foi reconhecida." })
      return false
    }
    mudar("trans", { estado: "ok" })
    return true
  }, [avisar, mudar])

  /** Pergunta de teste à IA, repetida até dar certo ou acabar o prazo. */
  const conferirModelo = useCallback(async (limite: number, vivo: () => boolean): Promise<boolean> => {
    const est = await window.api!.estadoIa().catch(() => null)
    const ativa = est?.ativa ?? null
    const nome = ativa ? (est?.modelos?.[ativa] ?? NOMES_IA[ativa] ?? ativa) : "Sem IA"
    mudar("ia", { estado: "rodando", nome })
    if (!ativa) {
      mudar("ia", { estado: "erro" })
      avisar({ tom: "erro", titulo: "Nenhuma IA conectada", texto: "Conecte uma IA em Configurações para receber sugestões." })
      return false
    }
    let erro: string | undefined
    while (vivo() && Date.now() < limite) {
      const r = await window.api!.testarIa().catch(() => ({ ok: false as const, erro: "A IA não respondeu." }))
      if (!vivo()) return false
      if (r.ok) { mudar("ia", { estado: "ok", nome: r.modelo ?? nome }); return true }
      erro = r.erro
      await esperar(2500)
    }
    if (!vivo()) return false
    mudar("ia", { estado: "erro" })
    avisar({ tom: "erro", titulo: "O modelo não respondeu", texto: erro ?? "Escolha outro modelo e tente de novo." })
    return false
  }, [avisar, mudar])

  const adicionar = useCallback((f: NovaFala) => { const id = proximo.current++; falasRef.current.push({ ...f, id } as Fala); publicar(); return id }, [publicar])
  const atualizarFala = useCallback((id: number, p: Partial<Fala>) => { falasRef.current = falasRef.current.map((f) => (f.id === id ? ({ ...f, ...p } as Fala) : f)); publicar() }, [publicar])

  /** Põe texto na fala em andamento de uma fonte. Quem fala em seguida continua no mesmo balão; só uma pausa de verdade abre outro. */
  const aplicar = useCallback((fonte: "mic" | "sis", p: { final?: string; rascunho?: string }) => {
    const tipo = fonte === "mic" ? "voce" : "outros"
    const agora = Date.now()
    const l = falasRef.current
    const ult = l[l.length - 1]
    const mesma = ult && ult.tipo === tipo ? ult : null
    const pausa = mesma ? agora - mesma.ultimo : Infinity
    // Junta enquanto a pausa for curta; 3 segundos de silêncio abrem outro balão.
    const junta = mesma && pausa < PAUSA_QUE_QUEBRA_MS
    let alvo: Extract<Fala, { fixo: string }>
    if (junta && mesma) alvo = mesma as typeof alvo
    else { alvo = { id: proximo.current++, tipo, fixo: "", rascunho: "", ultimo: agora }; l.push(alvo) }
    if (p.final !== undefined) { alvo.fixo = `${alvo.fixo} ${p.final}`.trim(); alvo.rascunho = "" }
    // Estabilidade: um rascunho que encolhe sem terminar a fala é só o reconhecedor hesitando; não deixa o texto piscar.
    if (p.rascunho !== undefined && (p.rascunho === "" || p.rascunho.length >= alvo.rascunho.length || p.rascunho.split(" ")[0] !== alvo.rascunho.split(" ")[0])) alvo.rascunho = p.rascunho
    alvo.ultimo = agora
    publicar()
    setOuvindo((o) => (o[fonte] ? { ...o, [fonte]: false } : o))
  }, [publicar])

  /** Pede a sugestão de resposta à IA, com a pasta de contexto quando houver. */
  const sugerir = useCallback(async (pergunta: string) => {
    const t0 = Date.now()
    const id = adicionar({ tipo: "sugestao", pergunta, texto: "", fontes: [], ms: 0, estado: "pensando" })
    const escolhidos = contextoRef.current?.arquivos ?? []
    // O que você e os outros disseram até agora (as últimas falas) ajuda a sugestão a complementar, não só a responder a pergunta.
    const conversa = falasRef.current.filter((f): f is Extract<Fala, { fixo: string }> => f.tipo !== "sugestao").slice(-10).map((f) => `${f.tipo === "voce" ? "Você" : "Outros"}: ${`${f.fixo} ${f.rascunho}`.trim()}`).join("\n")
    const r = await window.api!.perguntar(pergunta, contextoRef.current?.caminho ?? "", escolhidos, true, conversa).catch(() => ({ ok: false as const, texto: undefined, fontes: undefined }))
    const ms = Date.now() - t0
    atualizarFala(id, { estado: r.ok && r.texto ? "ok" : "erro", texto: r.texto ?? "", fontes: r.fontes ?? [], ms } as Partial<Fala>)
    if (r.ok && r.texto && reuniaoId.current) void window.api!.sugerirNaReuniao(reuniaoId.current, { pergunta, resposta: r.texto, fontes: r.fontes, ms })
  }, [adicionar, atualizarFala])

  /** Fim de uma fala: a transcrição final troca o rascunho, é salva na hora e, se os outros perguntaram, sai a sugestão. */
  const fecharFala = useCallback(async (fonte: "mic" | "sis") => {
    const ao = aoVivo.current
    const s = ao.fontes[fonte]
    const quadros = s.atual
    const numero = s.fala
    s.atual = []; s.fala = null
    setOuvindo((o) => ({ ...o, [fonte]: false }))
    if (numero === null) return
    const limparRascunho = () => { const u = falasRef.current[falasRef.current.length - 1]; if (u && u.tipo === (fonte === "mic" ? "voce" : "outros") && u.rascunho) aplicar(fonte, { rascunho: "" }) }
    if (quadros.reduce((n, q) => n + q.length, 0) < 4800) return limparRascunho() // menos de 0,3 s: ruído
    const r = await window.api!.transcreverAudio(empacotarWav(quadros)).catch(() => null)
    const texto = r?.ok ? r.texto?.trim() : ""
    if (!texto) return limparRascunho()
    const agora = Date.now()
    ao.recentes = ao.recentes.filter((x) => agora - x.t < 10000)
    if (fonte === "mic" && ao.recentes.some((x) => parecidas(texto, x.texto) >= 0.6)) return limparRascunho() // eco da caixa de som
    if (fonte === "sis") ao.recentes.push({ t: agora, texto })
    aplicar(fonte, { final: texto })
    if (reuniaoId.current) void window.api!.falarNaReuniao(reuniaoId.current, { quem: fonte === "mic" ? "Você" : "Outros", texto })
    if (fonte === "sis") { const p = detectarPergunta(texto); if (p) void sugerir(p) }
  }, [aplicar, sugerir])

  /** Cada quadro de áudio passa pelo detector de fala. O rascunho do que está sendo dito aparece quase na hora. */
  const aoQuadro = useCallback((fonte: "mic" | "sis") => (quadro: Float32Array) => {
    const ao = aoVivo.current
    const s = ao.fontes[fonte]
    const r = s.vad.empurrar(quadro)
    if (r.enviar.length) s.atual.push(...r.enviar)
    if (r.comecou) { s.fala = ++s.contador; setOuvindo((o) => ({ ...o, [fonte]: true })) }
    if (r.fim) { void fecharFala(fonte); return }
    const numero = s.fala
    const semEco = !(fonte === "mic" && ao.recentes.some((x) => Date.now() - x.t < 10000))
    if (numero !== null && ao.rapido && semEco && !s.ocupado && Date.now() - s.ultimoRascunho > 600) {
      s.ocupado = true; s.ultimoRascunho = Date.now()
      void window.api!.transcreverAudio(empacotarWav(s.atual)).then((rr) => {
        if (s.fala === numero && rr.ok && rr.texto?.trim()) aplicar(fonte, { rascunho: rr.texto.trim() })
      }).catch(() => {}).finally(() => { s.ocupado = false })
    }
  }, [aplicar, fecharFala])

  /** Depois da conferência: abre a reunião no disco e passa a ouvir você e os outros. A reunião segue mesmo sem som. */
  const comecarAoVivo = useCallback(async () => {
    if (reuniaoId.current) return
    const st = await window.api!.statusWhisper().catch(() => null)
    const est = await window.api!.estadoIa().catch(() => null)
    aoVivo.current.rapido = (st?.usando ?? "apple") === "apple" // rascunho em tempo real só com o Apple Speech, que responde em instantes
    const criada = await window.api!.iniciarReuniao({
      titulo: "Reunião",
      transcricao: NOMES_TRANSCRICAO[st?.usando ?? "apple"] ?? "Apple Speech",
      modelo: est?.ativa ? (est.modelos?.[est.ativa] ?? NOMES_IA[est.ativa] ?? est.ativa) : undefined,
      contexto: contextoRef.current ? { pasta: contextoRef.current.caminho, nome: contextoRef.current.nomePasta, arquivos: contextoRef.current.arquivos } : null,
    }).catch(() => null)
    if (criada) { reuniaoId.current = criada.id; setSalvoEm(criada.pasta) }
    else avisar({ tom: "erro", titulo: "Não consegui salvar a reunião", texto: "A transcrição aparece na tela, mas não está sendo guardada no disco." })
    const ao = aoVivo.current
    ao.mic = await iniciarGravacao("mic", aoQuadro("mic")).catch(() => null)
    ao.sis = await iniciarGravacao("sistema", aoQuadro("sis")).catch(() => null)
    if (!ao.sis) avisar({ tom: "aviso", titulo: "Não estou ouvindo os outros", texto: "Libere a gravação de tela nos Ajustes do Mac para o TekaFlow captar o som da chamada. Sua fala continua sendo transcrita." })
  }, [aoQuadro, avisar])

  const encerrarTudo = useCallback(async () => {
    const ao = aoVivo.current
    ao.mic?.descartar(); ao.sis?.descartar()
    ao.mic = null; ao.sis = null
    if (reuniaoId.current) { const id = reuniaoId.current; reuniaoId.current = null; await window.api!.encerrarReuniao(id) }
  }, [])

  /** Roda a conferência a partir de uma etapa, por até 20 segundos, até os três dar certo. Nada aqui para a reunião. */
  const conferir = useCallback(async (desde: Chave) => {
    const minha = ++rodada.current
    const vivo = () => minha === rodada.current
    setConferindo(true)
    if (temporizador.current) window.clearTimeout(temporizador.current)
    setAvisos((l) => l.filter((a) => a.tom === "info"))
    const limite = Date.now() + PRAZO_MS
    const [voz, modelo] = await Promise.all([desde === "ia" ? Promise.resolve(true) : conferirVoz(limite, vivo), conferirModelo(limite, vivo)])
    if (!vivo()) return
    agendarSumico(voz && modelo)
    void comecarAoVivo()
  }, [agendarSumico, comecarAoVivo, conferirModelo, conferirVoz])

  useEffect(() => { void conferir("mic"); return () => { rodada.current++; if (temporizador.current) window.clearTimeout(temporizador.current) } }, [conferir])
  useEffect(() => () => { void encerrarTudo() }, [encerrarTudo])
  // Desce sozinho só enquanto você está no fim. Se subir para ler, o chat não puxa de volta.
  useEffect(() => { const el = rolo.current; if (el && grudado.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }) }, [avisos, falas, ouvindo])

  const carregarOpcoes = async (k: Chave) => {
    if (k === "mic") {
      await navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => s.getTracks().forEach((t) => t.stop())).catch(() => {})
      const entradas = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput" && d.label)
      setOpcoes((o) => ({ ...o, mic: [{ id: "", nome: "Padrão do sistema" }, ...entradas.map((d) => ({ id: d.label, nome: d.label }))] }))
    }
    if (k === "trans") {
      const st = await window.api!.statusWhisper().catch(() => null)
      const instalados = Object.entries(st?.modelos ?? {}).filter(([, m]) => m.baixado).map(([id]) => ({ id, nome: NOMES_TRANSCRICAO[id] ?? id }))
      setOpcoes((o) => ({ ...o, trans: [{ id: "apple", nome: "Apple Speech" }, ...instalados] }))
    }
    if (k === "ia") {
      const est = await window.api!.estadoIa().catch(() => null)
      if (!est?.ativa) return setOpcoes((o) => ({ ...o, ia: [] }))
      const r = await window.api!.modelosIa(est.ativa).catch(() => null)
      setOpcoes((o) => ({ ...o, ia: (r?.modelos ?? []).map((m) => ({ id: m.id, nome: m.nome })) }))
    }
  }

  const escolher = async (k: Chave, o: Opcao) => {
    if (k === "mic") await window.api!.salvarConfig("microfone", o.id)
    if (k === "trans") await window.api!.usarTranscricao(o.id)
    if (k === "ia") {
      const est = await window.api!.estadoIa()
      if (est.ativa) await window.api!.escolherModelo(est.ativa, o.id)
    }
    avisar({ tom: "info", titulo: `Troquei ${k === "mic" ? "o microfone" : k === "trans" ? "a transcrição" : "o modelo"}`, texto: `Agora uso ${o.nome}. Vou conferir de novo.` })
    void conferir(k === "ia" ? "ia" : k)
  }

  const modelo = linhas.ia.nome
  return (
    <div className={cn("relative bg-muted/30", sozinha ? "h-svh bg-card" : "h-full")}>
      <div className={cn("flex flex-col gap-3 py-4", sozinha ? "h-full" : "absolute top-4 right-4 bottom-4 w-88 rounded-2xl border bg-card/90 shadow-lg backdrop-blur")}>
        <div className="flex items-center gap-2 px-4" style={sozinha ? ({ WebkitAppRegion: "drag" } as React.CSSProperties) : undefined}>
          <img src={gato} alt="TekaFlow" className="size-6" /><span className="font-heading text-sm font-medium">Reunião</span>
          <span className="flex-1" />
          <Button variant="destructive" size="sm" style={sozinha ? ({ WebkitAppRegion: "no-drag" } as React.CSSProperties) : undefined} onClick={() => setEncerrar(true)}><IconPlayerStop /> Parar</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b px-4 pb-3">
          <Badge variant="muted" title={contexto?.caminho}><IconFolder /> {contexto ? `${contexto.nomePasta} · ${contexto.arquivos.length} ${contexto.arquivos.length === 1 ? "arquivo" : "arquivos"}` : "Sem pasta de contexto"}</Badge>
          {modelo ? <Badge variant="muted"><IconSparkles /> {modelo}</Badge> : null}
        </div>

        <div ref={rolo} onScroll={(e) => { const el = e.currentTarget; grudado.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48 }} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4" aria-live="polite">
          {falas.length === 0 && !conferindo ? <p className="text-sm text-muted-foreground">Ouvindo. As falas aparecem aqui.</p> : null}
          {falas.map((f) => f.tipo === "sugestao" ? (
            <div key={f.id} className="flex animate-in flex-col gap-1 fade-in slide-in-from-bottom-2 duration-300">
              <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground"><img src={gato} alt="" className={cn("size-4", f.estado === "pensando" && "animate-pulse")} /> SUGIRO DIZER</span>
              <div className="rounded-xl border bg-primary/10 p-3 text-sm">
                {f.estado === "pensando" ? <span className="flex items-center gap-2 text-muted-foreground"><Pontinhos /> Pensando</span> : f.estado === "erro" ? <span className="text-destructive">Não consegui sugerir uma resposta.</span> : (
                  <><p><Palavras texto={f.texto} atraso={35} /></p><div className="mt-1 flex justify-end"><BotaoCopiar texto={f.texto} visivel /></div><p className="mt-1 text-xs text-muted-foreground">{f.fontes.length ? `${f.fontes.join(", ")} · ` : ""}em {(f.ms / 1000).toFixed(1).replace(".", ",")} s</p></>
                )}
              </div>
            </div>
          ) : (
            <div key={f.id} className={cn("group flex animate-in flex-col gap-1 fade-in slide-in-from-bottom-2 duration-200", f.tipo === "voce" && "items-end")}>
              <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground">{f.tipo === "voce" ? "VOCÊ" : <><img src={gato} alt="" className="size-4" /> OUTROS</>}</span>
              <div className={cn("flex max-w-[90%] items-end gap-1", f.tipo === "voce" && "flex-row-reverse")}>
                <div className={cn("rounded-2xl px-3 py-2 text-sm", f.tipo === "voce" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <Palavras texto={f.fixo} />
                  {f.rascunho ? <span className="opacity-70"><Palavras texto={f.rascunho} /></span> : null}
                </div>
                <BotaoCopiar texto={`${f.fixo} ${f.rascunho}`.trim()} />
              </div>
            </div>
          ))}
          {(["sis", "mic"] as const).filter((k) => ouvindo[k]).map((k) => (
            <div key={`ouvindo-${k}`} className={cn("flex animate-in flex-col gap-1 fade-in duration-200", k === "mic" && "items-end")}>
              <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground">{k === "mic" ? "VOCÊ" : <><img src={gato} alt="" className="size-4" /> OUTROS</>}</span>
              <div className={cn("rounded-2xl px-3 py-2 text-sm", k === "mic" ? "bg-primary text-primary-foreground" : "bg-muted")}><Pontinhos /></div>
            </div>
          ))}
          {avisos.map((a) => (
            <div key={a.id} className={cn("flex flex-col gap-1 rounded-xl border p-3 text-sm", a.tom === "aviso" && "border-warning/50 bg-warning/10", a.tom === "erro" && "border-destructive/50 bg-destructive/10", a.tom === "info" && "bg-muted")}>
              <span className={cn("flex items-center gap-2 font-medium", a.tom === "aviso" && "text-warning", a.tom === "erro" && "text-destructive")}>
                {a.tom !== "info" ? <IconAlertTriangle className="size-4" /> : null}{a.titulo}
              </span>
              <span className="text-muted-foreground">{a.texto}</span>
            </div>
          ))}
        </div>

        {conferindo ? (
          <div className="mx-4 rounded-xl border bg-background">
            {(["mic", "trans", "ia"] as Chave[]).map((k, i) => (
              <DropdownMenu key={k} onOpenChange={(a) => a && void carregarOpcoes(k)}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-xs outline-none hover:bg-muted/50", i > 0 && "border-t")}>
                    <Selo estado={linhas[k].estado} />
                    <b className="font-semibold whitespace-nowrap">{ROTULOS[k]}:</b>
                    <span className={cn("min-w-0 flex-1 truncate text-right text-muted-foreground", linhas[k].estado === "aviso" && "text-warning", linhas[k].estado === "erro" && "text-destructive")}>
                      {linhas[k].estado === "aviso" ? (k === "mic" ? "sem som" : "sem fala") : linhas[k].estado === "erro" ? "erro" : linhas[k].nome}
                    </span>
                    <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="max-h-64 w-72 overflow-y-auto">
                  {opcoes[k].length === 0 ? <div className="px-2 py-1.5 text-xs text-muted-foreground">Carregando…</div> : opcoes[k].map((o) => (
                    <DropdownMenuItem key={o.id} onSelect={() => void escolher(k, o)}>
                      <span className="truncate">{o.nome}</span>
                      {o.nome === linhas[k].nome || (k === "mic" && o.id === "" && linhas.mic.nome === "Padrão do sistema") ? <IconCheck className="ml-auto size-4 text-primary" /> : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        ) : null}
        <p className="px-4 text-xs text-muted-foreground">{conferindo && linhas.mic.estado === "rodando" ? "Diga uma frase. Confiro por até 20 segundos." : " "}</p>
      </div>

      <AlertDialog open={encerrar} onOpenChange={setEncerrar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar a reunião?</AlertDialogTitle>
            <AlertDialogDescription>Você volta para a tela inicial.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { void encerrarTudo().then(onSair) }}>Encerrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
