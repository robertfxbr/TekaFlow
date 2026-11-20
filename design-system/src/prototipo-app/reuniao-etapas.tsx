import { IconAlertTriangle, IconCheck, IconChevronUp, IconFolder, IconGhost, IconMinus, IconSparkles } from "@tabler/icons-react"

import { GatoAnimado } from "@/components/gato-animado"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { IconArrowUp } from "@tabler/icons-react"

/** As etapas de uma reunião, do clique em Iniciar até o aviso de sem som. Cada uma é uma tela parada para olhar. */
export const ETAPAS_REUNIAO = [
  { id: "r1", nome: "1 · Clicou em Iniciar: conferência rodando" },
  { id: "r2", nome: "2 · Som ok, esperando você falar" },
  { id: "r3", nome: "3 · Troca rápida aberta" },
  { id: "r4", nome: "4 · Tudo certo: o gato chega feliz" },
  { id: "r5", nome: "5 · Ao vivo: ELES perguntam, o gato sugere" },
  { id: "r6", nome: "6 · VOCÊ responde" },
  { id: "r7", nome: "7 · Nova pergunta: a conversa desce" },
  { id: "r8", nome: "8 · Sem som: aviso grave" },
  { id: "r9", nome: "9 · Continuar mesmo assim" },
  { id: "r10", nome: "10 · O som voltou" },
] as const
export type EtapaReuniao = (typeof ETAPAS_REUNIAO)[number]["id"]

const MODELO = "Claude Haiku 5.5"
type Estado = "ok" | "rodando" | "espera" | "erro" | "tenta"

const Rotulo = ({ children, direita }: { children: React.ReactNode; direita?: boolean }) => <span className={cn("text-[10px] font-medium tracking-wide text-muted-foreground", direita && "self-end")}>{children}</span>

const Eles = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1"><Rotulo>ELES</Rotulo><div className="w-fit max-w-[90%] rounded-2xl bg-muted px-3 py-2 text-sm">{children}</div></div>
)
const Voce = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-end gap-1"><Rotulo direita>VOCÊ</Rotulo><div className="w-fit max-w-[88%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">{children}</div></div>
)
/** A sugestão vem como uma resposta do gato, pequena, com o arquivo de onde saiu e o tempo. */
const Sugestao = ({ texto, arquivo, tempo }: { texto: string; arquivo: string; tempo: string }) => (
  <div className="flex items-start gap-2">
    <GatoAnimado className="mt-4 size-5 shrink-0 text-primary" />
    <div className="flex min-w-0 flex-col gap-1">
      <Rotulo>SUGESTÃO</Rotulo>
      <div className="w-fit max-w-full rounded-2xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm">
        {texto}
        <div className="mt-1 text-xs text-muted-foreground">{arquivo} · em {tempo} s</div>
      </div>
    </div>
  </div>
)
const GatoFeliz = ({ titulo, texto }: { titulo: string; texto: string }) => (
  <div className="flex items-end gap-3 py-1">
    <GatoAnimado estado="falando" className="size-10 shrink-0 text-primary" />
    <div className="rounded-2xl bg-muted px-3 py-2 text-sm"><b>{titulo}</b><div className="text-xs text-muted-foreground">{texto}</div></div>
  </div>
)
const Aviso = () => (
  <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-xs">
    <b className="block text-sm text-destructive">Não estamos captando som</b>
    O microfone não está enviando nada. Se você continuar assim, a reunião não será transcrita. Ela segue aberta e o TekaFlow continua tentando.
    <div className="mt-2 flex flex-wrap gap-2"><Button size="sm">Trocar a entrada</Button><Button size="sm" variant="outline">Continuar mesmo assim</Button><Button size="sm" variant="outline">Tentar de novo</Button></div>
  </div>
)

const icone = (e: Estado) =>
  e === "ok" ? <span className="flex size-5 items-center justify-center rounded-full bg-success/20 text-success"><IconCheck className="size-3" /></span>
  : e === "erro" ? <span className="flex size-5 items-center justify-center rounded-full bg-destructive/20 text-destructive"><IconAlertTriangle className="size-3" /></span>
  : e === "tenta" ? <span className="flex size-5 items-center justify-center rounded-full bg-warning/20 text-warning text-xs">↻</span>
  : e === "rodando" ? <span className="flex size-5 items-center justify-center rounded-full bg-muted"><Spinner className="size-3" /></span>
  : <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">…</span>

function Linha({ e, titulo, sub }: { e: Estado; titulo: string; sub: string }) {
  return (
    <div className="flex min-h-9 items-center gap-2 px-3 py-1.5 text-xs">
      {icone(e)}
      <div className="min-w-0 flex-1"><b className="font-semibold">{titulo}</b> <span className="text-muted-foreground">{sub}</span></div>
      <span className="flex items-center rounded-full border px-1.5 text-muted-foreground"><IconChevronUp className="size-3" /></span>
    </div>
  )
}
function Conferencia({ som, somT, trans, transT, modelo, modeloT }: { som: Estado; somT: string; trans: Estado; transT: string; modelo: Estado; modeloT: string }) {
  return (
    <div className="divide-y rounded-xl border bg-background">
      <Linha e={som} titulo="Som" sub={somT} />
      <Linha e={trans} titulo="Transcrição" sub={transT} />
      <Linha e={modelo} titulo="Modelo" sub={modeloT} />
    </div>
  )
}
function Troca() {
  const item = (t: string, on?: boolean) => <div className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5", on && "bg-primary/10")}>{t}{on ? <IconCheck className="ml-auto size-3 text-primary" /> : null}</div>
  const h = (t: string) => <div className="px-2 pt-1.5 pb-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{t}</div>
  return (
    <div className="absolute inset-x-0 bottom-full mb-2 rounded-xl bg-popover p-1.5 text-xs shadow-2xl ring-1 ring-foreground/10">
      {h("Entrada de voz")}{item("Padrão do sistema (QCY H3)", true)}{item("Microfone do MacBook")}{item("Microfone USB")}
      {h("Saída de áudio")}{item("Padrão do sistema (HDMI)", true)}{item("Alto-falantes do Mac")}
    </div>
  )
}
const Pasta = () => <Badge variant="muted"><IconFolder /> Entrevista Acme · 3 arquivos</Badge>
const Mod = () => <Badge variant="muted"><IconSparkles /> {MODELO}</Badge>
const Barras = () => <span className="flex h-4 items-center gap-0.5" aria-hidden>{[9, 14, 6, 12, 8, 14].map((h, i) => <i key={i} className="w-0.5 rounded-full bg-primary" style={{ height: h }} />)}</span>
const Ouvindo = ({ t }: { t: string }) => (
  <div className="flex flex-wrap items-center gap-1.5"><Badge variant="success">● Ouvindo {t}</Badge><Barras /><Pasta /><Mod /></div>
)
const Antes = () => <div className="flex flex-col gap-1.5"><div className="flex flex-wrap gap-1.5"><Pasta /><Mod /></div><span className="text-xs text-muted-foreground">Conferindo antes de gravar…</span></div>
const SemSom = ({ t }: { t: string }) => (
  <div className="flex flex-wrap items-center gap-1.5"><span className="rounded-full border border-destructive/35 bg-destructive/10 px-2.5 py-0.5 text-xs text-destructive">● Gravando sem som {t} · tentando transcrever</span><Pasta /><Mod /></div>
)

const ANTES = <Eles key="a">E como foi a sua experiência com times pequenos?</Eles>
const Q1 = <Eles key="q1">Conta uma situação em que você discordou de uma decisão técnica do time.</Eles>
const S1 = <Sugestao key="s1" texto="Na migração do checkout, defendi manter a fila até medir a latência. Levei um teste de carga e o time revisou o plano." arquivo="briefing-vaga.md" tempo="0,9" />
const R1 = <Voce key="r1">Teve sim. Na migração do checkout eu achava arriscado trocar a fila sem medir antes.</Voce>
const Q2 = <Eles key="q2">Como você lida com prazo apertado?</Eles>
const S2 = <Sugestao key="s2" texto="Corto o escopo antes de cortar a qualidade e combino com o time o que fica para a próxima entrega." arquivo="notas-entrevista.txt" tempo="0,8" />

type Dados = { topo: React.ReactNode; msgs: React.ReactNode[]; conf?: React.ComponentProps<typeof Conferencia>; troca?: boolean }
const DADOS: Record<EtapaReuniao, Dados> = {
  r1: { topo: <Antes />, msgs: [ANTES], conf: { som: "rodando", somT: "entrada e saída no padrão do sistema", trans: "espera", transT: "aguardando a sua fala", modelo: "espera", modeloT: "aguardando" } },
  r2: { topo: <Antes />, msgs: [ANTES], conf: { som: "ok", somT: "ok", trans: "rodando", transT: "diga algo", modelo: "espera", modeloT: "aguardando" } },
  r3: { topo: <Antes />, msgs: [ANTES], conf: { som: "ok", somT: "ok", trans: "ok", transT: "“olá, tekaflow”", modelo: "rodando", modeloT: "pergunta de teste…" }, troca: true },
  r4: { topo: <Ouvindo t="00:00" />, msgs: [ANTES, <GatoFeliz key="g" titulo="Tá tudo certo!" texto="Ouvi você e o computador, a fala virou texto e o modelo respondeu. Já estou gravando." />] },
  r5: { topo: <Ouvindo t="00:21" />, msgs: [ANTES, Q1, S1] },
  r6: { topo: <Ouvindo t="00:38" />, msgs: [ANTES, Q1, S1, R1] },
  r7: { topo: <Ouvindo t="01:12" />, msgs: [ANTES, Q1, S1, R1, Q2, S2] },
  r8: { topo: <Antes />, msgs: [ANTES, <Aviso key="av" />], conf: { som: "erro", somT: "sem som chegando", trans: "tenta", transT: "tentando transcrever…", modelo: "ok", modeloT: "respondeu" } },
  r9: { topo: <SemSom t="00:12" />, msgs: [ANTES, <Aviso key="av" />, <Eles key="c">Continuando sem som. Vou transcrever assim que chegar áudio.</Eles>] },
  r10: { topo: <Ouvindo t="00:05" />, msgs: [ANTES, <GatoFeliz key="g2" titulo="Voltei a ouvir!" texto="O som chegou e a transcrição já está rodando. Nada do que foi dito agora se perde." />, Q1, S1] },
}

/** A janela do chat numa reunião, parada em uma etapa. Sem som tocando e sem nada andando sozinho. */
export function ReuniaoChat({ etapa }: { etapa: EtapaReuniao }) {
  const d = DADOS[etapa]
  return (
    <div className="relative h-full bg-muted/30">
      <div className="absolute top-4 right-4 bottom-4 flex w-88 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-lg">
        <div className="flex items-center gap-1.5">
          <div className="inline-flex rounded-full border bg-background p-0.5 text-xs"><span className="rounded-full bg-muted px-2.5 py-1 font-semibold">Transcrição</span><span className="px-2.5 py-1 text-muted-foreground">Resumo</span></div>
          <span className="flex-1" />
          <Button variant="ghost" size="icon-sm" aria-label="Ocultar da gravação"><IconGhost /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Minimizar"><IconMinus /></Button>
          <Button variant="destructive" size="sm">■ Parar</Button>
        </div>
        <div className="border-b pb-3">{d.topo}</div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">{d.msgs}</div>
        <div className="relative flex flex-col gap-2">
          {d.conf ? <Conferencia {...d.conf} /> : null}
          {d.troca ? <Troca /> : null}
          <InputGroup>
            <InputGroupInput placeholder="Pergunte algo à IA" aria-label="Pergunta à IA" />
            <InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" variant="default" aria-label="Enviar"><IconArrowUp /></InputGroupButton></InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  )
}
