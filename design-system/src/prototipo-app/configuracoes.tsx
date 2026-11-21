import { useEffect, useState } from "react"
import {
  IconArrowLeft, IconCube, IconDownload, IconExternalLink, IconGhost, IconKeyboard, IconLanguage, IconPower,
  IconSettings, IconShieldLock, IconHelp, IconCat, IconSparkles, IconFileText,
} from "@tabler/icons-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { shortcutKeys } from "@/lib/platform"
import { ListaPermissoes } from "../prototipo/telas/permissoes"
import { useNaoImplementado } from "../prototipo/contexto"
import { Cerebro } from "../prototipo/telas/cerebro"
import { Testar } from "../prototipo/telas/testar"
import { Transcricao } from "../prototipo/telas/transcricao"

const SECOES = [
  { nome: "Geral", icone: <IconSettings /> },
  { nome: "Modelos", icone: <IconCube /> },
  { nome: "Permissões", icone: <IconShieldLock /> },
  { nome: "Atalhos", icone: <IconKeyboard /> },
  { nome: "Sobre", icone: <IconHelp /> },
]

function Bloco({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      {titulo ? <h2 className="text-sm font-medium">{titulo}</h2> : null}
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

function Linha({ titulo, descricao, icone, children }: { titulo: string; descricao?: string; icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card padding="md" className="flex-row items-center gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background [&_svg]:size-6">{icone}</span>
      <div className="flex flex-1 flex-col gap-1"><b className="text-sm">{titulo}</b>{descricao ? <span className="text-xs text-muted-foreground">{descricao}</span> : null}</div>
      {children}
    </Card>
  )
}

function Atalhos() {
  const nao = useNaoImplementado()
  const indisponivel = <Badge variant="outline" className="border-dashed text-muted-foreground/80">Indisponível</Badge>
  const iniciar = shortcutKeys("D")
  return (
    <Bloco>
      <Linha icone={<IconKeyboard />} titulo="Iniciar e parar a sessão" descricao="Funciona em qualquer app.">{nao ? indisponivel : <span className="flex gap-1">{iniciar.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}</Linha>
      <Linha icone={<IconGhost />} titulo="Esconder a janela do chat" descricao="Some e volta sem encerrar.">{nao ? indisponivel : <span className="flex gap-1">{shortcutKeys("H").map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}</Linha>
    </Bloco>
  )
}

function Geral() {
  // No app real, nada aqui funciona ainda: sem interruptor falso, só "Indisponível". No protótipo, os controles de exemplo.
  const real = Boolean(useNaoImplementado())
  const nada = <Badge variant="outline" className="border-dashed text-muted-foreground/80">Indisponível</Badge>
  return (
    <Bloco>
      <Linha icone={<IconPower />} titulo="Abrir o TekaFlow ao ligar o computador">{real ? nada : <Switch aria-label="Abrir ao ligar" />}</Linha>
      <Linha icone={<IconGhost />} titulo="Modo fantasma" descricao="A janela do chat fica fora de gravações e compartilhamentos de tela.">{real ? nada : <Switch defaultChecked aria-label="Modo fantasma" />}</Linha>
      <Linha icone={<IconLanguage />} titulo="Idioma da interface">
        {real ? nada : (
          <Select defaultValue="pt">
            <SelectTrigger size="sm" className="w-44" aria-label="Idioma da interface"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="pt">Português (Brasil)</SelectItem><SelectItem value="en">English</SelectItem></SelectContent>
          </Select>
        )}
      </Linha>
    </Bloco>
  )
}

const LINK = "inline-flex items-center gap-1 text-primary underline underline-offset-4"

/** Sobre: quem somos, em tom de conversa. Foto de gato é placeholder. */
function Sobre() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-heading text-xl font-medium text-balance">Seu companheiro discreto, que ouve junto e sussurra quando precisa.</p>
        <p className="text-base text-muted-foreground">Reunião ao vivo pede atenção inteira. O TekaFlow fica numa janela ao lado, escuta a conversa e, quando chega uma pergunta difícil, sugere o que você pode dizer. Quem decide é você.</p>
        <p className="text-base text-muted-foreground">Ele roda no seu computador e usa a IA que você já tem: uma conta sua, uma chave ou um modelo local. Com modelo local, a conversa nem sai da sua máquina.</p>
        <p className="text-base text-muted-foreground">A ideia é que seja gratuito, sem créditos para comprar e sem assinatura por algo essencial. A conta de IA que você já usa pode ter custo no próprio serviço, e isso fica entre você e ele.</p>
      </div>

      <Card padding="lg" className="flex-row items-center gap-6">
        <div className={`size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-muted text-muted-foreground ${useNaoImplementado() ? "hidden" : "flex"}`} role="img" aria-label="Foto da Tesla, a definir">
          <IconCat className="size-10" />
          <span className="text-xs">foto a definir</span>
        </div>
        <div className="flex flex-col gap-2 text-base">
          <b>De onde veio</b>
          <p className="text-muted-foreground">A base do app foi criada pelo Robert. O nome Teka é uma homenagem à Tesla, a gatinha dele, que faleceu. É dela o gato que mora aqui.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a className={LINK} href="https://github.com/robertfxbr" target="_blank" rel="noreferrer">GitHub do Robert <IconExternalLink className="size-4" /></a>
            <a className={LINK} href="https://github.com/caarloshq" target="_blank" rel="noreferrer">GitHub do Carlos <IconExternalLink className="size-4" /></a>
          </p>
        </div>
      </Card>
    </div>
  )
}

function EmBreve({ nome }: { nome: string }) {
  return <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{nome}: ainda não desenhado.</p>
}

/** Configurações: menu lateral próprio e, em Modelos, as abas Ouvir e Responder. */
export function Configuracoes({ onVoltar, abaInicial = "ouvir", onAtualizar }: { onVoltar: () => void; abaInicial?: "ouvir" | "responder"; onAtualizar?: () => void }) {
  const [secao, setSecao] = useState("Modelos")
  const [aba, setAba] = useState<string>(abaInicial)
  const [versao, setVersao] = useState("0.1.0")
  useEffect(() => { window.api?.info().then((i) => setVersao(i.versao)) }, [])
  return (
    <div className="flex h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <nav className="flex w-52 shrink-0 flex-col gap-1 border-r bg-sidebar p-4" aria-label="Configurações">
        <Button variant="ghost" className="justify-start" onClick={onVoltar}><IconArrowLeft /> Voltar ao Início</Button>
        <h2 className="mt-4 mb-1 px-3 text-xs font-medium text-muted-foreground">Configurações</h2>
        {SECOES.map((s) => (
          <Button key={s.nome} variant={secao === s.nome ? "secondary" : "ghost"} className="justify-start" aria-current={secao === s.nome ? "page" : undefined} onClick={() => setSecao(s.nome)}>
            {s.icone} {s.nome}
          </Button>
        ))}
        <span className="flex-1" />
        <Button variant="outline" className="justify-start" onClick={onAtualizar}><IconDownload /> Atualizar</Button>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-8">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-medium">{secao}</h1>
          {secao === "Sobre" ? <Badge variant="muted">Versão {versao}</Badge> : null}
        </div>
        {secao === "Modelos" ? (
          <>
            <Tabs value={aba} onValueChange={setAba}>
              <TabsList aria-label="Tipo de modelo">
                <TabsTrigger value="ouvir"><IconFileText /> Transcrição</TabsTrigger>
                <TabsTrigger value="responder"><IconSparkles /> Análise</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="-mt-2 text-sm text-muted-foreground">
              {aba === "ouvir" ? "A transcrição transforma a fala da reunião em texto. Escolha como o TekaFlow vai ouvir." : "A análise lê a conversa e os seus arquivos para sugerir o que dizer. Escolha qual IA vai responder."}
            </p>
            <div className="border-t" />
            {aba === "ouvir" ? <Transcricao modo="config" /> : <Cerebro modo="config" />}
          </>
        ) : secao === "Geral" ? <Geral /> : secao === "Atalhos" ? <Atalhos /> : secao === "Permissões" ? (window.api ? <Testar modo="config" aoAlterarIa={() => { setSecao("Modelos"); setAba("responder") }} /> : <ListaPermissoes iniciais={{ mic: true, tela: true, voz: true }} />) : secao === "Sobre" ? <Sobre /> : <EmBreve nome={secao} />}
      </div>
    </div>
  )
}
