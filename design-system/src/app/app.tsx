import { useCallback, useEffect, useState } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NaoImplementadoContext, SistemaContext } from "@/prototipo/contexto"
import { Configuracoes } from "@/prototipo-app/configuracoes"
import { PastaEChat } from "@/prototipo/telas/contexto"
import { InicioConteudo, MenuLateral, type Grupo, type Secao, type Totais } from "@/prototipo/telas/inicio"
import { SessoesVazio } from "./estados-vazios"
import { agruparPorDia, totaisDoPainel } from "./dados"
import { Onboarding } from "./onboarding"
import { useAtualizacao } from "./atualizacao"
import { Reuniao } from "./reuniao"

type Fase = "carregando" | "onboarding" | "inicio"

/** A faixa de cima da janela, igual à do protótipo: os botões do Mac à esquerda, o nome no centro. Arrasta a janela. */
function Faixa() {
  return (
    <header className="flex h-10 shrink-0 items-center justify-center border-b text-xs text-muted-foreground" style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
      TekaFlow
    </header>
  )
}

/** O aplicativo depois do onboarding: menu lateral e as quatro áreas. Início e Sessões ficam vazios até haver sessões. */
function Principal() {
  const [secao, setSecao] = useState<Secao>("Início")
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [totais, setTotais] = useState<Totais>({ sessoes: "0", ouvidas: "0 min", respostas: "0" })
  const [aviso, setAviso] = useState<string | null>(null)
  const [emReuniao, setEmReuniao] = useState(false)
  const atualizacao = useAtualizacao()

  useEffect(() => {
    const carregar = () => window.api?.listarSessoes().then((dados) => {
      setGrupos(agruparPorDia(dados))
      setTotais(totaisDoPainel(dados))
    })
    carregar()
    // Ao voltar da janela da reunião, a lista já mostra a reunião que acabou de ser salva.
    window.addEventListener("focus", carregar)
    return () => window.removeEventListener("focus", carregar)
  }, [])

  const iniciar = () => (window.api ? void window.api.abrirJanelaReuniao() : setEmReuniao(true))
  const vazio = grupos.length === 0
  return (
    <NaoImplementadoContext.Provider value={setAviso}>
      <SistemaContext.Provider value="mac">
        {emReuniao ? (
          <Reuniao onSair={() => setEmReuniao(false)} />
        ) : secao === "Configurações" ? (
          <Configuracoes onVoltar={() => setSecao("Início")} onAtualizar={() => void atualizacao.verificar(true)} />
        ) : (
          <div className="flex h-full">
            <MenuLateral ativo={secao} onNavegar={setSecao} />
            {secao === "Contexto" ? (
              <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-8">
                <h1 className="font-heading text-2xl font-medium">Contexto</h1>
                <PastaEChat aoTrocarIa={() => setSecao("Configurações")} />
              </div>
            ) : secao === "Sessões" && vazio ? (
              <SessoesVazio />
            ) : (
              <InicioConteudo grupos={grupos} totais={totais} onIniciar={iniciar} onTestar={() => setAviso("Testar de novo")} />
            )}
          </div>
        )}
        {atualizacao.dialogo}
        <AlertDialog open={aviso !== null} onOpenChange={(a) => !a && setAviso(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Indisponível</AlertDialogTitle>
              <AlertDialogDescription>{aviso} ainda não está disponível no app.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Entendi</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SistemaContext.Provider>
    </NaoImplementadoContext.Provider>
  )
}

/** O aplicativo: na primeira vez abre o onboarding; depois de concluído, abre a tela inicial. */
export function App() {
  // A janelinha da reunião usa o mesmo app, mas mostra só a reunião.
  if (window.location.hash === "#reuniao") return <TooltipProvider><Reuniao sozinha onSair={() => void window.api?.fecharJanelaReuniao()} /></TooltipProvider>
  return <AppCompleto />
}

function AppCompleto() {
  const [fase, setFase] = useState<Fase>("carregando")
  const [etapa, setEtapa] = useState(1)

  // Ao abrir, vê se o onboarding já foi concluído e em que etapa parou
  useEffect(() => {
    const api = window.api
    if (!api) return setFase("onboarding")
    api.lerConfig().then((c) => {
      if (c.onboardingConcluido === true) setFase("inicio")
      else {
        setEtapa(typeof c.onboardingEtapa === "number" ? c.onboardingEtapa : 1)
        setFase("onboarding")
      }
    })
  }, [])

  const irParaEtapa = useCallback((n: number) => {
    setEtapa(n)
    setFase("onboarding")
    window.api?.salvarConfig("onboardingEtapa", n)
  }, [])

  const concluir = useCallback(() => {
    window.api?.salvarConfig("onboardingConcluido", true)
    setFase("inicio")
  }, [])

  // Menu Desenvolvimento: pular para uma etapa, para a tela inicial ou refazer tudo
  useEffect(() => {
    return window.api?.aoPedirEtapa((pedido) => {
      if (pedido === "inicio") return setFase("inicio")
      if (pedido === "refazer") {
        window.api?.salvarConfig("onboardingConcluido", false)
        return irParaEtapa(1)
      }
      irParaEtapa(pedido)
    })
  }, [irParaEtapa])

  return (
    <TooltipProvider>
      <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
        <Faixa />
        <div className="relative min-h-0 flex-1">
          {fase === "onboarding" ? <Onboarding etapa={etapa} onEtapa={irParaEtapa} onConcluir={concluir} /> : fase === "inicio" ? <Principal /> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}
