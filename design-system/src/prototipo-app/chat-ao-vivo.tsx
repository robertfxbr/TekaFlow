import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { IconArrowUp, IconBolt, IconCheck, IconChevronDown, IconChevronUp, IconFolder, IconGhost, IconMaximize, IconMicrophone, IconMinus, IconPlayerStop, IconSparkles } from "@tabler/icons-react"
import gsap from "gsap"

import gato from "@/assets/marca/gato-fundo-escuro.svg"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Fala, Palavras, Pontos } from "@/components/conversa"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Fase = "mic" | "ia" | "aovivo"

/** Perguntas que "eles" fazem, com a sugestão de resposta e o arquivo de onde ela vem. */
const PERGUNTAS = [
  { pergunta: "Conta uma situação em que você discordou de uma decisão técnica do time.", sugestao: "Na migração do checkout, defendi manter a fila até medir a latência. Levei um teste de carga e o time revisou o plano.", arquivo: "briefing-vaga.md" },
  { pergunta: "Qual foi o maior erro que você cometeu em um projeto?", sugestao: "Subestimei a migração de dados do checkout. Hoje rodo um ensaio com dados reais antes de marcar a data.", arquivo: "historico-projetos.docx" },
  { pergunta: "Como você lida com prazo apertado?", sugestao: "Corto o escopo antes de cortar a qualidade e combino com o time o que fica para a próxima entrega.", arquivo: "notas-entrevista.txt" },
]

type Item =
  | { id: number; tipo: "sistema"; texto: string; extra?: "fala" }
  | { id: number; tipo: "voce"; texto: string; paraIA?: boolean }
  | { id: number; tipo: "ia"; texto: string }
  | { id: number; tipo: "eles"; pergunta: string; sugestao: string; arquivo: string }

/** Texto que se forma palavra por palavra, depois de um instante de "pensando" opcional. Cada instância anima uma vez, ao nascer. */
function Formando({ texto, pensando = 0 }: { texto: string; pensando?: number }) {
  const raiz = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = raiz.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (reduzido) {
        gsap.set(q(".palavra"), { display: "inline-block", autoAlpha: 1, y: 0 })
        gsap.set(q(".pontos"), { display: "none" })
        return
      }
      gsap.to(q(".ponto"), { y: -3, opacity: 1, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.12 })
      gsap.set(q(".palavra"), { display: "none", autoAlpha: 0, y: 8 })
      if (!pensando) gsap.set(q(".pontos"), { display: "none" })
      const tl = gsap.timeline()
      if (pensando) tl.to({}, { duration: pensando }).set(q(".pontos"), { display: "none" })
      tl.to(q(".palavra"), { display: "inline-block", autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06 })
    }, el)
    return () => ctx.revert()
  }, [texto, pensando])
  return (
    <span ref={raiz} className="block">
      {pensando ? <Pontos classe="pontos" /> : null}
      <Palavras texto={texto} />
    </span>
  )
}

/** Ondas em limão que mexem com a voz, na linha da gravação de áudio do app. */
function OndasAoVivo() {
  const raiz = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = raiz.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const barras = Array.from(el.children) as HTMLElement[]
    const id = window.setInterval(() => barras.forEach((b) => gsap.to(b, { height: gsap.utils.random(4, 22, 1), duration: 0.22, ease: "sine.inOut" })), 220)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span ref={raiz} className="flex h-6 items-center gap-0.5" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => <i key={i} className="w-0.5 rounded-full bg-primary" style={{ height: 4 + ((i * 7) % 14), opacity: 0.35 + (i / 22) * 0.65 }} />)}
    </span>
  )
}

const Rotulo = ({ children }: { children: React.ReactNode }) => <span className="text-xs font-medium tracking-wide text-muted-foreground">{children}</span>

type Props = {
  faseInicial: Fase
  medidoresInicial?: boolean
  minimizadoInicial?: boolean
  encerrarInicial?: boolean
  /** Cada vez que sobe, "eles" fazem uma nova pergunta. */
  pedidoPergunta: number
  onSair: () => void
}

/** A janela flutuante do chat ao vivo: teste de microfone, teste da IA e, se tudo der certo, a gravação começa sozinha. */
export function ChatAoVivo({ faseInicial, medidoresInicial = false, minimizadoInicial = false, encerrarInicial = false, pedidoPergunta, onSair }: Props) {
  const [fase, setFase] = useState<Fase>(faseInicial)
  const [minimizado, setMinimizado] = useState(minimizadoInicial)
  const [medidores, setMedidores] = useState(medidoresInicial)
  const [encerrar, setEncerrar] = useState(encerrarInicial)
  const [aba, setAba] = useState("transcricao")
  const [itens, setItens] = useState<Item[]>([])
  const [texto, setTexto] = useState("")
  const [segundos, setSegundos] = useState(faseInicial === "aovivo" ? 64 : 0)
  const [niveis, setNiveis] = useState([45, 20])
  const [micOk, setMicOk] = useState(false)
  const proximo = useRef(1)
  const fim = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const falou = useRef(false)
  const comecou = useRef(false)

  const novo = <T extends Omit<Item, "id">>(i: T) => setItens((l) => [...l, { ...(i as object), id: proximo.current++ } as Item])
  const depois = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms))

  // Estado de partida de cada cena
  useEffect(() => {
    if (comecou.current) return
    comecou.current = true
    if (faseInicial === "mic") novo({ tipo: "sistema", texto: "Vamos testar o microfone. Fale algo, por exemplo “olá, TekaFlow”.", extra: "fala" })
    if (faseInicial === "ia") {
      novo({ tipo: "voce", texto: "Olá, TekaFlow, está me ouvindo?" })
      novo({ tipo: "sistema", texto: "Microfone funcionando. Agora faça uma pergunta para eu ver se consigo responder." })
    }
    if (faseInicial === "aovivo") {
      const p = PERGUNTAS[0]
      novo({ tipo: "eles", ...p })
      novo({ tipo: "voce", texto: "Teve sim. Na migração do checkout eu achava arriscado trocar a fila sem medir antes." })
    }
  }, [])
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  // Cronômetro e medidores só na gravação
  useEffect(() => {
    if (fase !== "aovivo") return
    const t = window.setInterval(() => setSegundos((s) => s + 1), 1000)
    const n = window.setInterval(() => setNiveis([gsap.utils.random(20, 80, 1), gsap.utils.random(5, 60, 1)]), 450)
    return () => { window.clearInterval(t); window.clearInterval(n) }
  }, [fase])

  // Pedido de uma nova pergunta de "eles"
  const ultimoPedido = useRef(pedidoPergunta)
  useEffect(() => {
    if (pedidoPergunta === ultimoPedido.current) return
    ultimoPedido.current = pedidoPergunta
    if (fase !== "aovivo") return
    novo({ tipo: "eles", ...PERGUNTAS[pedidoPergunta % PERGUNTAS.length] })
  }, [pedidoPergunta, fase])

  useEffect(() => { fim.current?.scrollIntoView({ behavior: "smooth", block: "end" }) }, [itens, fase])

  const falar = () => {
    if (fase !== "mic" || falou.current) return
    falou.current = true
    novo({ tipo: "voce", texto: "Olá, TekaFlow, está me ouvindo?" })
    setMicOk(true)
    depois(1600, () => {
      novo({ tipo: "sistema", texto: "Microfone funcionando. Agora faça uma pergunta para eu ver se consigo responder." })
      setFase("ia")
    })
  }

  const enviar = (pergunta: string) => {
    const t = pergunta.trim()
    if (!t || fase === "mic") return
    setTexto("")
    novo({ tipo: "voce", texto: t, paraIA: true })
    depois(500, () => novo({ tipo: "ia", texto: "Consigo ouvir a conversa e sugerir o que você pode dizer, usando a IA que você conectou." }))
    if (fase === "ia") {
      depois(5200, () => novo({ tipo: "sistema", texto: "Tudo certo. Vou começar a gravar agora." }))
      depois(7000, () => { setFase("aovivo"); setItens([]); setSegundos(0) })
    }
  }

  const tempo = `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`

  const parar = (
    <Button variant="destructive" size="sm" onClick={() => setEncerrar(true)}><IconPlayerStop /> Parar</Button>
  )

  return (
    <div className="relative h-full bg-muted/30">
      {minimizado ? (
        <div className="absolute top-4 right-4 flex h-14 animate-in items-center gap-3 rounded-full border bg-card/90 px-4 shadow-lg backdrop-blur fade-in slide-in-from-top-4 duration-300">
          <img src={gato} alt="TekaFlow" className="size-8" />
          <Badge variant="success">{fase === "aovivo" ? `Ouvindo ${tempo}` : "Testando"}</Badge>
          <Badge variant="soft">1 sugestão nova</Badge>
          <Button variant="ghost" size="icon" aria-label="Abrir o chat" onClick={() => setMinimizado(false)}><IconMaximize /></Button>
          {parar}
        </div>
      ) : (
        <div className="absolute top-4 right-4 bottom-4 flex w-88 animate-in flex-col gap-3 rounded-2xl border bg-card/90 py-4 shadow-lg backdrop-blur fade-in slide-in-from-right-8 duration-300">
          <div className="flex items-center gap-2 px-4">
            <Tabs value={aba} onValueChange={setAba}>
              <TabsList aria-label="Conteúdo do chat">
                <TabsTrigger value="transcricao">Transcrição</TabsTrigger>
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
              </TabsList>
            </Tabs>
            <span className="flex-1" />
            <Button variant="ghost" size="icon" aria-label="Ocultar da gravação"><IconGhost /></Button>
            <Button variant="ghost" size="icon" aria-label="Minimizar" onClick={() => setMinimizado(true)}><IconMinus /></Button>
            {parar}
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4">
            <Badge variant="muted"><IconFolder /> Entrevista Acme · pronto</Badge>
            <Badge variant="muted"><IconSparkles /> Claude Haiku 5.5</Badge>
          </div>
          {fase === "aovivo" ? (
            <div className="flex items-center gap-3 px-4">
              <Badge variant="success">Ouvindo {tempo}</Badge>
              <OndasAoVivo />
            </div>
          ) : null}

          {aba === "resumo" ? (
            <p className="flex-1 px-4 text-sm text-muted-foreground">O resumo aparece quando a sessão termina.</p>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-2" aria-live="polite">
              {itens.map((i) =>
                i.tipo === "eles" ? (
                  <div key={i.id} className="flex flex-col gap-1">
                    <Rotulo>OUTROS</Rotulo>
                    <Bubble variant="muted" className="max-w-full">
                      <BubbleContent size="sm" className="flex flex-col gap-2">
                        <Formando texto={i.pergunta} />
                        <Bubble variant="tinted" className="max-w-full">
                          <BubbleContent size="sm" className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-xs font-medium"><img src={gato} alt="" className="size-4" /> SUGIRO DIZER</span>
                            <Formando texto={i.sugestao} pensando={1.2} />
                            <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{i.arquivo}<Badge variant="soft"><IconBolt /> em 0,9 s</Badge></span>
                          </BubbleContent>
                        </Bubble>
                      </BubbleContent>
                    </Bubble>
                  </div>
                ) : i.tipo === "voce" ? (
                  <div key={i.id} className="flex flex-col items-end gap-1">
                    <Rotulo>{i.paraIA ? "VOCÊ, PARA A IA" : "VOCÊ"}</Rotulo>
                    <Bubble align="end" className="max-w-[85%]"><BubbleContent size="sm"><Formando texto={i.texto} /></BubbleContent></Bubble>
                  </div>
                ) : (
                  <div key={i.id} className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground"><img src={gato} alt="" className="size-4" /> TEKAFLOW</span>
                    <Bubble variant="muted" className="max-w-[92%]">
                      <BubbleContent size="sm" className="flex flex-col gap-2">
                        <Formando texto={i.texto} pensando={i.tipo === "ia" ? 1.2 : 0} />
                        {i.tipo === "sistema" && i.extra === "fala" ? (
                          <span className="flex items-center gap-3 text-primary">
                            {micOk ? <span className="flex items-center gap-1 text-xs text-success"><IconCheck className="size-3" /> Ouvi você</span> : <Fala classe="" />}
                            {!micOk ? <Button size="sm" variant="outline" onClick={falar}><IconMicrophone /> Simular fala</Button> : null}
                          </span>
                        ) : null}
                      </BubbleContent>
                    </Bubble>
                  </div>
                )
              )}
              <div ref={fim} />
            </div>
          )}

          <Collapsible open={medidores} onOpenChange={setMedidores} className="flex flex-col gap-3 border-t px-4 pt-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="justify-between">Medidores de áudio {medidores ? <span className="flex items-center gap-1">Recolher <IconChevronDown /></span> : <span className="flex items-center gap-1">Expandir <IconChevronUp /></span>}</Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3">
              {[["VOCÊ", niveis[0]], ["OUTROS", niveis[1]]].map(([r, v]) => (
                <div key={r} className="flex items-center gap-3"><span className="w-16 text-xs text-muted-foreground">{r}</span><Progress value={Number(v)} size="thin" aria-label={`Nível: ${r}`} /></div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center gap-2 px-4">
            <Select defaultValue="pt">
              <SelectTrigger size="sm" className="w-24 text-xs" aria-label="Idioma da chamada"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="pt">PT-BR</SelectItem><SelectItem value="en">EN</SelectItem></SelectContent>
            </Select>
            <InputGroup>
              <InputGroupInput
                placeholder={fase === "mic" ? "Primeiro, o teste do microfone" : "Pergunte algo à IA"}
                aria-label="Pergunta à IA"
                value={texto}
                disabled={fase === "mic"}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar(texto)}
              />
              <InputGroupAddon align="inline-end">
                {fase === "mic" ? <InputGroupButton size="icon-xs" aria-label="Falar" onClick={falar}><IconMicrophone /></InputGroupButton> : null}
                <InputGroupButton size="icon-xs" variant="default" aria-label="Enviar" disabled={fase === "mic"} onClick={() => enviar(texto)}><IconArrowUp /></InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      )}

      <AlertDialog open={encerrar} onOpenChange={setEncerrar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar a sessão?</AlertDialogTitle>
            <AlertDialogDescription>Salvamos a transcrição e o resumo em Sessões. Você pode abrir depois.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar ouvindo</AlertDialogCancel>
            <AlertDialogAction onClick={onSair}>Encerrar sessão</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
