import { useEffect, useState } from "react"
import { IconArrowLeft, IconArrowRight, IconCheck, IconFileText, IconFolder, IconMicrophone, IconSparkles } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutProto } from "../prototipo/layout"
import { InicioConteudo, MenuLateral, type Secao } from "../prototipo/telas/inicio"
import { ChatAoVivo } from "./chat-ao-vivo"
import { ETAPAS_REUNIAO, ReuniaoChat, type EtapaReuniao } from "./reuniao-etapas"
import { Configuracoes } from "./configuracoes"
import { IconCalendarClock } from "@tabler/icons-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PastaEChat } from "../prototipo/telas/contexto"
import { ModalRelease } from "./modal-release"
import { Sessoes } from "./sessoes"

/** As cenas do app, na ordem do fluxo. */
const CENAS = [
  { id: "inicio", nome: "Início" },
  { id: "sessoes", nome: "Sessões" },
  { id: "contexto", nome: "Contexto" },
  { id: "release", nome: "Nova versão (modal)" },
  { id: "config-ouvir", nome: "Configurações · Ouvir" },
  { id: "config-responder", nome: "Configurações · Responder" },
  { id: "instrucoes", nome: "Antes de iniciar" },
  { id: "chat-mic", nome: "Chat · teste do microfone" },
  { id: "chat-ia", nome: "Chat · teste da IA" },
  { id: "chat-aovivo", nome: "Chat · ao vivo" },
  { id: "chat-medidores", nome: "Chat · medidores abertos" },
  { id: "chat-minimizado", nome: "Chat · minimizado" },
  { id: "chat-encerrar", nome: "Chat · encerrar a sessão" },
  ...ETAPAS_REUNIAO,
] as const
type Cena = (typeof CENAS)[number]["id"]

const SECAO_DA_CENA: Partial<Record<Cena, Secao>> = { inicio: "Início", sessoes: "Sessões", contexto: "Contexto", instrucoes: "Início", release: "Início" }

/** Detalhe de uma reunião: ainda não desenhado, fica um conteúdo de espera. */
function DetalheReuniao({ titulo, onVoltar }: { titulo: string; onVoltar: () => void }) {
  return (
    <div className="flex min-w-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-8 fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onVoltar}><IconArrowLeft /> Voltar</Button>
        <h1 className="font-heading text-2xl font-medium">{titulo}</h1>
      </div>
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon"><IconCalendarClock /></EmptyMedia>
          <EmptyTitle>Em breve</EmptyTitle>
          <EmptyDescription>Aqui vão ficar a transcrição, o resumo e as sugestões desta reunião.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

/** Página Contexto: a mesma pasta e o mesmo chat de conferência do onboarding. */
function PaginaContexto() {
  return (
    <div className="flex min-w-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-8 fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-heading text-2xl font-medium">Contexto</h1>
      <PastaEChat pastaInicial />
    </div>
  )
}

/** "Antes de iniciar": confere tudo o que a reunião usa, inclusive o contexto, que já fica carregado para as respostas saírem rápidas. */
function Instrucoes({ onOk }: { onOk: () => void }) {
  const [carregado, setCarregado] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setCarregado((c) => Math.min(100, c + 12)), 260)
    return () => window.clearInterval(t)
  }, [])
  const pronto = carregado >= 100
  const itens = [
    { icone: <IconFolder />, titulo: "Contexto", detalhe: "TekaFlow-teste-entrevista · 3 arquivos", estado: pronto ? "Carregado" : `Lendo… ${carregado}%`, ok: pronto },
    { icone: <IconMicrophone />, titulo: "Microfone", detalhe: "QCY H3 (Bluetooth)", estado: "Funcionando", ok: true },
    { icone: <IconFileText />, titulo: "Transcrição", detalhe: "Apple Speech", estado: "Funcionando", ok: true },
    { icone: <IconSparkles />, titulo: "Modelo de análise", detalhe: "Claude Haiku 5.5", estado: "Funcionando", ok: true },
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card padding="lg" className="w-120 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-medium">Antes de iniciar</h2>
          <p className="text-sm text-muted-foreground">Deixe a chamada aberta. O TekaFlow abre um chat ao lado e já responde com o seu contexto.</p>
        </div>
        <div className="flex flex-col gap-3">
          {itens.map((i) => (
            <div key={i.titulo} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background [&_svg]:size-6">{i.icone}</span>
              <div className="flex min-w-0 flex-1 flex-col">
                <b className="text-sm">{i.titulo}</b>
                <span className="text-xs text-muted-foreground">{i.detalhe}</span>
              </div>
              {i.ok ? <Badge variant="success"><IconCheck /> {i.estado}</Badge> : <Badge variant="secondary"><Spinner className="size-3" /> {i.estado}</Badge>}
            </div>
          ))}
        </div>
        <Button onClick={onOk} className="self-end" disabled={!pronto}>Iniciar a reunião</Button>
      </Card>
    </div>
  )
}

/** Protótipo do app depois do onboarding: janela principal, Sessões, Configurações e o chat ao vivo. */
export function PrototipoApp({ reuniao = false }: { reuniao?: boolean }) {
  const cenas = reuniao ? CENAS.filter((c) => c.id === "inicio" || ETAPAS_REUNIAO.some((e) => e.id === c.id)) : CENAS.filter((c) => !ETAPAS_REUNIAO.some((e) => e.id === c.id))
  const [indice, setIndice] = useState(reuniao ? 1 : 0)
  const [pedido, setPedido] = useState(0)
  const [detalhe, setDetalhe] = useState<string | null>(null)
  const [fechado, setFechado] = useState(false)
  const [atualizado, setAtualizado] = useState(false)
  const cena = cenas[indice].id
  const ir = (novo: number) => {
    if (novo < 0 || novo >= cenas.length) return
    setDetalhe(null)
    setIndice(novo)
  }
  const irPara = (id: Cena) => ir(cenas.findIndex((c) => c.id === id))
  const ehEtapa = ETAPAS_REUNIAO.some((e) => e.id === cena)
  const noChat = cena.startsWith("chat-") || ehEtapa

  let conteudo: React.ReactNode
  if (ehEtapa) {
    conteudo = <ReuniaoChat etapa={cena as EtapaReuniao} />
  } else if (noChat) {
    conteudo = (
      <ChatAoVivo
        key={cena}
        faseInicial={cena === "chat-mic" ? "mic" : cena === "chat-ia" ? "ia" : "aovivo"}
        medidoresInicial={cena === "chat-medidores"}
        minimizadoInicial={cena === "chat-minimizado"}
        encerrarInicial={cena === "chat-encerrar"}
        pedidoPergunta={pedido}
        onSair={() => irPara("sessoes")}
      />
    )
  } else if (cena === "config-ouvir" || cena === "config-responder") {
    conteudo = <Configuracoes key={cena} abaInicial={cena === "config-ouvir" ? "ouvir" : "responder"} onVoltar={() => irPara("inicio")} />
  } else {
    const secao = SECAO_DA_CENA[cena] ?? "Início"
    conteudo = (
      <div className="relative flex h-full">
        <MenuLateral
          ativo={secao}
          atualizacao={atualizado ? undefined : { versao: "0.2.0", onAbrir: () => irPara("release") }}
          onNavegar={(s) => (s === "Sessões" ? irPara("sessoes") : s === "Contexto" ? irPara("contexto") : s === "Configurações" ? irPara("config-ouvir") : irPara("inicio"))}
        />
        {detalhe ? <DetalheReuniao titulo={detalhe} onVoltar={() => setDetalhe(null)} /> : secao === "Sessões" ? <Sessoes onAbrir={setDetalhe} /> : secao === "Contexto" ? <PaginaContexto /> : <InicioConteudo onIniciar={() => irPara("instrucoes")} onAbrir={setDetalhe} />}
        <ModalRelease aberto={cena === "release"} onFechar={() => irPara("inicio")} onConcluir={() => { setAtualizado(true); irPara("inicio"); setFechado(true) }} />
        {cena === "instrucoes" ? <Instrucoes onOk={() => irPara("chat-mic")} /> : null}
      </div>
    )
  }

  return (
    <LayoutProto
      fluxo={reuniao ? "reuniao" : "app"}
      titulo={noChat ? "Tela compartilhada" : "TekaFlow"}
      navegacao={{ voltar: () => ir(indice - 1), avancar: () => ir(indice + 1) }}
      controles={
        <>
          <Button variant="outline" size="sm" onClick={() => ir(indice - 1)} disabled={indice === 0}><IconArrowLeft /> Voltar</Button>
          <Select value={String(indice)} onValueChange={(v) => ir(Number(v))}>
            <SelectTrigger size="sm" className="w-64" aria-label="Ir para a tela"><SelectValue /></SelectTrigger>
            <SelectContent>
              {cenas.map((c, i) => <SelectItem key={c.id} value={String(i)}>{i + 1}. {c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => ir(indice + 1)} disabled={indice === cenas.length - 1}>Avançar <IconArrowRight /></Button>
          {noChat && !ehEtapa ? <Button variant="ghost" size="sm" onClick={() => setPedido((p) => p + 1)}>Simular pergunta deles</Button> : null}
        </>
      }
    >
      <div key={noChat ? "chat" : cena} className="absolute inset-0">{conteudo}</div>
      {fechado ? (
        <div className="absolute inset-0 z-50 flex animate-in flex-col items-center justify-center gap-4 bg-background text-center fade-in duration-500">
          <p className="text-sm text-muted-foreground">O TekaFlow fechou para atualizar.</p>
          <Button onClick={() => setFechado(false)}>Reabrir o TekaFlow</Button>
        </div>
      ) : null}
    </LayoutProto>
  )
}
