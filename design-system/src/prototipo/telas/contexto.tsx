import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { IconAlertTriangle, IconArrowsExchange, IconArrowUp, IconFile, IconFolder, IconLock, IconMessageCircle, IconMicrophone, IconRefresh, IconTrash, IconX } from "@tabler/icons-react"

import { GatoAnimado } from "@/components/gato-animado"
import { Palavras, Pontos } from "@/components/conversa"
import { iniciarGravacao, type Gravacao } from "@/app/voz"
import { OnboardingFrame } from "@/components/onboarding-frame"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { useNaoImplementado, useNavegacao } from "../contexto"

const ARQUIVOS = [
  { nome: "briefing-vaga.md", tamanho: "4 KB", ok: true },
  { nome: "perfil-empresa.pdf", tamanho: "1,2 MB", ok: true },
  { nome: "historico-projetos.md", tamanho: "9 KB", ok: true },
  { nome: "notas-entrevista.txt", tamanho: "2 KB", ok: true },
  { nome: "gravacao-teste.mov", tamanho: "380 MB", ok: false },
]

const SUGESTOES = [
  "Resuma os pontos principais",
  "O que devo lembrar antes da conversa?",
  "Quais datas e prazos aparecem?",
  "Que perguntas podem surgir?",
]

const PERGUNTA = "Resuma os pontos principais dos arquivos."
const RESPOSTA =
  "Os arquivos descrevem a vaga, o perfil da empresa e o seu histórico de projetos. Os pontos principais são o foco em filas de mensagens e a migração do checkout."
const FONTES_EXEMPLO = ["briefing-vaga.md", "historico-projetos.md"]
const ERRO_PADRAO = "Não consegui falar com a IA agora."

type Turno = { id: number; pergunta: string; status: "pensando" | "ok" | "erro"; texto?: string; fontes?: string[]; erro?: string }

/** Uma pergunta e a resposta da IA, com a coreografia da tela 1: a pergunta sobe, a IA pensa, o texto se forma e as fontes aparecem. O texto vem de fora e pode demorar ou falhar. */
function ConversaTurno({ turno, ultimo, aoTentar, aoTrocarIa }: { turno: Turno; ultimo: boolean; aoTentar: () => void; aoTrocarIa?: () => void }) {
  const raiz = useRef<HTMLDivElement>(null)
  const { status, texto, fontes, erro } = turno
  // O gato fala enquanto a resposta é escrita, palavra por palavra, e depois volta ao normal.
  const [falando, setFalando] = useState(false)
  useEffect(() => {
    if (status !== "ok") return
    setFalando(true)
    const t = window.setTimeout(() => setFalando(false), 600 + (texto ?? "").split(/\s+/).length * 70)
    return () => window.clearTimeout(t)
  }, [status, texto])

  // Entrada: a pergunta sobe e depois a resposta da IA.
  useLayoutEffect(() => {
    const el = raiz.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (reduzido) return void gsap.set(q(".msg-usuario, .msg-ia"), { autoAlpha: 1, y: 0 })
      gsap.set(q(".msg-usuario, .msg-ia"), { autoAlpha: 0, y: 24 })
      const subir = { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
      gsap.timeline().to(q(".msg-usuario"), subir, 0.1).to(q(".msg-ia"), subir, "+=0.4")
    }, el)
    return () => ctx.revert()
  }, [])

  // Pensando: o gato balança e os pontinhos pulam enquanto a resposta não chega.
  useLayoutEffect(() => {
    const el = raiz.current
    if (!el || status !== "pensando") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const q = gsap.utils.selector(el)
    const ctx = gsap.context(() => {
      gsap.to(q(".pensando"), { rotate: 8, scale: 1.12, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 })
      gsap.to(q(".ponto"), { y: -3, opacity: 1, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.12 })
    }, el)
    return () => ctx.revert()
  }, [status])

  // Chegada: o texto se forma palavra por palavra, depois as fontes e o feedback; ou o aviso de erro.
  useLayoutEffect(() => {
    const el = raiz.current
    if (!el || status === "pensando") return
    const q = gsap.utils.selector(el)
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (reduzido) return void gsap.set(q(".palavra, .erro, .fontes, .feedback"), { autoAlpha: 1, y: 0 })
      const tl = gsap.timeline()
      if (status === "erro") return void tl.fromTo(q(".erro"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" })
      tl.fromTo(q(".palavra"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.07 })
        .fromTo(q(".fontes"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "+=0.2")
        .fromTo(q(".feedback"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "+=0.2")
    }, el)
    return () => ctx.revert()
  }, [status])

  return (
    <div ref={raiz} className="flex flex-col gap-4">
      <div className="msg-usuario flex justify-end opacity-0">
        <Bubble align="end"><BubbleContent>{turno.pergunta}</BubbleContent></Bubble>
      </div>
      <div className="msg-ia opacity-0">
        <Bubble variant="muted" className="max-w-[92%]">
          <BubbleContent className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-medium">
              <GatoAnimado estado={status === "pensando" ? "pensando" : falando ? "falando" : "idle"} pensandoContente className="size-5 text-primary" /> TEKAFLOW
            </span>
            {status === "pensando" ? <Pontos classe="pontos" /> : null}
            {status === "ok" ? <span className="texto block"><Palavras texto={texto ?? ""} /></span> : null}
            {status === "ok" && fontes && fontes.length > 0 ? (
              <span className="fontes mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground opacity-0">
                Fontes
                {fontes.map((f) => (
                  <span key={f} className="inline-flex h-6 max-w-full items-center gap-1 rounded-full bg-background px-2"><IconFile className="size-3 shrink-0" /><span className="truncate">{f}</span></span>
                ))}
              </span>
            ) : null}
            {status === "erro" ? (
              <span className="erro flex flex-col gap-3 opacity-0" role="alert">
                <span className="flex items-start gap-2 text-sm">
                  <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {erro || ERRO_PADRAO}
                </span>
                {ultimo ? (
                  <span className="flex flex-wrap gap-2">
                    {aoTrocarIa ? <Button variant="outline" size="sm" onClick={aoTrocarIa}><IconArrowsExchange /> Trocar de IA</Button> : null}
                    <Button variant="outline" size="sm" onClick={aoTentar}><IconRefresh /> Tentar de novo</Button>
                  </span>
                ) : null}
              </span>
            ) : null}
          </BubbleContent>
        </Bubble>
      </div>
    </div>
  )
}

/** A pasta de contexto e o chat para conferir se a IA leu direito. Serve ao onboarding e à página Contexto do app.
 *  No app, a pergunta vai à IA de verdade. `aoTrocarIa` aparece como botão quando a IA falha. */
/** O que a pessoa já escolheu, para voltar à etapa e continuar de onde parou (vale enquanto o app está aberto). */
export const MEMORIA: { pasta: boolean; caminho: string | null; nomePasta: string; arquivos: typeof ARQUIVOS | null; marcados: Record<string, boolean> | null; turnos: Turno[] } = { pasta: false, caminho: null, nomePasta: "Entrevista Acme", arquivos: null, marcados: null, turnos: [] }

export function PastaEChat({ pastaInicial = false, aoTrocarIa, curto = false }: { pastaInicial?: boolean; aoTrocarIa?: () => void; /** Resposta bem curta e leitura enxuta: serve ao teste do onboarding. */ curto?: boolean }) {
  const noApp = Boolean(window.api)
  // No app não há pasta de exemplo: só vale uma pasta escolhida no disco.
  const [pasta, setPasta] = useState(noApp ? MEMORIA.pasta : pastaInicial)
  const [caminho, setCaminho] = useState<string | null>(noApp ? MEMORIA.caminho : null)
  const [turnos, setTurnos] = useState<Turno[]>(noApp ? MEMORIA.turnos.map((t) => (t.status === "pensando" ? { ...t, status: "erro" as const, erro: "A resposta foi interrompida. Tente de novo." } : t)) : [])
  const [texto, setTexto] = useState("")
  const [aviso, setAviso] = useState<string | null>(null)
  const proximo = useRef(1)
  const fim = useRef<HTMLDivElement>(null)
  // No app real, a pasta e a lista de arquivos (PDF, MD e TXT) vêm do disco; no protótipo, são de exemplo.
  const [nomePasta, setNomePasta] = useState(noApp ? MEMORIA.nomePasta : "Entrevista Acme")
  const [arquivos, setArquivos] = useState(noApp && MEMORIA.arquivos ? MEMORIA.arquivos : ARQUIVOS)
  const [marcados, setMarcados] = useState<Record<string, boolean>>(noApp && MEMORIA.marcados ? MEMORIA.marcados : Object.fromEntries(ARQUIVOS.map((a) => [a.nome, a.ok])))
  useEffect(() => {
    if (!noApp) return
    Object.assign(MEMORIA, { pasta, caminho, nomePasta, arquivos, marcados, turnos })
    // A janela da reunião é outra janela: leva a pasta de contexto pelo banco.
    if (pasta && caminho) void window.api?.salvarConfig("contexto", { caminho, nomePasta, arquivos: arquivos.filter((a) => marcados[a.nome]).map((a) => a.nome) })
  }, [noApp, pasta, caminho, nomePasta, arquivos, marcados, turnos])
  const total = Object.values(marcados).filter(Boolean).length
  // Voz no chat: clica no microfone para gravar; "apagar" descarta e "enviar" transcreve na hora com o modelo escolhido.
  // O texto entra no campo depois do que já estava escrito, com um espaço no meio.
  type ErroVoz = { tipo: "permissao" | "silencio" | "mic" | "texto"; negada?: boolean; texto?: string }
  const [gravando, setGravando] = useState(false)
  const [transcrevendo, setTranscrevendo] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [erroVoz, setErroVoz] = useState<ErroVoz | null>(null)
  const [nomeMic, setNomeMic] = useState("")
  const gravacao = useRef<Gravacao | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => { window.api?.lerConfig().then((c) => typeof c.microfone === "string" && setNomeMic(c.microfone)) }, [])
  const iniciarVoz = async () => {
    if (!window.api) return
    setErroVoz(null)
    const st = await window.api.statusPermissoes()
    if (st.mic !== "liberada") return setErroVoz({ tipo: "permissao", negada: st.mic === "negada" })
    try { gravacao.current = await iniciarGravacao(); setSegundos(0); setGravando(true) } catch { setErroVoz({ tipo: "mic" }) }
  }
  const apagarVoz = () => { gravacao.current?.descartar(); gravacao.current = null; setGravando(false) }
  const enviarVoz = async () => {
    const g = gravacao.current
    if (!g) return
    gravacao.current = null
    setGravando(false)
    setTranscrevendo(true)
    const pico = g.pico()
    const wav = await g.parar()
    if (pico < 0.02) { setTranscrevendo(false); return setErroVoz({ tipo: "silencio" }) }
    const r = await window.api!.transcreverAudio(wav)
    setTranscrevendo(false)
    const novo = r.texto?.trim()
    if (r.ok && novo) setTexto((t) => (t.trim() ? `${t.trimEnd()} ${novo}` : novo))
    else setErroVoz({ tipo: "texto", texto: r.erro ?? "Não entendi o que você disse. Tente de novo." })
  }
  useEffect(() => {
    if (!gravando) return
    const tempo = window.setInterval(() => setSegundos((n) => n + 1), 1000)
    const hist: number[] = []
    const amostra = window.setInterval(() => hist.push(Math.max(0.08, gravacao.current?.nivel() ?? 0)), 60)
    let raf = 0
    const desenhar = () => {
      const cv = canvas.current
      if (cv) {
        cv.width = 300
        cv.height = 60
        const ctx = cv.getContext("2d")!
        const passo = 8
        const n = Math.floor(300 / passo)
        while (hist.length > n) hist.shift()
        hist.forEach((v, i) => {
          const x = 300 - (hist.length - i) * passo
          const borda = Math.min(1, x / 50, (300 - x) / 6)
          const h = Math.max(5, v * 56)
          ctx.fillStyle = `rgba(197,239,107,${0.9 * Math.max(0, borda)})`
          ctx.beginPath()
          ctx.roundRect(x, (60 - h) / 2, 4, h, 2)
          ctx.fill()
        })
      }
      raf = requestAnimationFrame(desenhar)
    }
    desenhar()
    return () => { window.clearInterval(tempo); window.clearInterval(amostra); cancelAnimationFrame(raf) }
  }, [gravando])
  const tempoVoz = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`
  // Sem IA configurada não há como responder: o chat fica bloqueado e diz por quê.
  const [semIa, setSemIa] = useState(false)
  useEffect(() => { if (window.api) window.api.estadoIa().then((e) => setSemIa(!e.ativa)) }, [])
  const ocupado = turnos.some((t) => t.status === "pensando")

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [turnos.length, turnos[turnos.length - 1]?.status])

  const escolher = async () => {
    if (!window.api) return setPasta(true)
    const c = await window.api.escolherPasta()
    if (!c) return
    const itens = await window.api.listarPasta(c)
    const lista = itens.map((i) => ({ nome: i.caminho, tamanho: i.tamanho > 1048576 ? `${(i.tamanho / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(i.tamanho / 1024))} KB`, ok: i.tamanho <= 20 * 1048576 }))
    setArquivos(lista)
    setMarcados(Object.fromEntries(lista.map((a) => [a.nome, a.ok])))
    setNomePasta(c.split("/").pop() || c)
    setCaminho(c)
    setTurnos([])
    setAviso(null)
    setPasta(true)
  }

  const atualizar = (id: number, parte: Partial<Turno>) => setTurnos((ts) => ts.map((t) => (t.id === id ? { ...t, ...parte } : t)))

  /** Manda a pergunta de um turno à IA (ou simula, fora do app) e grava o resultado nele. */
  const responder = async (id: number, pergunta: string) => {
    atualizar(id, { status: "pensando", erro: undefined })
    if (!window.api) {
      window.setTimeout(() => atualizar(id, { status: "ok", texto: RESPOSTA, fontes: FONTES_EXEMPLO }), 2800)
      return
    }
    const escolhidos = arquivos.filter((a) => marcados[a.nome]).map((a) => a.nome)
    try {
      const r = await window.api.perguntar(pergunta, caminho ?? "", escolhidos, curto)
      if (r.ok && r.texto) atualizar(id, { status: "ok", texto: r.texto, fontes: r.fontes ?? [] })
      else atualizar(id, { status: "erro", erro: r.erro })
    } catch {
      atualizar(id, { status: "erro" })
    }
  }

  const nao = useNaoImplementado()
  const perguntar = (bruto: string) => {
    if (!pasta || ocupado) return
    const pergunta = bruto.trim() || (noApp ? "" : PERGUNTA)
    if (!pergunta) return
    if (noApp) {
      if (!caminho) return setAviso("Escolha uma pasta antes de perguntar.")
      if (total === 0) return setAviso("Marque pelo menos um arquivo para perguntar.")
    } else if (nao) {
      return nao("Perguntar sobre a pasta")
    }
    setAviso(null)
    setTexto("")
    const id = proximo.current++
    setTurnos((ts) => [...ts, { id, pergunta, status: "pensando" }])
    void responder(id, pergunta)
  }

  return (
    <div className="grid h-[22rem] grid-cols-[2fr_3fr] gap-6">
        {pasta ? (
          <Card padding="sm" className="min-h-0">
            <div className="flex items-center gap-2">
              <IconFolder className="size-5 text-primary" />
              <b className="text-sm">{nomePasta}</b>
              <span className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => { setPasta(false); setTurnos([]); setCaminho(null); setAviso(null) }}>Trocar</Button>
            </div>
            <ul className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-4">
              {arquivos.map((a) => (
                <li key={a.nome} className={cn("flex items-center gap-2 py-1 text-sm", !a.ok && "opacity-60")}>
                  <Checkbox checked={marcados[a.nome]} disabled={!a.ok} onCheckedChange={(v) => { setAviso(null); setMarcados((m) => ({ ...m, [a.nome]: v === true })) }} aria-label={a.nome} />
                  <span className="min-w-0 flex-1 truncate">{a.nome}</span>
                  <span className="text-xs text-muted-foreground">{a.ok ? a.tamanho : "grande demais"}</span>
                </li>
              ))}
            </ul>
            {arquivos.length === 0 ? <span className="text-sm text-muted-foreground">Nenhum PDF, Markdown ou texto nessa pasta.</span> : null}
            <span className="text-xs text-muted-foreground">{total} de {arquivos.length} arquivos selecionados</span>
          </Card>
        ) : (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon"><IconFolder /></EmptyMedia>
              <EmptyTitle>Escolher uma pasta</EmptyTitle>
              <EmptyDescription>Texto, Markdown e PDF</EmptyDescription>
            </EmptyHeader>
            <Button onClick={escolher}>Escolher pasta</Button>
          </Empty>
        )}

        <div className="flex min-h-0 flex-col gap-4">
          <Card padding="sm" className="min-h-0 flex-1 gap-4 overflow-y-auto">
            {!pasta ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <IconMessageCircle className="size-8" />
                <span className="text-sm">Escolha uma pasta para começar a perguntar</span>
              </div>
            ) : (
              <>
                {turnos.length === 0 ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-muted-foreground">Pergunte algo sobre os arquivos</span>
                    <div className="flex flex-wrap gap-2">
                      {SUGESTOES.map((s) => (
                        <Button key={s} variant="outline" size="sm" onClick={() => perguntar(s)}>{s}</Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  turnos.map((t, i) => (
                    <ConversaTurno key={t.id} turno={t} ultimo={i === turnos.length - 1} aoTrocarIa={aoTrocarIa} aoTentar={() => responder(t.id, t.pergunta)} />
                  ))
                )}
                <div ref={fim} />
              </>
            )}
          </Card>
          {semIa ? <span className="text-xs text-destructive" role="alert">A IA não foi configurada, não conseguirei fornecer respostas. Volte à etapa 3 e conecte uma.</span> : aviso ? <span className="text-xs text-destructive" role="alert">{aviso}</span> : null}
          {erroVoz ? (
            <div role="alert" className={cn("flex items-start gap-3 rounded-xl border p-3 text-sm", erroVoz.tipo === "permissao" ? "border-warning/45 bg-warning/10" : "border-destructive/45 bg-destructive/10")}>
              <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", erroVoz.tipo === "permissao" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive")}>{erroVoz.tipo === "permissao" ? <IconLock className="size-3.5" /> : <IconAlertTriangle className="size-3.5" />}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <b>{erroVoz.tipo === "permissao" ? "Precisamos da sua permissão para usar o microfone" : erroVoz.tipo === "silencio" ? "Não ouvi nada no microfone" : erroVoz.tipo === "mic" ? "Não consegui abrir o microfone" : "Não entendi o que você disse"}</b>
                <span className="text-muted-foreground">
                  {erroVoz.tipo === "permissao" ? (erroVoz.negada ? "O Mac recusou antes. Libere nos Ajustes para falar a pergunta." : "O Mac ainda não liberou o microfone para o TekaFlow. Sem isso, não dá para falar a pergunta.") : erroVoz.tipo === "silencio" ? `A gravação chegou em silêncio. Confira se ${nomeMic || "o microfone"} está ligado e perto, ou escolha outro em Permissões.` : erroVoz.tipo === "mic" ? "Outro app pode estar usando o microfone. Feche e tente de novo." : erroVoz.texto}
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {erroVoz.tipo === "permissao" ? (
                    <>
                      {!erroVoz.negada ? <Button size="sm" onClick={async () => { await window.api?.pedirPermissao("mic"); const st = await window.api?.statusPermissoes(); if (st?.mic === "liberada") setErroVoz(null) }}>Permitir</Button> : null}
                      <Button size="sm" variant={erroVoz.negada ? "default" : "outline"} onClick={() => void window.api?.abrirAjustes("mic")}>Abrir Ajustes do Mac</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => void iniciarVoz()}>Tentar de novo</Button>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Fechar" onClick={() => setErroVoz(null)}><IconX /></Button>
            </div>
          ) : null}
          {gravando ? (
            <div className="flex h-12 items-center gap-2 rounded-full border border-primary/50 bg-primary/5 px-1.5">
              <Button variant="ghost" size="icon" aria-label="Apagar a gravação" className="text-muted-foreground hover:text-destructive" onClick={apagarVoz}><IconTrash /></Button>
              <span className="size-2 animate-pulse rounded-full bg-destructive" aria-hidden />
              <span className="min-w-8 text-sm text-muted-foreground tabular-nums">{tempoVoz}</span>
              <span className="flex-1" />
              <canvas ref={canvas} className="h-7 w-36" aria-hidden />
              <Button size="icon" aria-label="Enviar a gravação" onClick={() => void enviarVoz()}><IconArrowUp /></Button>
            </div>
          ) : transcrevendo ? (
            <div className="flex h-12 items-center gap-3 rounded-full border px-5 text-sm text-muted-foreground" aria-live="polite">
              <Spinner className="size-4" /> Transcrevendo o que você disse…
            </div>
          ) : (
          <InputGroup className={cn((!pasta || semIa) && "pointer-events-none opacity-50")}>
            <InputGroupInput
              placeholder="Pergunte sobre a pasta"
              aria-label="Pergunta"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && perguntar(texto)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost" aria-label="Falar a pergunta" onClick={() => void iniciarVoz()}><IconMicrophone /></InputGroupButton>
              <InputGroupButton size="icon-xs" variant="default" aria-label="Enviar" disabled={ocupado} onClick={() => perguntar(texto)}><IconArrowUp /></InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          )}
        </div>
      </div>
  )
}

/** Tela 6: escolher a pasta de contexto e conferir se a IA leu direito. A leitura é simulada. */
export function Contexto() {
  const { voltar, avancar, irPara } = useNavegacao()
  return (
    <OnboardingFrame
      step={4}
      title="Dê contexto à IA com uma pasta"
      description="Escolha a pasta, pergunte por texto ou voz e confira se ela leu direito."
      onBack={voltar}
      onNext={avancar}
      onSkip={avancar}
      nextLabel="Concluir"
      skipLabel="Configurar depois"
    >
      <PastaEChat curto aoTrocarIa={irPara ? () => irPara(3) : undefined} />
    </OnboardingFrame>
  )
}
