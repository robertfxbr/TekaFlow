import { Fragment, useEffect, useRef, useState } from "react"
import { IconArrowsExchange, IconCheck, IconDots, IconExternalLink, IconKey, IconVolume, IconFileText, IconMicrophone, IconRefresh, IconX } from "@tabler/icons-react"

import { iniciarGravacao } from "@/app/voz"
import { SeletorMicrofone, SeletorSaida } from "./permissoes"
import { LogoClaude, LogoGemini, LogoOpenai } from "@/components/marcas"
import { OnboardingFrame } from "@/components/onboarding-frame"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useNavegacao } from "../contexto"

type Teste = "ok" | "erro" | "rodando"

const ACAO = "w-36 justify-center"

function Estado({ estado }: { estado: Teste }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        estado === "ok" && "bg-success/15 text-success",
        estado === "erro" && "bg-destructive/15 text-destructive",
        estado === "rodando" && "bg-muted text-foreground"
      )}
    >
      {estado === "ok" ? <IconCheck className="size-4" /> : estado === "erro" ? <IconX className="size-4" /> : <Spinner className="size-4" />}
    </span>
  )
}

/** A demonstração de "testar tudo" do protótipo. Os resultados são simulados; microfone e áudio só ficam ao vivo durante o teste. */
function TestarSimulado() {
  const { voltar, avancar } = useNavegacao()
  const [estado, setEstado] = useState<Record<string, Teste>>({ mic: "ok", audio: "ok", voz: "ok", ia: "erro" })
  const [nivel, setNivel] = useState(60)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const t = window.setInterval(() => setNivel(35 + Math.round(Math.random() * 50)), 350)
    return () => {
      window.clearInterval(t)
      timers.current.forEach(window.clearTimeout)
    }
  }, [])

  const rodar = (id: string, resultado: Teste = "ok", ms = 1400) => {
    setEstado((e) => ({ ...e, [id]: "rodando" }))
    timers.current.push(window.setTimeout(() => setEstado((e) => ({ ...e, [id]: resultado })), ms))
  }

  const ao_vivo = (id: string) => (
    <div className="flex items-center gap-3">
      <Badge variant="success">Ao vivo</Badge>
      <Progress value={nivel} size="thin" className="w-40" aria-label={`Nível: ${id}`} />
      <span className="text-xs text-muted-foreground">{nivel > 50 ? "Nível bom" : "Fale um pouco mais alto"}</span>
    </div>
  )
  const funcionando = (texto: string) => (
    <div className="flex items-center gap-2">
      <Badge variant="success">Funcionando</Badge>
      <span className="text-xs text-muted-foreground">{texto}</span>
    </div>
  )

  const linhas = [
    {
      id: "mic",
      icone: <IconMicrophone />,
      titulo: "Microfone",
      meio: estado.mic === "rodando" ? ao_vivo("microfone") : funcionando("Último teste: ouvi a sua voz"),
      acao: <Button variant="outline" className={ACAO} onClick={() => rodar("mic", "ok", 4000)}><IconRefresh /> Testar de novo</Button>,
    },
    {
      id: "audio",
      icone: <IconVolume />,
      titulo: "Áudio do computador",
      meio: estado.audio === "rodando" ? ao_vivo("áudio do computador") : funcionando("Último teste: ouvi o som"),
      acao: <Button variant="outline" className={ACAO} onClick={() => rodar("audio", "ok", 4000)}><IconRefresh /> Testar de novo</Button>,
    },
    {
      id: "voz",
      icone: <IconFileText />,
      titulo: "Transcrição",
      meio: (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Fale algo, por exemplo “olá, TekaFlow”.</span>
          <span className="text-sm">Você disse: “olá, TekaFlow, está me ouvindo?”</span>
        </div>
      ),
      acao: <Button variant="outline" className={ACAO} onClick={() => rodar("voz")}><IconMicrophone /> Testar de novo</Button>,
    },
    {
      id: "ia",
      icone: <LogoOpenai />,
      titulo: "IA · ChatGPT",
      meio: <span className={cn("text-sm", estado.ia === "erro" ? "text-destructive" : "text-muted-foreground")}>{estado.ia === "ok" ? "Conectado e respondendo" : "O login do ChatGPT expirou"}</span>,
      acao: estado.ia === "ok"
        ? <Button variant="outline" className={ACAO} onClick={() => rodar("ia")}><IconRefresh /> Testar de novo</Button>
        : <Button className={ACAO} onClick={() => rodar("ia", "ok")}>Reconectar</Button>,
    },
  ]

  return (
    <OnboardingFrame
      step={4}
      title="Vamos conferir se está tudo certo"
      description="O TekaFlow testa cada parte. Você pode testar de novo quando quiser."
      onBack={voltar}
      onNext={avancar}
    >
      <div className="flex flex-col gap-2">
        {linhas.map((l) => (
          <Item key={l.id} variant="outline" size="sm" className="transition-colors hover:border-foreground/30 hover:bg-muted/60">
            <Estado estado={estado[l.id] === "rodando" && (l.id === "mic" || l.id === "audio") ? "ok" : estado[l.id]} />
            <ItemMedia variant="box">{l.icone}</ItemMedia>
            <ItemContent>
              <ItemTitle>{l.titulo}</ItemTitle>
              <div className="text-sm text-muted-foreground">{estado[l.id] === "rodando" && l.id !== "mic" && l.id !== "audio" ? "Testando…" : l.meio}</div>
            </ItemContent>
            <ItemActions>{l.acao}</ItemActions>
          </Item>
        ))}
      </div>
    </OnboardingFrame>
  )
}


/* ---------------------------------------------------------------------------
   Versão real: dentro do aplicativo (existe window.api) cada teste acontece de
   verdade, um de cada vez, para não brigar pelo microfone e pelo áudio.
--------------------------------------------------------------------------- */

type Fase = "espera" | "testando" | "ok" | "erro"
type Id = "mic" | "audio" | "voz" | "ia"
type Balao = { rotulo: string; texto: string }
type Situacao = { fase: Fase; texto: string; balao?: Balao }
type Resultado = { ok: boolean; texto: string; balao?: Balao }
type Controle = { vivo: boolean; limpar: Set<() => void> }

const LIMIAR_MIC = 0.02
const INICIAL: Record<Id, Situacao> = {
  mic: { fase: "espera", texto: "Aguardando" },
  audio: { fase: "espera", texto: "Aguardando" },
  voz: { fase: "espera", texto: "Aguardando" },
  ia: { fase: "espera", texto: "Aguardando" },
}

/** O que já foi validado nesta abertura do app. Voltar e avançar entre etapas não refaz o que já passou. */
const VALIDADOS: Partial<Record<Id, Situacao>> = {}
/** A fala gravada no teste do microfone. A transcrição usa essa mesma fala, para a pessoa falar uma vez só. */
let FALA_GRAVADA: ArrayBuffer | null = null

const esperar = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/** Mede o pico do som que passa pelo stream durante `ms`, avisando o nível ao vivo. Devolve o pico de 0 a 1. */
async function medir(stream: MediaStream, ms: number, ctl: Controle, aoVivo: (pico: number) => void): Promise<number> {
  const ac = new AudioContext()
  const encerrar = () => void ac.close().catch(() => {})
  ctl.limpar.add(encerrar)
  try {
    await ac.resume().catch(() => {})
    const origem = ac.createMediaStreamSource(stream)
    const analisador = ac.createAnalyser()
    analisador.fftSize = 1024
    origem.connect(analisador)
    const amostra = new Uint8Array(analisador.fftSize)
    let maior = 0
    const fim = performance.now() + ms
    while (ctl.vivo && performance.now() < fim) {
      analisador.getByteTimeDomainData(amostra)
      let pico = 0
      for (const v of amostra) pico = Math.max(pico, Math.abs(v - 128) / 128)
      maior = Math.max(maior, pico)
      aoVivo(pico)
      await esperar(50)
    }
    origem.disconnect()
    return maior
  } finally {
    encerrar()
    ctl.limpar.delete(encerrar)
  }
}

function pararTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop())
}

/** Um miado sintetizado: o tom sobe e desce com um envelope curto, em cerca de meio segundo. */
function miar(ac: AudioContext, saida: AudioNode, inicio: number) {
  const osc = ac.createOscillator()
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(450, inicio)
  osc.frequency.exponentialRampToValueAtTime(900, inicio + 0.18)
  osc.frequency.exponentialRampToValueAtTime(420, inicio + 0.5)
  const filtro = ac.createBiquadFilter()
  filtro.type = "lowpass"
  filtro.frequency.value = 2400
  filtro.Q.value = 3
  const envelope = ac.createGain()
  envelope.gain.setValueAtTime(0.0001, inicio)
  envelope.gain.linearRampToValueAtTime(1, inicio + 0.06)
  envelope.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.5)
  osc.connect(filtro).connect(envelope).connect(saida)
  osc.start(inicio)
  osc.stop(inicio + 0.55)
}

async function acharMicrofone(): Promise<string | undefined> {
  const config = await window.api!.lerConfig()
  const nome = typeof config.microfone === "string" ? config.microfone.trim() : ""
  if (!nome) return undefined
  const dispositivos = await navigator.mediaDevices.enumerateDevices()
  const entradas = dispositivos.filter((d) => d.kind === "audioinput")
  const alvo = entradas.find((d) => d.label === nome) ?? entradas.find((d) => d.label && (d.label.includes(nome) || nome.includes(d.label)))
  return alvo?.deviceId
}

function erroDeMicrofone(e: unknown): string {
  const nome = e instanceof DOMException ? e.name : ""
  if (nome === "NotAllowedError" || nome === "SecurityError") return "O TekaFlow não tem permissão para usar o microfone. Libere na etapa 4."
  if (nome === "NotFoundError") return "Não encontrei nenhum microfone. Conecte um ou troque o microfone."
  if (nome === "NotReadableError") return "Outro programa está usando o microfone. Feche-o e teste de novo."
  return "Não consegui abrir o microfone. Confira se ele está conectado."
}

type Ferramentas = { ctl: Controle; nivel: (p: number) => void }

/** Grava o microfone por `segundos` e devolve um WAV de 16 kHz, mono, 16 bits (o que o reconhecimento de voz quer). */
async function gravarWav(segundos: number, ctl: Controle): Promise<ArrayBuffer> {
  const deviceId = await acharMicrofone()
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { ...(deviceId ? { deviceId: { exact: deviceId } } : {}), echoCancellation: false, noiseSuppression: false } })
  ctl.limpar.add(() => pararTracks(stream))
  const ac = new AudioContext({ sampleRate: 16000 })
  await ac.resume().catch(() => {})
  const origem = ac.createMediaStreamSource(stream)
  const no = ac.createScriptProcessor(4096, 1, 1)
  const pedacos: Float32Array[] = []
  no.onaudioprocess = (e) => pedacos.push(new Float32Array(e.inputBuffer.getChannelData(0)))
  origem.connect(no)
  no.connect(ac.destination) // saída muda: o nó precisa estar ligado para rodar
  await esperar(segundos * 1000)
  origem.disconnect()
  no.disconnect()
  pararTracks(stream)
  await ac.close().catch(() => {})
  const total = pedacos.reduce((n, p) => n + p.length, 0)
  const buf = new ArrayBuffer(44 + total * 2)
  const v = new DataView(buf)
  const txt = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  txt(0, "RIFF"); v.setUint32(4, 36 + total * 2, true); txt(8, "WAVE"); txt(12, "fmt "); v.setUint32(16, 16, true)
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 16000, true); v.setUint32(28, 32000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  txt(36, "data"); v.setUint32(40, total * 2, true)
  let o = 44
  for (const p of pedacos) for (const x of p) { v.setInt16(o, Math.max(-1, Math.min(1, x)) * 0x7fff, true); o += 2 }
  return buf
}

async function transcreverGravando(segundos: number, ctl: Controle) {
  try {
    const wav = await gravarWav(segundos, ctl)
    return await window.api!.transcreverAudio(wav)
  } catch (e) {
    return { ok: false, texto: undefined, erro: erroDeMicrofone(e) }
  }
}

async function testarMicrofone({ ctl, nivel }: Ferramentas): Promise<Resultado> {
  let stream: MediaStream | null = null
  try {
    const deviceId = await acharMicrofone()
    const ajustes = { echoCancellation: false, noiseSuppression: false }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { ...ajustes, deviceId: { exact: deviceId } } : ajustes })
    } catch (e) {
      if (!(e instanceof DOMException) || e.name !== "OverconstrainedError") throw e
      stream = await navigator.mediaDevices.getUserMedia({ audio: ajustes })
    }
  } catch (e) {
    return { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: erroDeMicrofone(e) } }
  }
  ctl.limpar.add(() => pararTracks(stream))
  FALA_GRAVADA = null
  const gravacao = await iniciarGravacao().catch(() => null)
  try {
    const pico = await medir(stream, 5000, ctl, nivel)
    if (gravacao) FALA_GRAVADA = await gravacao.parar()
    return pico > LIMIAR_MIC ? { ok: true, texto: "Ouvi a sua voz" } : { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: "Não ouvi nada no microfone.\nFale mais perto ou escolha outro microfone." } }
  } finally {
    pararTracks(stream)
  }
}

/** Toca o miado e deixa a pessoa dizer se ouviu. `perguntar` mostra "Você ouviu o som?" e devolve a resposta. */
async function testarAudio({ ctl, perguntar }: Ferramentas & { perguntar: () => Promise<"sim" | "nao" | "repetir"> }): Promise<Resultado> {
  const ac = new AudioContext()
  const fechar = () => void ac.close().catch(() => {})
  ctl.limpar.add(fechar)
  try {
    await ac.resume().catch(() => {})
    // Toca na saída escolhida na etapa de permissões.
    try {
      const nome = String((await window.api!.lerConfig()).saida ?? "")
      const saida = (await navigator.mediaDevices.enumerateDevices()).find((d) => d.kind === "audiooutput" && d.label === nome)
      if (saida) await (ac as AudioContext & { setSinkId?: (id: string) => Promise<void> }).setSinkId?.(saida.deviceId)
    } catch { /* usa a saída padrão */ }
    const volume = ac.createGain()
    volume.gain.value = 0.3
    volume.connect(ac.destination)
    for (;;) {
      const inicio = ac.currentTime + 0.3
      for (let i = 0; i < 3; i++) miar(ac, volume, inicio + i * 0.9)
      await esperar(3200)
      const r = await perguntar()
      if (r === "repetir") continue
      return r === "sim"
        ? { ok: true, texto: "Você ouviu o som" }
        : { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: "Você não ouviu o som.\nConfira o volume e a saída de áudio escolhida nas permissões." } }
    }
  } finally {
    fechar()
  }
}

function TestarReal({ step, total, modo = "onboarding", aoAlterarIa }: { step: number; total: number; modo?: "onboarding" | "config"; aoAlterarIa?: () => void }) {
  const { voltar, avancar, irPara } = useNavegacao()
  const alterarIa = aoAlterarIa ?? (irPara ? () => irPara(3) : undefined)
  const [situacao, setSituacao] = useState<Record<Id, Situacao>>({ ...INICIAL, ...VALIDADOS })
  const [nomeIa, setNomeIa] = useState("")
  const [nomeTranscricao, setNomeTranscricao] = useState("Apple Speech")
  const [idIa, setIdIa] = useState("")
  useEffect(() => {
    window.api?.estadoIa().then(async (e) => {
      setIdIa(e.ativa ?? "")
      const provedor = ({ chatgpt: "ChatGPT", claude: "Claude Code", gemini: "Gemini", chave: "Chave de API" } as Record<string, string>)[e.ativa ?? ""] ?? ""
      setNomeIa(provedor)
      // O nome do modelo escolhido (ex.: Claude Haiku 5.5), quando o serviço informa.
      const escolhido = e.ativa ? e.modelos?.[e.ativa] : undefined
      if (e.ativa && ["chatgpt", "claude", "gemini"].includes(e.ativa)) {
        const r = await window.api!.modelosIa(e.ativa)
        const lista = r.modelos ?? []
        const m = lista.find((x) => x.id === escolhido) ?? lista[0]
        if (m) setNomeIa(m.nome)
      }
    })
    window.api?.statusWhisper().then((st) => setNomeTranscricao(({ apple: "Apple Speech", small: "Whisper Small", medium: "Whisper Medium", turbo: "Whisper Large v3 Turbo", large: "Whisper Large v3" } as Record<string, string>)[st.usando] ?? "Apple Speech"))
  }, [])
  const iconeIa = idIa === "gemini" ? <LogoGemini /> : idIa === "claude" ? <LogoClaude /> : idIa === "chave" ? <IconKey /> : <LogoOpenai />
  // Em Configurações, cada item mostra também a permissão do Mac e o dispositivo escolhido.
  const [perm, setPerm] = useState<Record<string, boolean>>({})
  const [microfone, setMicrofone] = useState("")
  useEffect(() => {
    if (!window.api) return
    window.api.lerConfig().then((c) => typeof c.microfone === "string" && setMicrofone(c.microfone))
    const ler = () => window.api!.statusPermissoes().then((st) => setPerm({ mic: st.mic === "liberada", voz: st.voz === "liberada", audio: st.tela === "liberada" }))
    void ler()
    const t = setInterval(ler, 1500)
    return () => clearInterval(t)
  }, [])
  // Teste do som: o app toca e a pessoa confirma se ouviu.
  const [perguntaAudio, setPerguntaAudio] = useState(false)
  const respostaAudio = useRef<((v: "sim" | "nao" | "repetir") => void) | null>(null)
  const responderAudio = (v: "sim" | "nao" | "repetir") => { setPerguntaAudio(false); respostaAudio.current?.(v); respostaAudio.current = null }
  const [nivel, setNivel] = useState(0)
  const [contagem, setContagem] = useState(0)
  const controle = useRef<Controle | null>(null)

  const definir = (id: Id, s: Situacao) => {
    if (s.fase === "ok") VALIDADOS[id] = s
    else if (s.fase === "testando") delete VALIDADOS[id]
    setSituacao((atual) => ({ ...atual, [id]: s }))
  }

  // Cada teste novo cancela o anterior daquela linha: dá para clicar de novo a qualquer momento, mesmo se algo travou.
  const geracoes = useRef<Record<string, number>>({})
  const executar = async (id: Id, ctl: Controle) => {
    if (!ctl.vivo) return
    const g = (geracoes.current[id] = (geracoes.current[id] ?? 0) + 1)
    if (id === "audio") { setPerguntaAudio(false); respostaAudio.current = null }
    definir(id, { fase: "testando", texto: "" })
    setNivel(0)
    const ferramentas: Ferramentas = { ctl, nivel: (p) => ctl.vivo && setNivel((n) => Math.min(100, Math.max(Math.round(p * 300), Math.round(n * 0.8)))) }
    let resultado: Resultado
    try {
      if (id === "mic") resultado = await testarMicrofone(ferramentas)
      else if (id === "audio") resultado = await testarAudio({ ...ferramentas, perguntar: () => new Promise((res) => { respostaAudio.current = res; setPerguntaAudio(true) }) })
      else if (id === "voz") {
        setContagem(5)
        const relogio = window.setInterval(() => setContagem((c) => Math.max(0, c - 1)), 1000)
        try {
          const r = FALA_GRAVADA ? await window.api!.transcreverAudio(FALA_GRAVADA) : await transcreverGravando(5, ctl)
          FALA_GRAVADA = null
          const texto = r.texto?.trim()
          resultado = r.ok && texto
            ? { ok: true, texto: "Entendi o que você falou", balao: { rotulo: "Você disse", texto } }
            : { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: r.ok ? "O microfone ouviu som, mas não reconheci nenhuma palavra.\nClique em Testar e fale uma frase assim que a contagem começar." : `${r.erro || "Não consegui transcrever."}\nConfira a permissão de reconhecimento de voz.` } }
        } finally {
          window.clearInterval(relogio)
        }
      } else {
        const r = await window.api!.testarIa()
        const tempo = typeof r.ms === "number" ? `${(r.ms / 1000).toFixed(1).replace(".", ",")} s` : ""
        if (!r.ok) resultado = { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: r.erro || "A IA não respondeu. Tente de novo ou troque de modelo." } }
        else if (r.acertos && r.acertos.some((a) => !a)) resultado = { ok: false, texto: "Respondeu errado", balao: { rotulo: "O que aconteceu", texto: `Respondeu, mas errou ${r.acertos.map((a, i) => (a ? null : `“${r.perguntas?.[i]}”`)).filter(Boolean).join(" e ")}.\nTroque de modelo ou tente de novo.` } }
        else resultado = { ok: true, texto: tempo ? `Respondeu em ${tempo}` : "Respondeu", balao: { rotulo: `${r.modelo ?? "A IA"} respondeu`, texto: `Perguntei ${r.perguntas?.map((q) => `“${q}”`).join(" e ")}.\nResposta: ${(r.resposta ?? "").replace(/\n+/g, " / ")}` } }
      }
    } catch {
      resultado = { ok: false, texto: "Não funcionou", balao: { rotulo: "O que aconteceu", texto: "O teste não terminou.\nTente de novo." } }
    }
    if (ctl.vivo && geracoes.current[id] === g) {
      definir(id, { fase: resultado.ok ? "ok" : "erro", texto: resultado.texto, balao: resultado.balao })
      // Testar o microfone já manda a fala gravada para a transcrição e mostra o que foi dito.
      if (id === "mic" && resultado.ok) void executar("voz", ctl)
    }
  }

  // Nada roda sozinho: o primeiro "Testar" (no microfone) dispara a sequência, e cada linha pode ser refeita à parte.
  useEffect(() => {
    const ctl: Controle = { vivo: true, limpar: new Set() }
    controle.current = ctl
    return () => {
      ctl.vivo = false
      ctl.limpar.forEach((f) => f())
      ctl.limpar.clear()
    }
  }, [])
  const refazer = (id: Id) => controle.current && void executar(id, controle.current)

  const aoVivo = (rotulo: string, dica: string) => (
    <div className="flex items-center gap-3">
      <Badge variant="success">Ao vivo</Badge>
      <Progress value={nivel} size="thin" className="w-40" aria-label={`Nível: ${rotulo}`} />
      <span className="text-xs text-muted-foreground">{dica}</span>
    </div>
  )

  const detalhe = (id: Id) => {
    const s = situacao[id]
    if (s.fase === "espera") return <span className="text-sm text-muted-foreground">Aguardando</span>
    if (s.fase === "testando") {
      if (id === "mic") return aoVivo("microfone", "Diga uma frase")
      if (id === "audio") return perguntaAudio ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>Você ouviu o som?</span>
          <Button size="sm" onClick={() => responderAudio("sim")}>Sim</Button>
          <Button size="sm" variant="outline" onClick={() => responderAudio("nao")}>Não</Button>
          <Button size="sm" variant="link" className="px-1" onClick={() => responderAudio("repetir")}>Tocar de novo</Button>
        </div>
      ) : <span className="text-sm text-muted-foreground">Tocando um miado… escute com atenção</span>
      if (id === "voz") return <span className="flex items-center gap-2 text-sm"><span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary"><IconMicrophone className="size-4 animate-pulse" /></span>Diga uma frase… {contagem > 0 ? `${contagem} s` : "entendendo"}</span>
      return <span className="text-sm text-muted-foreground">Testando…</span>
    }
    if (s.fase === "ok") {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success">Funcionando</Badge>
          <span className="text-xs text-muted-foreground">{s.texto}</span>
        </div>
      )
    }
    return <span className="text-sm text-destructive">Não funcionou</span>
  }

  const linhas: { id: Id; icone: React.ReactNode; titulo: string }[] = [
    { id: "mic", icone: <IconMicrophone />, titulo: "Microfone" },
    { id: "audio", icone: <IconVolume />, titulo: "Áudio do computador" },
    { id: "voz", icone: <IconFileText />, titulo: `Transcrição (${nomeTranscricao})` },
    { id: "ia", icone: iconeIa, titulo: nomeIa ? `Modelo de análise (${nomeIa})` : "Modelo de análise" },
  ]

    const idPerm: Record<string, string> = { mic: "mic", voz: "voz", audio: "tela" }
    const motivo = (id: Id) => ({ mic: "Para ouvir a sua voz na reunião.", voz: "Para transformar a fala em texto.", audio: "Para ouvir a outra pessoa na chamada.", ia: "Para responder com os seus arquivos." } as Record<Id, string>)[id]
    const conteudo = (
      <div className="flex flex-col gap-6">
        {modo === "config" ? <p className="text-sm text-muted-foreground">Libere o que o TekaFlow precisa e confira se cada parte funciona.</p> : null}
        <div className="flex flex-col gap-3">
          {linhas.map((l) => {
            const s = situacao[l.id]
            const precisa = l.id !== "ia"
            const liberada = !!perm[l.id]
            return (
              <Fragment key={l.id}>
              {l.id === "mic" ? <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Privacidade</h2> : null}
              {l.id === "voz" ? (
                <>
                  <div className="my-2 border-t" />
                  <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Modelos</h2>
                </>
              ) : null}
              <Card variant="interactive" padding="none" className="gap-0">
                <div className="flex items-start gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-foreground [&_svg]:size-6">{l.icone}</span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <b className="text-sm">{l.titulo}</b>
                      {precisa ? (liberada ? <Badge variant="success"><IconCheck /> Concedido</Badge> : <Badge variant="secondary">Pendente</Badge>) : <Badge variant="muted">Conectado</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{motivo(l.id)}</p>
                  </div>
                  {precisa && !liberada ? (
                    <Button className={ACAO} onClick={() => void window.api?.pedirPermissao(idPerm[l.id])}>Permitir</Button>
                  ) : (
                    <Button variant="outline" className={ACAO} onClick={() => refazer(l.id)}><IconRefresh /> {s.fase === "testando" ? "Recomeçar" : s.fase === "espera" ? "Testar" : "Testar de novo"}</Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" aria-label={`Mais opções de ${l.titulo}`}><IconDots /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {l.id === "ia" ? (
                        <DropdownMenuItem onSelect={() => alterarIa?.()}><IconArrowsExchange /> Alterar o modelo</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onSelect={() => void window.api?.abrirAjustes(idPerm[l.id])}><IconExternalLink /> Reabrir Ajustes do Mac</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {s.fase === "testando" || l.id === "mic" || l.id === "audio" || (s.balao && (s.fase === "ok" || s.fase === "erro")) ? (
                  <>
                    <div className="border-t" />
                    <div className="flex min-h-[4.5rem] flex-col justify-center gap-3 p-4">
                      {s.fase === "testando" ? (
                        <div aria-live="polite">{detalhe(l.id)}</div>
                      ) : l.id === "mic" || l.id === "audio" ? (
                        <div className="flex max-w-xs flex-col gap-2">
                          <span className="text-xs font-medium text-muted-foreground">{l.id === "mic" ? "Entrada de voz" : "Saída de áudio"}</span>
                          {l.id === "mic" ? <SeletorMicrofone liberado={liberada} valor={microfone} onChange={setMicrofone} /> : <SeletorSaida liberado={liberada} />}
                        </div>
                      ) : null}
                      {s.balao && (s.fase === "ok" || s.fase === "erro") ? (
                        <div role={s.fase === "erro" ? "alert" : undefined} className={cn("flex flex-col gap-1 rounded-lg px-4 py-3 text-sm", s.fase === "erro" ? "border border-destructive/30 bg-destructive/10 text-destructive" : "bg-muted")}>
                          <span className="text-xs font-medium tracking-wide uppercase opacity-70">{s.balao.rotulo}</span>
                          <span className="whitespace-pre-line">{s.balao.texto}</span>
                        </div>
                      ) : s.fase === "ok" && l.id !== "voz" ? (
                        <div><Badge variant="success">Funcionando</Badge> <span className="text-xs text-muted-foreground">{s.texto}</span></div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </Card>
              </Fragment>
            )
          })}
        </div>
      </div>
    )

  if (modo === "config") return conteudo
  return (
    <OnboardingFrame step={step} total={total} title="Libere o que o TekaFlow precisa" description="" onBack={voltar} onNext={avancar}>
      {conteudo}
    </OnboardingFrame>
  )
}

/** Tela de "testar tudo". No aplicativo os quatro testes são de verdade; fora dele, o protótipo mostra a simulação. */
export function Testar({ step, total, modo, aoAlterarIa }: { step?: number; total?: number; modo?: "onboarding" | "config"; aoAlterarIa?: () => void } = {}) {
  if (typeof window !== "undefined" && window.api) return <TestarReal step={step ?? 4} total={total ?? 5} modo={modo} aoAlterarIa={aoAlterarIa} />
  return <TestarSimulado />
}
