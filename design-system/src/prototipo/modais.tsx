import { useEffect, useState, type ElementType } from "react"
import { IconExternalLink, IconKey, IconX } from "@tabler/icons-react"

import { LogoClaude, LogoGemini, LogoOllama, LogoOpenai } from "@/components/marcas"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/**
 * Os três modais de conexão, já escolhidos pelo Carlos (20 de Novembro de 2026).
 * Regras: todos têm o MESMO tamanho (o do ChatGPT), Cancelar sempre à esquerda e a ação principal sempre à direita.
 */
export const TAMANHO_MODAL = "h-[380px] w-full sm:max-w-sm"

const CAIXA = "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background [&_svg]:size-8"
const LINK = "inline-flex items-center gap-1 text-primary underline underline-offset-4"

type Pecas = { T: ElementType; D: ElementType }
type Resultado = { ok: boolean; erro?: string; provedor?: string }
type Props = { onFechar: () => void; pecas?: Pecas; /** Conexão de verdade. Sem isto, o modal só mostra o visual. */ aoConectar?: (chave?: string) => Promise<Resultado> }
const NO_MODAL: Pecas = { T: DialogTitle, D: DialogDescription }
const SOLTO: Pecas = { T: "h2", D: "p" }

function Rodape({ onFechar, principal, desligado, onPrincipal }: { onFechar: () => void; principal: string; desligado?: boolean; onPrincipal?: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-foreground/15 px-6 py-4">
      <Button variant="ghost" onClick={onFechar}>Cancelar</Button>
      <Button disabled={desligado} onClick={onPrincipal}>{principal}</Button>
    </div>
  )
}

function Corpo({ icone, titulo, descricao, pecas, children }: { icone?: React.ReactNode; titulo: string; descricao: string; pecas: Pecas; children?: React.ReactNode }) {
  const { T, D } = pecas
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      {icone ? <span className={CAIXA}>{icone}</span> : null}
      <T className="font-heading text-base font-medium">{titulo}</T>
      <D className="text-sm text-muted-foreground">{descricao}</D>
      {children}
    </div>
  )
}

/** Entrar com o conta do ChatGPT: uma ação só no centro da tela. */
export function ModalChatGpt({ onFechar, pecas = NO_MODAL, aoConectar }: Props) {
  const [espera, setEspera] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const abrir = async () => {
    setEspera(true)
    setErro(null)
    if (!aoConectar) return
    const r = await aoConectar()
    if (r.ok) onFechar()
    else { setEspera(false); setErro(r.erro ?? "Não deu certo.") }
  }
  return (
    <>
      <Corpo icone={<LogoOpenai />} titulo="Entrar com o ChatGPT" descricao="Vamos abrir o navegador para você entrar. Depois é só voltar aqui." pecas={pecas}>
        <div className={cn("flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-muted text-sm", !espera && !erro && "invisible", erro && "text-destructive")}>{erro ? erro : <><Spinner className="size-4" /> Esperando você entrar no navegador</>}</div>
      </Corpo>
      <Rodape onFechar={() => { window.api?.cancelarChatgpt(); onFechar() }} principal={erro ? "Tentar de novo" : "Abrir o login"} desligado={espera && !!aoConectar} onPrincipal={abrir} />
    </>
  )
}

const PROVEDORES = [
  { id: "openai", nome: "OpenAI", icone: <LogoOpenai />, prefixo: "sk-" },
  { id: "anthropic", nome: "Anthropic", icone: <LogoClaude />, prefixo: "sk-ant-" },
  { id: "google", nome: "Google Gemini", icone: <LogoGemini />, prefixo: "AIza" },
  { id: "google", nome: "Google Gemini", icone: <LogoGemini />, prefixo: "AQ." },
]

/** Chave de API: um campo só, e o app descobre o serviço pelo começo da chave. */
export function ModalChave({ onFechar, pecas = NO_MODAL, aoConectar }: Props) {
  const [chave, setChave] = useState("")
  const [testando, setTestando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const testar = async () => {
    if (!aoConectar) return onFechar()
    setTestando(true)
    setErro(null)
    const r = await aoConectar(chave.trim())
    setTestando(false)
    if (r.ok) onFechar()
    else setErro(r.erro ?? "Não deu certo.")
  }
  const achado = chave.length > 3 ? PROVEDORES.slice().sort((a, b) => b.prefixo.length - a.prefixo.length).find((x) => chave.startsWith(x.prefixo)) : undefined
  return (
    <>
      <Corpo icone={<IconKey />} titulo="Conectar com chave de API" descricao="Cole a chave da OpenAI, da Anthropic ou do Google. O TekaFlow descobre o serviço." pecas={pecas}>
        <Input type="password" placeholder="sk-…  ou  AIza…  ou  AQ.Ab…" aria-label="Chave de API" value={chave} onChange={(e) => { setChave(e.target.value); setErro(null) }} className="h-12" />
        <div className="flex h-6 items-center gap-2 text-sm">
          {erro ? <span className="text-destructive">{erro}</span> : testando ? <><Spinner className="size-4" /> Testando a chave…</> : achado ? <span className="text-primary">Chave reconhecida: {achado.nome}</span> : chave.length > 3 ? <span className="text-muted-foreground">Não reconheci esse começo de chave.</span> : <span className="text-muted-foreground">Funciona com OpenAI, Anthropic e Google Gemini.</span>}
        </div>
      </Corpo>
      <Rodape onFechar={onFechar} principal="Testar e conectar" desligado={!achado || testando} onPrincipal={testar} />
    </>
  )
}

/** O Google tem dois formatos: o antigo, que começa com AIza, e o novo, que começa com AQ. (ex.: AQ.Ab…). */
const CHAVE_GEMINI = /^(AIza[0-9A-Za-z_-]{20,}|AQ\.[0-9A-Za-z_.-]{20,})$/

/** Gemini: o mesmo desenho do ChatGPT (logo, título, frase), com o campo para colar a chave. */
export function ModalGemini({ onFechar, pecas = NO_MODAL, aoConectar }: Props) {
  const [chave, setChave] = useState("")
  const [testando, setTestando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const limpa = chave.trim()
  const valida = CHAVE_GEMINI.test(limpa)
  const testar = async () => {
    if (!aoConectar) return onFechar()
    setTestando(true)
    setErro(null)
    const r = await aoConectar(limpa)
    setTestando(false)
    if (r.ok) onFechar()
    else setErro(r.erro ?? "Não deu certo.")
  }
  return (
    <>
      <Corpo icone={<LogoGemini />} titulo="Conectar o Gemini" descricao="Cole a chave que você criou no Google AI Studio." pecas={pecas}>
        <Input type="password" placeholder="AQ.Ab…  ou  AIza…" aria-label="Chave do Gemini" value={chave} onChange={(e) => { setChave(e.target.value); setErro(null) }} className="h-12" />
        <div className="flex h-6 items-center gap-2 text-sm">
          {erro ? <span className="text-destructive">{erro}</span> : testando ? <><Spinner className="size-4" /> Testando a chave…</> : limpa.length > 4 && !valida ? <span className="text-muted-foreground">Essa não parece uma chave do Gemini.</span> : valida ? <span className="text-primary">Chave do Gemini reconhecida</span> : <span className="text-muted-foreground">Sem chave? <a className={LINK} href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer">Criar no Google AI Studio <IconExternalLink className="size-4" /></a></span>}
        </div>
      </Corpo>
      <Rodape onFechar={onFechar} principal="Testar e conectar" desligado={!valida || testando} onPrincipal={testar} />
    </>
  )
}

/** Ollama: uma linha de estado e um botão só. */
export function ModalOllama({ onFechar, pecas = NO_MODAL }: Props) {
  const [procurando, setProcurando] = useState(true)
  useEffect(() => {
    if (!procurando) return
    const t = window.setTimeout(() => setProcurando(false), 1500)
    return () => window.clearTimeout(t)
  }, [procurando])
  return (
    <>
      <Corpo icone={<LogoOllama />} titulo="Usar o Ollama" descricao="Roda os modelos no seu computador." pecas={pecas}>
        <div className="flex w-full items-center justify-center gap-3 rounded-lg bg-muted p-4 text-sm">
          {procurando ? <><Spinner /> Procurando o Ollama…</> : <><IconX className="size-5 text-destructive" /> <span>Não encontrei o Ollama. <a className={LINK} href="https://ollama.com/download" target="_blank" rel="noreferrer">Baixar <IconExternalLink className="size-4" /></a></span></>}
        </div>
      </Corpo>
      <Rodape onFechar={onFechar} principal="Procurar de novo" desligado={procurando} onPrincipal={() => setProcurando(true)} />
    </>
  )
}

/** Usado onde o modal abre de verdade (cada conexão do Cérebro). */
export function ModalDeConexao({ tipo, aberto, onFechar, aoConectar }: { tipo: "chatgpt" | "gemini" | "chave" | "ollama"; aberto: boolean; onFechar: () => void; aoConectar?: Props["aoConectar"] }) {
  const M = { chatgpt: ModalChatGpt, gemini: ModalGemini, chave: ModalChave, ollama: ModalOllama }[tipo]
  return (
    <Dialog open={aberto} onOpenChange={(a) => !a && onFechar()}>
      <DialogContent className={cn("flex flex-col gap-0 p-0", TAMANHO_MODAL)} showCloseButton={false}>
        <M onFechar={onFechar} aoConectar={aoConectar} />
      </DialogContent>
    </Dialog>
  )
}

/** Os três, lado a lado e já abertos, para ver sem clicar. Fica em #/modais. */
export function Modais() {
  const itens = [
    { nome: "Entrar com o ChatGPT", M: ModalChatGpt },
    { nome: "Gemini", M: ModalGemini },
    { nome: "Chave de API", M: ModalChave },
    { nome: "Ollama (desligado por enquanto)", M: ModalOllama },
  ]
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium">Modais de conexão</h1>
        <p className="text-sm text-muted-foreground">As opções escolhidas. Tamanho único, Cancelar à esquerda e a ação principal à direita.</p>
      </div>
      <div className="flex flex-wrap gap-6">
        {itens.map(({ nome, M }) => (
          <div key={nome} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{nome}</span>
            <div className={cn("flex flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10", TAMANHO_MODAL, "sm:w-[384px]")}>
              <M onFechar={() => {}} pecas={SOLTO} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
