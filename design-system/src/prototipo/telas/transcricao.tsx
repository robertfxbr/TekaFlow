import { useEffect, useRef, useState } from "react"
import { IconBrandAppleFilled, IconCheck, IconDots, IconDownload, IconCube, IconTrash } from "@tabler/icons-react"

import { ACAO_LARGURA, Baixando, ModelRow } from "@/components/model-row"
import { Envoltorio } from "@/components/envoltorio"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNaoImplementado, useNavegacao, useSistema } from "../contexto"

export type Modelo = {
  id: string
  name: string
  icon: React.ReactNode
  badges: { label: string; tone?: "primary" | "muted" | "warning" }[]
  description: string
  detail: string
}

// Tamanhos reais (versão q8, Hugging Face / catálogo do Handy). Ver design-system/pesquisa-modelos-transcricao.md
export const BAIXAR: Modelo[] = [
  { id: "small", name: "Whisper Small", icon: <IconCube />, badges: [{ label: "Mais leve" }], description: "Da OpenAI. Leve, roda em qualquer computador.", detail: "99 idiomas · 190 MB" },
  { id: "medium", name: "Whisper Medium", icon: <IconCube />, badges: [{ label: "Equilibrado" }], description: "Da OpenAI. Erra menos que o Small, mas pesa mais.", detail: "99 idiomas · 539 MB" },
  { id: "turbo", name: "Whisper Large v3 Turbo", icon: <IconCube />, badges: [{ label: "Mais rápido", tone: "primary" }], description: "Da OpenAI. Quase tão preciso quanto o Large, bem mais rápido.", detail: "100 idiomas · 574 MB" },
  { id: "large", name: "Whisper Large v3", icon: <IconCube />, badges: [{ label: "Mais preciso", tone: "primary" }, { label: "Mais pesado", tone: "warning" }], description: "Da OpenAI. O que mais acerta em português, e o mais pesado.", detail: "99 idiomas · 1,08 GB" },
  { id: "parakeet", name: "Parakeet v3", icon: <IconCube />, badges: [{ label: "Leve e preciso" }], description: "Da NVIDIA. Leve e preciso, com 25 idiomas europeus.", detail: "25 idiomas europeus · 740 MB" },
]

type Estado = Record<string, number> // 0 a 100; 100 = baixado

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">{titulo}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

/** Estado "em uso": cheio na cor da marca, para ser a coisa mais clara da linha. */
function EmUso() {
  return (
    <span className={`inline-flex h-9 items-center gap-2 rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground ${ACAO_LARGURA}`}>
      <IconCheck className="size-4" /> Em uso
    </span>
  )
}

/** Tela 2: quem transforma voz em texto. O download é simulado. */
export function Transcricao({ modo = "onboarding" }: { modo?: "onboarding" | "config" } = {}) {
  const { voltar, avancar } = useNavegacao()
  const sistema = useSistema()
  const mac = sistema === "mac"
  const [estado, setEstado] = useState<Estado>({})
  const [escolhido, setEscolhido] = useState<string>(mac ? "apple" : "")
  const timers = useRef<Record<string, number>>({})

  useEffect(() => {
    setEscolhido((atual) => (mac ? (atual || "apple") : atual === "apple" ? "" : atual))
  }, [mac])
  useEffect(() => () => Object.values(timers.current).forEach(window.clearInterval), [])

  // No app real: o que já foi baixado, o progresso e o motor vêm do Mac. No protótipo, tudo é simulado.
  const real = Boolean(window.api)
  const [motor, setMotor] = useState(true)
  const [erroBaixar, setErroBaixar] = useState<string | null>(null)
  useEffect(() => {
    if (!window.api) return
    const api = window.api
    const ler = () => api.statusWhisper().then((st) => {
      setMotor(st.motor)
      setEscolhido(st.usando)
      setEstado((e) => ({ ...e, ...Object.fromEntries(Object.entries(st.modelos).map(([id, m]) => [id, m.baixado ? 100 : m.baixando ? e[id] ?? 1 : 0])) }))
    })
    void ler()
    return api.aoProgressoWhisper((m) => {
      if (m.erro) setErroBaixar(m.erro)
      if (m.erro !== undefined) void ler()
      if (m.pct !== undefined) setEstado((e) => ({ ...e, [m.id]: Math.max(1, m.pct!) }))
    })
  }, [])
  const [excluindo, setExcluindo] = useState<string | null>(null)
  const excluir = (id: string) => {
    void window.api?.apagarWhisper(id)
    setEstado((e) => ({ ...e, [id]: 0 }))
    if (escolhido === id) setEscolhido("apple")
    setExcluindo(null)
  }
  const menuExcluir = (id: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Mais opções do modelo"><IconDots /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem variant="destructive" onSelect={() => setExcluindo(id)}><IconTrash /> Excluir modelo</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  const usar = (id: string) => { setEscolhido(id); void window.api?.usarTranscricao(id) }
  const nao = useNaoImplementado()
  const baixarSimulado = (id: string) => {
    setEstado((e) => ({ ...e, [id]: 1 }))
    timers.current[id] = window.setInterval(() => {
      setEstado((e) => {
        const prox = Math.min(100, (e[id] ?? 0) + 10)
        if (prox === 100) window.clearInterval(timers.current[id])
        return { ...e, [id]: prox }
      })
    }, 200)
  }

  const acao = (m: Modelo) => {
    const p = estado[m.id] ?? 0
    if (real && m.id === "parakeet") return <Button variant="outline" className={ACAO_LARGURA} disabled>Em breve</Button>
    if (escolhido === m.id && p === 100 && real) {
      return excluindo === m.id ? (
        <div className={`flex items-center justify-end gap-1 text-sm ${ACAO_LARGURA}`}>
          <span className="text-muted-foreground">Excluir?</span>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => excluir(m.id)}>Sim</Button>
          <Button variant="ghost" size="sm" onClick={() => setExcluindo(null)}>Não</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <EmUso />
          {menuExcluir(m.id)}
        </div>
      )
    }
    if (escolhido === m.id) return <EmUso />
    if (p === 100) {
      if (real && excluindo === m.id) {
        return (
          <div className={`flex items-center justify-end gap-1 text-sm ${ACAO_LARGURA}`}>
            <span className="text-muted-foreground">Excluir?</span>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => excluir(m.id)}>Sim</Button>
            <Button variant="ghost" size="sm" onClick={() => setExcluindo(null)}>Não</Button>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" className={ACAO_LARGURA} onClick={() => usar(m.id)}>Selecionar</Button>
          {real ? menuExcluir(m.id) : null}
        </div>
      )
    }
    if (p > 0) return <Baixando valor={p} nome={m.name} />
    return <Button variant="outline" className={ACAO_LARGURA} onClick={() => { if (real) { setErroBaixar(null); setEstado((e) => ({ ...e, [m.id]: 1 })); void window.api?.baixarWhisper(m.id) } else if (nao) nao("Baixar o modelo de transcrição"); else baixarSimulado(m.id) }}><IconDownload /> Baixar</Button>
  }

  return (
    <Envoltorio modo={modo}
      step={1}
      title="Como o TekaFlow vai ouvir você"
      description="Escolha quem transforma voz em texto. Você pode trocar depois, em Configurações."
      onBack={voltar}
      onNext={avancar}
    >
      {mac ? (
        <Secao titulo="Já está no seu Mac">
          <ModelRow
            icon={<IconBrandAppleFilled />}
            name="Apple Speech"
            badges={[{ label: "Recomendado", tone: "primary" }]}
            description="Já vem no macOS e funciona sem internet."
            detail="O sistema cuida do modelo"
            selected={escolhido === "apple"}
            action={
              escolhido === "apple" ? (
                <EmUso />
              ) : (
                <Button variant="outline" className={ACAO_LARGURA} onClick={() => usar("apple")}>Selecionar</Button>
              )
            }
          />
        </Secao>
      ) : null}
      {real && !motor ? <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">Para usar os modelos baixados, o Mac precisa do motor do Whisper. No terminal, rode: brew install whisper-cpp</p> : null}
      {erroBaixar ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">Não consegui baixar. {erroBaixar}</p> : null}
      <Secao titulo="Para baixar">
        {BAIXAR.map((m) => (
          <ModelRow key={m.id} icon={m.icon} name={m.name} badges={m.badges} description={m.description} detail={m.detail} selected={escolhido === m.id} action={acao(m)} />
        ))}
      </Secao>
    </Envoltorio>
  )
}
