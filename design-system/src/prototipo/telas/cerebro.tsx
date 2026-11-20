import { useEffect, useRef, useState } from "react"
import { IconAlertTriangle, IconCheck, IconCube, IconDoorExit, IconDots, IconDownload, IconExternalLink, IconKey, IconSend, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import { LogoClaude, LogoGemini, LogoOllama, LogoOpenai } from "@/components/marcas"
import { ACAO_LARGURA, Baixando, ModelRow } from "@/components/model-row"
import { MODELOS_LOCAIS } from "../modelos-locais"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Envoltorio } from "@/components/envoltorio"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { ModalDeConexao } from "../modais"
import { useNaoImplementado, useNavegacao } from "../contexto"

type Provedor = { id: string; origem: string; nome: string; icone: React.ReactNode; descricao: string; recomendado?: boolean; /** Desligado por enquanto: aparece, mas não dá para usar. */ emBreve?: boolean }

const PROVEDORES: Provedor[] = [
  { id: "chatgpt", origem: "Assinatura", nome: "ChatGPT", icone: <LogoOpenai className="size-6" />, descricao: "Entra com a sua conta do ChatGPT.", recomendado: true },
  { id: "claude", origem: "Assinatura", nome: "Claude Code", icone: <LogoClaude className="size-6" />, descricao: "Usa o login do Claude Code no seu Mac." },
  { id: "gemini", origem: "Chave de API", nome: "Gemini", icone: <LogoGemini className="size-6" />, descricao: "Usa uma chave do Google AI Studio." },
  { id: "chave", origem: "Chave de API", nome: "Chave de API", icone: <IconKey className="size-6" />, descricao: "Usa uma chave da OpenAI ou da Anthropic." },
  { id: "ollama", origem: "No computador", nome: "Ollama", icone: <LogoOllama className="size-6" />, descricao: "Roda modelos pelo app Ollama.", emBreve: true },
  { id: "local", origem: "No computador", nome: "Modelo local", icone: <IconCube className="size-6" />, descricao: "Baixa um modelo e responde sem internet.", emBreve: true },
]

/** Descrições de uma linha dos modelos que conhecemos. Modelo novo, fora desta tabela, aparece só com o nome. */
/** Para os Gemini, a descrição vem da família do nome, que é estável (os números de versão mudam toda hora). */
export function descreverModelo(id: string): string | undefined {
  if (DESCRICAO_MODELO[id]) return DESCRICAO_MODELO[id]
  if (/^gemini-/.test(id)) return /flash-lite/.test(id) ? "Leve, para respostas curtas" : /flash/.test(id) ? "Rápido e equilibrado no dia a dia" : /pro/.test(id) ? "Raciocínio profundo, para pedidos complexos" : undefined
  return undefined
}
const DESCRICAO_MODELO: Record<string, string> = {
  "gpt-5.6-sol": "O mais capaz",
  "gpt-5.6-terra": "Equilibrado no dia a dia",
  "gpt-5.6-luna": "Rápido, para respostas curtas",
  opus: "O mais capaz",
  sonnet: "Equilibrado no dia a dia",
  haiku: "O mais rápido, para respostas curtas",
  "gemini-3.5-flash": "Rápido e capaz, para o dia a dia",
  "gemini-3.1-pro-preview": "Raciocínio profundo, para pedidos complexos",
  "gemini-3.1-flash-lite": "O mais leve, para respostas curtas",
  "gemini-2.5-pro": "Raciocínio profundo",
  "gemini-2.5-flash": "Equilibrado no dia a dia",
  "gemini-2.5-flash-lite": "Leve, para respostas curtas",
}
type ModeloDoServico = { id: string; nome: string; recomendado?: boolean }

/** A janela de conexão de cada provedor. Todos os passos são simulados. */
function ConexaoDialog({ provedor, onFechar, onConectado }: { provedor: Provedor | null; onFechar: () => void; onConectado: (id: string) => void }) {
  const [passo, setPasso] = useState<"inicio" | "esperando" | "falha">("inicio")
  const [chave, setChave] = useState("")
  const timer = useRef<number | undefined>(undefined)
  const id = provedor?.id

  useEffect(() => {
    setPasso(id === "ollama" ? "esperando" : "inicio")
    setChave("")
    return () => window.clearTimeout(timer.current)
  }, [id])

  useEffect(() => {
    if (id !== "ollama" || passo !== "esperando") return
    const t = window.setTimeout(() => setPasso("falha"), 1500)
    return () => window.clearTimeout(t)
  }, [id, passo])

  if (!provedor) return null

  const esperar = (ms: number) => {
    setPasso("esperando")
    timer.current = window.setTimeout(() => onConectado(provedor.id), ms)
  }

  const conta = provedor.id === "chatgpt"
  const comChave = provedor.id === "chave" || provedor.id === "gemini"
  const textos: Record<string, { titulo: string; descricao: string }> = {
    chatgpt: { titulo: "Entrar com o ChatGPT", descricao: "Vamos abrir o navegador para você entrar com a sua conta. Depois é só voltar aqui." },
    gemini: { titulo: "Conectar o Gemini", descricao: "Cole a chave do Google AI Studio. Ela fica guardada só neste computador." },
    claude: { titulo: "Usar o Claude Code", descricao: "O TekaFlow usa o login que o Claude Code já tem no seu terminal. Vamos conferir se ele está lá." },
    ollama: { titulo: "Procurar o Ollama", descricao: "Procurando o Ollama neste computador." },
    chave: { titulo: "Conectar com uma chave de API", descricao: "Cole a chave do provedor. Ela fica guardada só neste computador." },
  }
  const t = textos[provedor.id]

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && onFechar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.titulo}</DialogTitle>
          <DialogDescription>{t.descricao}</DialogDescription>
        </DialogHeader>

        {passo === "esperando" ? (
          <div className="flex items-center gap-3 rounded-lg bg-muted p-4 text-sm">
            <Spinner />
            {conta ? "Esperando você entrar no navegador…" : provedor.id === "claude" ? "Procurando o login…" : provedor.id === "ollama" ? "Procurando…" : "Conectando…"}
          </div>
        ) : null}

        {passo === "falha" ? (
          <p className="rounded-lg bg-muted p-4 text-sm">
            Não encontrei o Ollama neste computador. Instale e abra o app, depois procure de novo.
          </p>
        ) : null}

        {comChave && passo === "inicio" ? (
          <Input type="password" placeholder="Cole a chave aqui" aria-label="Chave de API" value={chave} onChange={(e) => setChave(e.target.value)} />
        ) : null}

        <DialogFooter>
          <Button variant="ghost" onClick={onFechar}>Cancelar</Button>
          {provedor.id === "ollama" && passo === "falha" ? (
            <>
              <Button variant="outline" asChild>
                <a href="https://ollama.com/download" target="_blank" rel="noreferrer"><IconExternalLink /> Baixar o Ollama</a>
              </Button>
              <Button onClick={() => setPasso("esperando")}>Procurar de novo</Button>
            </>
          ) : null}
          {passo === "inicio" && conta ? <Button onClick={() => esperar(2000)}>Abrir o login</Button> : null}
          {passo === "inicio" && provedor.id === "claude" ? <Button onClick={() => esperar(1200)}>Verificar login</Button> : null}
          {passo === "inicio" && comChave ? <Button disabled={chave.length < 8} onClick={() => esperar(800)}>Conectar</Button> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Tela 3: conectar uma ou mais IAs e escolher qual responde. Logins e downloads são simulados. */
export function Cerebro({ modo = "onboarding" }: { modo?: "onboarding" | "config" } = {}) {
  const { voltar, avancar } = useNavegacao()
  const [conectados, setConectados] = useState<string[]>([])
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [dialogo, setDialogo] = useState<Provedor | null>(null)
  const [localAberto, setLocalAberto] = useState(false)
  const [baixando, setBaixando] = useState<Record<string, number>>({})
  const [confirmarPular, setConfirmarPular] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearInterval(t)), [])

  // No app real, lembra o que já foi conectado e qual IA está em uso.
  const [real, setReal] = useState<"chatgpt" | "gemini" | "chave" | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  useEffect(() => {
    window.api?.estadoIa().then((e) => { setConectados(e.conectadas); setSelecionado(e.ativa) })
  }, [])
  const [modelos, setModelos] = useState<Record<string, ModeloDoServico[]>>({})
  const [erroModelos, setErroModelos] = useState<Record<string, string>>({})
  const [modeloEscolhido, setModeloEscolhido] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!window.api) return
    window.api.estadoIa().then((e) => setModeloEscolhido(e.modelos ?? {}))
  }, [])
  useEffect(() => {
    if (!window.api) return
    for (const id of conectados) {
      if (modelos[id] || !["chatgpt", "claude", "gemini"].includes(id)) continue
      window.api.modelosIa(id).then(async (r) => {
        if (!r.ok || !r.modelos?.length) { setErroModelos((e) => ({ ...e, [id]: r.erro ?? "Nenhum modelo disponível." })); return }
        setModelos((m) => ({ ...m, [id]: r.modelos! }))
        // O modelo guardado pode ter saído de linha: só vale se ainda está na lista; senão usa o recomendado (primeiro).
        const atual = (await window.api!.estadoIa()).modelos?.[id]
        if (!atual || !r.modelos.some((m) => m.id === atual)) {
          setModeloEscolhido((m) => ({ ...m, [id]: r.modelos![0].id }))
          void window.api!.escolherModelo(id, r.modelos[0].id)
        }
      })
    }
  }, [conectados, modelos])
  const [banner, setBanner] = useState<{ tipo: "enviando" | "ok" | "erro"; titulo: string; texto: string } | null>(null)
  const enviarTeste = async (p: Provedor) => {
    setBanner({ tipo: "enviando", titulo: `Enviando teste para ${p.nome}…`, texto: "Duas perguntas rápidas. Costuma levar alguns segundos." })
    const r = await window.api!.testarIa(p.id)
    const tempo = typeof r.ms === "number" ? `${(r.ms / 1000).toFixed(1).replace(".", ",")} s` : ""
    if (!r.ok) return setBanner({ tipo: "erro", titulo: `${p.nome} não respondeu`, texto: r.erro ?? "Tente de novo." })
    if (r.acertos?.some((a) => !a)) return setBanner({ tipo: "erro", titulo: `${p.nome} respondeu, mas errou`, texto: `Perguntei ${r.perguntas?.join(" e ")}. Resposta: ${(r.resposta ?? "").replace(/\n+/g, " / ")}` })
    setBanner({ tipo: "ok", titulo: `${r.modelo ?? p.nome} respondeu${tempo ? ` em ${tempo}` : ""}`, texto: `Perguntei ${r.perguntas?.map((q) => `“${q}”`).join(" e ")}. Resposta: ${(r.resposta ?? "").replace(/\n+/g, " / ")}` })
  }
  const [desconectando, setDesconectando] = useState<string | null>(null)
  const desconectar = async (id: string) => {
    const e = await window.api!.desconectarIa(id)
    setConectados(e.conectadas)
    setSelecionado(e.ativa)
    setModelos((m) => { const { [id]: _fora, ...resto } = m; return resto })
    setDesconectando(null)
  }
  const aposConectar = (id: string) => { setConectados((c) => (c.includes(id) ? c : [...c, id])); setSelecionado((s) => s ?? id) }
  const conectarReal = async (p: Provedor) => {
    if (p.id === "chatgpt") return setReal("chatgpt")
    if (p.id === "claude") {
      const r = await window.api!.verificarClaude()
      if (r.ok) aposConectar("claude")
      else setAviso(r.erro ?? "Não deu certo.")
      return
    }
    setReal(p.id === "gemini" ? "gemini" : "chave")
  }

  const conectar = (id: string) => {
    setConectados((c) => (c.includes(id) ? c : [...c, id]))
    setSelecionado((s) => s ?? id)
    setDialogo(null)
  }

  const nao = useNaoImplementado()
  const baixarSimulado = (id: string) => {
    setBaixando((b) => ({ ...b, [id]: 1 }))
    const passo = window.setInterval(() => {
      setBaixando((b) => {
        const p = Math.min(100, (b[id] ?? 0) + 10)
        if (p === 100) {
          window.clearInterval(passo)
          conectar("local")
          setLocalAberto(true)
        }
        return { ...b, [id]: p }
      })
    }, 200)
    timers.current.push(passo)
  }

  const tentarContinuar = () => (selecionado ? avancar() : setConfirmarPular(true))

  return (
    <>
      <Envoltorio modo={modo}
        step={2}
        title="Conecte a IA que vai responder"
        description="Conecte uma ou mais e escolha qual responde. Você troca depois, em Configurações."
        onBack={voltar}
        onNext={tentarContinuar}
        onSkip={() => setConfirmarPular(true)}
      >
        {banner ? (
          <div role={banner.tipo === "erro" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-xl border p-3 text-sm", banner.tipo === "ok" && "border-success/35 bg-success/10", banner.tipo === "erro" && "border-destructive/40 bg-destructive/10", banner.tipo === "enviando" && "bg-muted")}>
            <span className="mt-0.5 shrink-0">{banner.tipo === "enviando" ? <Spinner className="size-4" /> : banner.tipo === "ok" ? <IconCheck className="size-4 text-success" /> : <IconAlertTriangle className="size-4 text-destructive" />}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <b className={banner.tipo === "erro" ? "text-destructive" : undefined}>{banner.titulo}</b>
              <span className="text-muted-foreground">{banner.texto}</span>
            </div>
            {banner.tipo !== "enviando" ? <Button variant="ghost" size="icon-sm" aria-label="Fechar" onClick={() => setBanner(null)}><IconX /></Button> : null}
          </div>
        ) : null}
        <div className={cn("grid auto-rows-fr gap-4", modo === "config" ? "grid-cols-2" : "grid-cols-3")}>
          {PROVEDORES.map((p) => {
            const conectado = conectados.includes(p.id)
            const escolhido = selecionado === p.id
            const local = p.id === "local"
            return (
              <Card key={p.id} variant={escolhido ? "selected" : "interactive"} padding="none" className={p.emBreve ? "opacity-60" : undefined} aria-disabled={p.emBreve}>
                <CardContent className="flex h-full flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">{p.icone}</span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <b className="text-sm">{p.nome}</b>
                        <span className="flex-1" />
                        {escolhido ? (
                          <Badge><IconCheck /> Selecionado</Badge>
                        ) : conectado ? (
                          <Badge variant="success">Conectado</Badge>
                        ) : p.emBreve ? (
                          <Badge variant="secondary">Em breve</Badge>
                        ) : null}
                      </div>
                      <span className="text-xs text-muted-foreground">{p.origem}</span>
                    </div>
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{p.descricao}</p>
                  {conectado && erroModelos[p.id] ? <p className="line-clamp-3 text-xs text-destructive" role="alert">{erroModelos[p.id]}</p> : null}
                  {conectado && modelos[p.id]?.length ? (
                    <Select value={modeloEscolhido[p.id] ?? modelos[p.id][0].id} onValueChange={(v) => { setModeloEscolhido((m) => ({ ...m, [p.id]: v })); void window.api?.escolherModelo(p.id, v) }}>
                      <SelectTrigger className="w-full" aria-label={`Modelo de ${p.nome}`}><SelectValue>{modelos[p.id].find((m) => m.id === (modeloEscolhido[p.id] ?? modelos[p.id][0].id))?.nome}</SelectValue></SelectTrigger>
                      <SelectContent>
                        {modelos[p.id].map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="flex flex-col items-start">
                              <span className="flex items-center gap-2">{m.nome}{m.recomendado ? <Badge variant="soft">Recomendado</Badge> : null}</span>
                              {descreverModelo(m.id) ? <span className="text-xs text-muted-foreground">{descreverModelo(m.id)}</span> : null}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                  <div className="-mx-4 mt-auto border-t" />
                  {desconectando === p.id ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">Desconectar mesmo?</span>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => desconectar(p.id)}>Sim</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDesconectando(null)}>Não</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {escolhido ? (
                        <Button variant="secondary" size="sm" className="flex-1" disabled>Em uso</Button>
                      ) : conectado ? (
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelecionado(p.id); window.api?.selecionarIa(p.id) }}>Selecionar</Button>
                      ) : p.emBreve ? (
                        <Button variant="outline" size="sm" className="flex-1" disabled>Em breve</Button>
                      ) : local ? (
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setLocalAberto((a) => !a)}>{localAberto ? "Recolher" : "Escolher"}</Button>
                      ) : (
                        <Button variant={p.recomendado ? "default" : "outline"} size="sm" className="flex-1" onClick={() => (window.api ? conectarReal(p) : setDialogo(p))}>Conectar</Button>
                      )}
                      {conectado && window.api && !local ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon-sm" aria-label={`Ações de ${p.nome}`}><IconDots /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => void enviarTeste(p)}><IconSend /> Enviar teste</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onSelect={() => setDesconectando(p.id)}><IconDoorExit /> Desconectar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {localAberto ? (
          <section className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium">Modelos locais</h2>
              <p className="text-xs text-muted-foreground">Rodam no seu computador, sem internet. Escolha um para baixar.</p>
            </div>
            {MODELOS_LOCAIS.map((m) => {
              const p = baixando[m.id] ?? 0
              return (
                <ModelRow
                  key={m.id}
                  icon={<IconCube />}
                  name={m.nome}
                  badges={m.badges}
                  description={m.descricao}
                  detail={m.detalhe}
                  action={
                    p === 100 ? (
                      <Button disabled className={ACAO_LARGURA}><IconCheck /> Baixado</Button>
                    ) : p > 0 ? (
                      <Baixando valor={p} nome={m.nome} />
                    ) : (
                      <Button variant="outline" className={ACAO_LARGURA} onClick={() => (nao ? nao("Baixar o modelo local") : baixarSimulado(m.id))}><IconDownload /> Baixar</Button>
                    )
                  }
                />
              )
            })}
          </section>
        ) : null}
      </Envoltorio>

      <ModalDeConexao tipo="chatgpt" aberto={real === "chatgpt"} onFechar={() => setReal(null)} aoConectar={async () => { const r = await window.api!.conectarChatgpt(); if (r.ok) aposConectar("chatgpt"); return r }} />
      <ModalDeConexao tipo="gemini" aberto={real === "gemini"} onFechar={() => setReal(null)} aoConectar={async (k) => { const r = await window.api!.conectarChave(k ?? ""); if (r.ok && r.provedor !== "google") return { ok: false, erro: "Essa chave não é do Gemini." }; if (r.ok) aposConectar("gemini"); return r }} />
      <ModalDeConexao tipo="chave" aberto={real === "chave"} onFechar={() => setReal(null)} aoConectar={async (k) => { const r = await window.api!.conectarChave(k ?? ""); if (r.ok) aposConectar(r.provedor === "google" ? "gemini" : "chave"); return r }} />
      <AlertDialog open={aviso !== null} onOpenChange={(a) => !a && setAviso(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Não consegui conectar</AlertDialogTitle>
            <AlertDialogDescription>{aviso}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ConexaoDialog provedor={dialogo} onFechar={() => setDialogo(null)} onConectado={conectar} />

      <AlertDialog open={confirmarPular} onOpenChange={setConfirmarPular}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <IconAlertTriangle className="text-warning" /> Escolha uma IA para continuar
            </AlertDialogTitle>
            <AlertDialogDescription>Sem uma IA conectada, você não terá respostas ao vivo.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Escolher uma IA</AlertDialogCancel>
            <AlertDialogAction onClick={avancar}>Ok, pular</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
