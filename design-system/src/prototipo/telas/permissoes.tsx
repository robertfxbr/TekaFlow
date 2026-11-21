import { useEffect, useState } from "react"
import { IconAccessible, IconCheck, IconEar, IconMicrophone, IconVolume } from "@tabler/icons-react"

import { OnboardingFrame } from "@/components/onboarding-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useNavegacao, useSistema } from "../contexto"

type Permissao = { id: string; titulo: string; motivo: string; icone: React.ReactNode; obrigatoria: boolean; soMac?: boolean; aviso?: string }

export const PERMISSOES: Permissao[] = [
  { id: "mic", titulo: "Microfone", motivo: "Precisamos do microfone para ouvir a sua voz durante a reunião. Sem ele, o TekaFlow não escuta o que você fala.", icone: <IconMicrophone />, obrigatoria: true },
  { id: "tela", titulo: "Gravação de áudio", motivo: "Precisamos gravar o áudio do computador para ouvir a outra pessoa na chamada. O TekaFlow não grava a sua tela.", icone: <IconVolume />, obrigatoria: true },
  { id: "voz", titulo: "Reconhecimento de voz", motivo: "Precisamos do reconhecimento de voz do Mac para transformar a fala em texto. Isso acontece no seu computador.", icone: <IconEar />, obrigatoria: true, soMac: true },
  { id: "acess", titulo: "Acessibilidade", motivo: "Para ler o texto que você seleciona.", icone: <IconAccessible />, obrigatoria: false },
]

// Microfones de exemplo
export const MICROFONES = ["Microfone do computador", "AirPods de Carlos", "Microfone USB"]
export const SAIDAS = ["Alto-falantes do computador", "AirPods de Carlos", "Monitor HDMI"]

function Estado({ ok, obrigatoria }: { ok: boolean; obrigatoria: boolean }) {
  if (ok) return <Badge variant="success"><IconCheck /> Concedido</Badge>
  return obrigatoria ? <Badge variant="secondary">Pendente</Badge> : <Badge variant="outline">Opcional</Badge>
}

/** Dentro do app, lê os microfones de verdade; no protótipo, usa a lista de exemplo. */
function useMicrofones(liberado: boolean) {
  const [lista, setLista] = useState<string[]>(MICROFONES)
  useEffect(() => {
    if (!window.api || !liberado) return
    navigator.mediaDevices.enumerateDevices().then((d) => {
      const nomes = d.filter((x) => x.kind === "audioinput" && x.deviceId !== "default" && x.deviceId !== "communications").map((x) => x.label).filter(Boolean)
      if (nomes.length) setLista(nomes)
    }).catch(() => {})
  }, [liberado])
  return lista
}

/** Saídas de som: no app vêm do Mac; no protótipo, lista de exemplo. A escolha vale para o som do teste. */
export function SeletorSaida({ liberado }: { liberado: boolean }) {
  const [lista, setLista] = useState<string[]>(SAIDAS)
  const [valor, setValor] = useState(window.api ? "" : SAIDAS[0])
  useEffect(() => {
    if (!window.api) return
    window.api.lerConfig().then((c) => typeof c.saida === "string" && setValor(c.saida))
  }, [])
  useEffect(() => {
    if (!window.api || !liberado) return
    navigator.mediaDevices.enumerateDevices().then((d) => {
      const nomes = d.filter((x) => x.kind === "audiooutput" && x.deviceId !== "default" && x.deviceId !== "communications").map((x) => x.label).filter(Boolean)
      if (nomes.length) setLista(nomes)
    }).catch(() => {})
  }, [liberado])
  useEffect(() => {
    if (window.api && liberado && lista.length && !lista.includes(valor)) setValor(lista[0])
  }, [liberado, lista, valor])
  return (
    <Select value={liberado && lista.includes(valor) ? valor : ""} onValueChange={(v) => { setValor(v); window.api?.salvarConfig("saida", v) }} disabled={!liberado}>
      <SelectTrigger size="sm" className="w-full text-xs" aria-label="Saída de áudio">
        <SelectValue placeholder="Escolher saída" />
      </SelectTrigger>
      <SelectContent>
        {lista.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

export function SeletorMicrofone({ liberado, valor, onChange }: { liberado: boolean; valor: string; onChange: (v: string) => void }) {
  const lista = useMicrofones(liberado)
  // Sem escolha válida, usa o microfone que o Mac usa agora (o primeiro da lista) e guarda a escolha.
  useEffect(() => {
    if (window.api && liberado && lista.length && !lista.includes(valor)) onChange(lista[0])
  }, [liberado, lista, valor, onChange])
  return (
    <Select value={liberado && lista.includes(valor) ? valor : ""} onValueChange={(v) => { onChange(v); window.api?.salvarConfig("microfone", v) }} disabled={!liberado}>
      <SelectTrigger size="sm" className="w-full text-xs" aria-label="Microfone">
        <SelectValue placeholder="Escolher microfone" />
      </SelectTrigger>
      <SelectContent>
        {lista.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

/** Os cartões de permissão, de altura fixa. `iniciais` diz quais já estão liberadas. */
export function GradePermissoes({ iniciais = {} }: { iniciais?: Record<string, boolean> }) {
  const mac = useSistema() === "mac"
  const [liberadas, setLiberadas] = useState<Record<string, boolean>>(iniciais)
  const [microfone, setMicrofone] = useState(window.api ? "" : MICROFONES[0])
  useEffect(() => { window.api?.lerConfig().then((c) => typeof c.microfone === "string" && setMicrofone(c.microfone)) }, [])
  const lista = PERMISSOES.filter((p) => mac || !p.soMac)
  // No app real, o estado vem do Mac e é conferido de novo a cada 1,5 s (a pessoa libera nos Ajustes e volta).
  useEffect(() => { void window.api?.prepararCofre() }, [])
  useEffect(() => {
    if (!window.api) return
    const ler = () => window.api!.statusPermissoes().then((s) => setLiberadas((l) => ({ ...l, mic: s.mic === "liberada", tela: s.tela === "liberada", voz: s.voz === "liberada" })))
    ler()
    const t = setInterval(ler, 1500)
    return () => clearInterval(t)
  }, [])
  const liberar = (id: string) => {
    if (window.api) { window.api.pedirPermissao(id); return }
    setLiberadas((l) => ({ ...l, [id]: true }))
  }
  const sistema = mac ? "Ajustes" : "Configurações"

  const principais = lista.filter((p) => p.id !== "acess")
  return (
    <div className="flex flex-col gap-4">
    <div className={cn("grid gap-4", principais.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {principais.map((p) => {
        const ok = !!liberadas[p.id]
        return (
          <Card key={p.id} variant="interactive" padding="md" className="h-80 gap-0">
            <div className="flex items-start justify-between gap-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-background text-foreground [&_svg]:size-6">{p.icone}</span>
              <Estado ok={ok} obrigatoria={p.obrigatoria} />
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <b className="text-sm">{p.titulo}</b>
              <span className="line-clamp-3 min-h-12 text-xs text-muted-foreground">{p.motivo}</span>
            </div>
            {p.id === "mic" || p.id === "tela" ? (
              <div className="mt-3 flex flex-col gap-2 border-t border-foreground/15 pt-3">
                <span className="text-xs font-medium text-muted-foreground">{p.id === "mic" ? "Entrada de voz" : "Saída de áudio"}</span>
                {p.id === "mic" ? <SeletorMicrofone liberado={ok} valor={microfone} onChange={setMicrofone} /> : <SeletorSaida liberado={ok} />}
              </div>
            ) : null}
            <div className="mt-auto flex flex-col gap-3">
              {(p.id === "mic" || p.id === "tela") && !ok ? <span className="text-center text-xs text-muted-foreground">Permita o acesso para escolher.</span> : null}
              {ok ? (
                <Button variant="outline" className="w-full" onClick={() => window.api?.abrirAjustes(p.id)}>Reabrir {sistema}</Button>
              ) : (
                <Button className="w-full" variant={p.obrigatoria ? "default" : "outline"} onClick={() => liberar(p.id)}>Permitir</Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
    </div>
  )
}

/** Permissões em linhas, uma por permissão, para a tela de Configurações. Pede de verdade quando clica. */
export function ListaPermissoes({ iniciais = {} }: { iniciais?: Record<string, boolean> }) {
  const mac = useSistema() === "mac"
  const [liberadas, setLiberadas] = useState<Record<string, boolean>>(window.api ? {} : iniciais)
  const [microfone, setMicrofone] = useState(window.api ? "" : MICROFONES[0])
  const sistema = mac ? "Ajustes" : "Configurações"
  useEffect(() => { window.api?.lerConfig().then((c) => typeof c.microfone === "string" && setMicrofone(c.microfone)) }, [])
  useEffect(() => {
    if (!window.api) return
    const ler = () => window.api!.statusPermissoes().then((s) => setLiberadas((l) => ({ ...l, mic: s.mic === "liberada", tela: s.tela === "liberada", voz: s.voz === "liberada" })))
    ler()
    const t = setInterval(ler, 1500)
    return () => clearInterval(t)
  }, [])
  const pedir = (id: string) => (window.api ? void window.api.pedirPermissao(id) : setLiberadas((l) => ({ ...l, [id]: true })))
  return (
    <div className="flex flex-col gap-3">
      {PERMISSOES.filter((p) => mac || !p.soMac).map((p) => {
        const ok = !!liberadas[p.id]
        const desligada = p.id === "acess"
        const seletor = p.id === "mic" ? { rotulo: "Entrada de voz", el: <SeletorMicrofone liberado={ok} valor={microfone} onChange={setMicrofone} /> } : p.id === "tela" ? { rotulo: "Saída de áudio", el: <SeletorSaida liberado={ok} /> } : null
        return (
          <Card key={p.id} variant="interactive" padding="md" className={cn("gap-4", desligada && "pointer-events-none opacity-60")}>
            <div className="flex items-start gap-4">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg bg-background [&_svg]:size-6", desligada ? "text-muted-foreground" : "text-foreground")}>{p.icone}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <b className="text-sm">{p.titulo}</b>
                  {desligada ? <Badge variant="outline">Em breve</Badge> : <Estado ok={ok} obrigatoria={p.obrigatoria} />}
                </div>
                <span className="text-xs text-muted-foreground">{desligada ? "Fica para uma próxima versão." : p.motivo}</span>
              </div>
            </div>
            {!desligada ? (
              <div className="flex items-end gap-4 pl-14">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  {seletor ? (
                    <>
                      <span className="text-xs font-medium text-muted-foreground">{seletor.rotulo}</span>
                      {seletor.el}
                    </>
                  ) : null}
                </div>
                <div className="w-44">
                  {ok ? (
                    <Button variant="outline" className="w-full" onClick={() => window.api?.abrirAjustes(p.id)}>Reabrir {sistema}</Button>
                  ) : (
                    <Button className="w-full" variant={p.obrigatoria ? "default" : "outline"} onClick={() => pedir(p.id)}>Permitir</Button>
                  )}
                </div>
              </div>
            ) : null}
          </Card>
        )
      })}
    </div>
  )
}

/** Tela 4: o motivo de cada permissão do sistema. Parte do cenário em que nada foi liberado. */
export function Permissoes() {
  const { voltar, avancar } = useNavegacao()
  const mac = useSistema() === "mac"
  return (
    <OnboardingFrame
      step={3}
      title="Libere o que o TekaFlow precisa"
      description={`O ${mac ? "Mac" : "Windows"} pode pedir a sua autorização em cada uma. Ao liberar a gravação de áudio, o app reinicia.`}
      onBack={voltar}
      onNext={avancar}
    >
      <GradePermissoes />
    </OnboardingFrame>
  )
}
