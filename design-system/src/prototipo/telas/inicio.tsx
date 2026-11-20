import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { IconBook2, IconClock, IconDownload, IconFolder, IconHome, IconPlayerPlay, IconSearch, IconSettings, IconX } from "@tabler/icons-react"

import palavra from "@/assets/marca/palavra-branco.svg"
import { GatoAnimado } from "@/components/gato-animado"
import type { OlharGato } from "@/lib/gato-animacao"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { shortcutKeys } from "@/lib/platform"

export type Reuniao = { titulo: string; meta: string; tag: string }
export type Grupo = { dia: string; reunioes: Reuniao[] }
export type Totais = { sessoes: string; ouvidas: string; respostas: string }

export const GRUPOS: Grupo[] = [
  {
    dia: "Hoje",
    reunioes: [
      { titulo: "Entrevista técnica, Acme", meta: "14:20 · 42 min · 9 perguntas", tag: "Entrevista técnica" },
      { titulo: "Cold call, Lumen Energia", meta: "10:05 · 18 min · 5 perguntas", tag: "Cold call" },
    ],
  },
  { dia: "Ontem", reunioes: [{ titulo: "Apresentação ao CEO, Orbe", meta: "16:40 · 55 min · 12 perguntas", tag: "CEO" }] },
  { dia: "Quinta-feira, 12 de Novembro", reunioes: [{ titulo: "Call em inglês, Northwind", meta: "09:30 · 31 min · 7 perguntas", tag: "Inglês" }] },
]

/** O gato da marca, sem o quadrado. Os olhos seguem o mouse e, ao clicar, ele se agita de contente. */
function MarcaLateral() {
  const gato = useRef<HTMLButtonElement>(null)
  const [olhar, setOlhar] = useState<OlharGato>(null)
  useEffect(() => {
    const aoMover = (e: PointerEvent) => {
      const r = gato.current?.getBoundingClientRect()
      if (!r) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const f = Math.min(1, d / 200)
      setOlhar({ x: (dx / d) * f, y: (dy / d) * f })
    }
    window.addEventListener("pointermove", aoMover)
    return () => window.removeEventListener("pointermove", aoMover)
  }, [])
  const [sinal, setSinal] = useState(0)
  // De vez em quando o gato fala um pouquinho (boca mexendo, olhos abertos) e volta ao normal.
  const [fala, setFala] = useState(false)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let t: number
    const ciclo = () => {
      t = window.setTimeout(() => {
        setFala(true)
        t = window.setTimeout(() => { setFala(false); ciclo() }, 2600)
      }, 18000 + Math.random() * 22000)
    }
    ciclo()
    return () => window.clearTimeout(t)
  }, [])
  const livre = useRef(0)
  const festa = () => {
    // Clicar sem parar não repete: depois de uma animação, ele descansa um instante.
    if (Date.now() < livre.current) return
    livre.current = Date.now() + 3200
    setSinal((n) => n + 1)
    if (!gato.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.killTweensOf(gato.current)
    gsap.timeline()
      .to(gato.current, { y: -6, scale: 1.12, rotate: -10, duration: 0.12, ease: "power2.out" })
      .to(gato.current, { rotate: 10, duration: 0.1 })
      .to(gato.current, { rotate: -8, y: -3, duration: 0.1 })
      .to(gato.current, { rotate: 8, duration: 0.1 })
      .to(gato.current, { y: 0, scale: 1, rotate: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" })
  }
  return (
    <div className="mb-4 flex items-center gap-2 px-3">
      <button ref={gato} type="button" onClick={festa} aria-label="Fazer carinho no gato" className="cursor-pointer rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <GatoAnimado estado={fala ? "falando" : "idle"} olhar={olhar} espiarSinal={sinal} className="size-10 text-primary" />
      </button>
      <img src={palavra} alt="TekaFlow" className="h-4 w-auto" />
    </div>
  )
}

/** Tira acento e caixa para a busca achar "reuniao" em "Reunião". */
const limpar = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

/** Só as reuniões que têm o termo no título, nos dados ou na etiqueta. Grupos que ficam vazios somem. */
export function filtrarGrupos(termo: string, grupos: Grupo[] = GRUPOS) {
  const q = limpar(termo.trim())
  if (!q) return grupos
  return grupos.map((g) => ({ ...g, reunioes: g.reunioes.filter((r) => limpar(`${r.titulo} ${r.meta} ${r.tag}`).includes(q)) })).filter((g) => g.reunioes.length > 0)
}

export type Secao = "Início" | "Sessões" | "Contexto" | "Configurações" | "Ajuda"

/** Menu lateral da janela principal. `onNavegar` é opcional: na tela 7 do onboarding ele não leva a lugar nenhum. */
export function MenuLateral({ ativo = "Início", onNavegar, atualizacao, nativo = false }: { ativo?: Secao; onNavegar?: (s: Secao) => void; atualizacao?: { versao: string; onAbrir: () => void }; /** Janela nativa do Mac: deixa espaço para os três botões do sistema. */ nativo?: boolean }) {
  const topo: { nome: Secao; icone: React.ReactNode }[] = [
    { nome: "Início", icone: <IconHome /> },
    { nome: "Sessões", icone: <IconClock /> },
    { nome: "Contexto", icone: <IconFolder /> },
  ]
  const botao = (m: { nome: Secao; icone: React.ReactNode }) => (
    <Button key={m.nome} variant={ativo === m.nome ? "secondary" : "ghost"} className="justify-start" aria-current={ativo === m.nome ? "page" : undefined} onClick={() => onNavegar?.(m.nome)}>
      {m.icone} {m.nome}
    </Button>
  )
  return (
    <nav className={`flex w-52 shrink-0 flex-col gap-1 border-r bg-sidebar p-4 ${nativo ? "pt-12" : ""}`} aria-label="Principal">
      <MarcaLateral />
      {topo.map(botao)}
      <span className="flex-1" />
      {atualizacao ? (
        <div className="mb-2 flex flex-col gap-2 rounded-2xl border border-primary bg-primary/10 p-3">
          <span className="flex items-center gap-2 text-sm font-medium"><IconDownload className="size-4 text-primary" /> Nova versão</span>
          <span className="text-xs text-muted-foreground">A versão {atualizacao.versao} está pronta.</span>
          <Button size="sm" onClick={atualizacao.onAbrir}>Atualizar</Button>
        </div>
      ) : null}
      {botao({ nome: "Configurações", icone: <IconSettings /> })}
    </nav>
  )
}

/** O conteúdo da tela inicial: boas-vindas, cartão de iniciar, números e reuniões recentes. */
export function InicioConteudo({ onIniciar, onTestar, onAbrir, grupos: gruposDados = GRUPOS, totais = { sessoes: "12", ouvidas: "4 h 20", respostas: "86" } }: { onIniciar?: () => void; onTestar?: () => void; onAbrir?: (titulo: string) => void; grupos?: Grupo[]; totais?: Totais }) {
  const atalho = shortcutKeys("D")
  const [buscando, setBuscando] = useState(false)
  const [termo, setTermo] = useState("")
  const grupos = filtrarGrupos(termo, gruposDados)
  return (
    <div className="flex min-w-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-8 fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-heading text-2xl font-medium">{onTestar ? "Bem-vindo" : "Bem-vindo de volta, Carlos"}</h1>

      <div className="grid grid-cols-[1fr_15rem] gap-4">
        <Card padding="lg">
          <div>
            <b className="font-heading text-xl">Pronto para a sua próxima chamada</b>
            <p className="mt-1 text-sm text-muted-foreground">{onTestar ? "Quando estiver numa chamada, é só iniciar." : "Microfone, áudio, transcrição e IA funcionando."}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" onClick={onIniciar}>
              <IconPlayerPlay /> Iniciar
              {onTestar ? null : <span className="flex gap-1">{atalho.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}
            </Button>
            <Button variant="outline" onClick={onTestar}>Testar de novo</Button>
          </div>
        </Card>
        <Card padding="md" className="justify-center">
          {[[totais.sessoes, "sessões"], [totais.ouvidas, "ouvidas"], [totais.respostas, "respostas"]].map(([n, r]) => (
            <div key={r}><b className="font-heading text-xl">{n}</b> <span className="text-sm text-muted-foreground">{r}</span></div>
          ))}
        </Card>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex h-9 items-center gap-2">
          <b>Reuniões recentes</b>
          <span className="flex-1" />
          <div className={`overflow-hidden transition-all duration-300 ${buscando ? "w-64 opacity-100" : "w-0 opacity-0"}`} aria-hidden={!buscando}>
            <InputGroup>
              <InputGroupAddon align="inline-start"><IconSearch /></InputGroupAddon>
              <InputGroupInput autoFocus={buscando} tabIndex={buscando ? 0 : -1} placeholder="Buscar reuniões" aria-label="Buscar reuniões" value={termo} onChange={(e) => setTermo(e.target.value)} />
            </InputGroup>
          </div>
          <Button variant="ghost" size="icon" aria-label={buscando ? "Fechar a busca" : "Buscar"} onClick={() => { setBuscando((b) => !b); if (buscando) setTermo("") }}>{buscando ? <IconX /> : <IconSearch />}</Button>
        </div>
        {grupos.length === 0 && gruposDados.length > 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma reunião encontrada.</p> : null}
        {gruposDados.length === 0 && !termo ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-12 text-center">
            <b className="font-heading text-lg font-medium">Nada por aqui ainda</b>
            <p className="max-w-[42ch] text-sm text-muted-foreground">Quando você fizer a sua primeira sessão, ela aparece aqui, com o resumo do que foi dito.</p>
            <Button variant="secondary" onClick={onIniciar}>Iniciar uma sessão</Button>
          </div>
        ) : null}
        {grupos.map((g) => (
          <div key={g.dia} className="flex flex-col gap-2">
            <h2 className="text-xs font-medium text-muted-foreground">{g.dia}</h2>
            {g.reunioes.map((r) => (
              <Item key={r.titulo} variant="outline" size="sm" role="button" tabIndex={0} onClick={() => onAbrir?.(r.titulo)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAbrir?.(r.titulo)} className="cursor-pointer transition-colors hover:border-foreground/30 hover:bg-muted/60">
                <ItemMedia variant="box"><IconBook2 /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{r.titulo}</ItemTitle>
                  <ItemDescription>{r.meta}</ItemDescription>
                </ItemContent>
                <ItemActions><Badge variant="secondary">{r.tag}</Badge></ItemActions>
              </Item>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}

/** Tela 7 do onboarding: a tela inicial da janela principal, com o menu lateral. Dados de exemplo. */
export function Inicio() {
  return (
    <div className="flex h-full">
      <MenuLateral />
      <InicioConteudo />
    </div>
  )
}
