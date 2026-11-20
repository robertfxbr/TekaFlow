import { useEffect, useState } from "react"
import { IconSparkles, IconStar, IconTool, IconWand } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GatoAnimado } from "@/components/gato-animado"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { JANELA } from "../prototipo/janela"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Secao = { titulo: string; icone: React.ReactNode; itens: [string, string][] }

/**
 * A nota de versão, no padrão do JobRelay: título com a mudança principal, versão e data, Destaques, Novidades, Melhorias e Correções.
 * Cada item é "Nome curto: Descrição", e a descrição começa com Adicionamos, Alteramos, Criamos ou Corrigimos. Seção sem item some.
 * O conteúdo abaixo é de exemplo.
 */
const NOTA = {
  titulo: "TekaFlow 0.2.0: teste antes de começar",
  versao: "Versão 0.2.0",
  data: "20 de Novembro de 2026",
  destaques: ["A gravação agora começa sozinha, depois de um teste rápido do microfone e da IA.", "Os modelos locais ganharam descrição e tamanho de verdade."],
  secoes: [
    { titulo: "Novidades", icone: <IconSparkles className="size-4" />, itens: [
      ["Teste antes de começar", "Adicionamos um teste de microfone e uma pergunta para a IA antes de cada sessão. Se tudo estiver certo, a gravação começa sozinha."],
      ["Busca nas reuniões", "Criamos uma busca na tela inicial e em Sessões. A lista filtra enquanto você digita."],
    ] },
    { titulo: "Melhorias", icone: <IconWand className="size-4" />, itens: [
      ["Modelos locais", "Alteramos a lista para os modelos que existem de verdade, cada um com tamanho e idiomas. Os que você já baixou continuam no lugar."],
      ["Download dos modelos", "Alteramos o carregamento: o ícone, a barra e a porcentagem ficam na mesma linha."],
    ] },
    { titulo: "Correções", icone: <IconTool className="size-4" />, itens: [
      ["Barra de rolagem", "Corrigimos o conteúdo que se mexia quando a barra de rolagem aparecia."],
    ] },
  ] as Secao[],
}

type Fase = "nota" | "baixando" | "instalando"

/** O modal tem 80% da largura e da altura da janela do app; a tela de atualizar tem 80% do modal. */
const MODAL = { width: Math.round(JANELA.width * 0.8), height: Math.round(JANELA.height * 0.8) }
const ATUALIZANDO = { width: Math.round(MODAL.width * 0.8), height: Math.round(MODAL.height * 0.8) }

/** O gato falando enquanto a atualização baixa, com o carregamento e a barra. */
function Atualizando({ fase, progresso }: { fase: Fase; progresso: number }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-10" role="status" aria-live="polite">
      <GatoAnimado estado="falando" className="size-24 text-primary" />
      <div className="flex flex-col items-center gap-1 text-center">
        <b className="flex items-center gap-2 text-base"><Spinner className="size-4" /> {fase === "baixando" ? "Baixando a atualização" : "Atualizando o TekaFlow"}</b>
        <span className="text-sm text-muted-foreground">{fase === "baixando" ? `${progresso}%` : "O app vai fechar sozinho."}</span>
      </div>
      <Progress value={fase === "baixando" ? progresso : 100} size="thin" className="w-64" aria-label="Progresso da atualização" />
    </div>
  )
}

/** O que mudou na nova versão. Atualizar baixa, instala e fecha o app, tudo por aqui. */
export function ModalRelease({ aberto, onFechar, onConcluir }: { aberto: boolean; onFechar: () => void; onConcluir: () => void }) {
  const [fase, setFase] = useState<Fase>("nota")
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    if (!aberto) { setFase("nota"); setProgresso(0) }
  }, [aberto])

  useEffect(() => {
    if (fase !== "baixando") return
    const t = window.setInterval(() => {
      setProgresso((p) => {
        const v = Math.min(100, p + 4)
        if (v === 100) { window.clearInterval(t); window.setTimeout(() => setFase("instalando"), 400) }
        return v
      })
    }, 120)
    return () => window.clearInterval(t)
  }, [fase])

  useEffect(() => {
    if (fase !== "instalando") return
    const t = window.setTimeout(onConcluir, 2200)
    return () => window.clearTimeout(t)
  }, [fase, onConcluir])

  const atualizando = fase !== "nota"

  return (
    <Dialog open={aberto} onOpenChange={(a) => !a && !atualizando && onFechar()}>
      <DialogContent showCloseButton={!atualizando} className="flex flex-col gap-0 p-0 transition-all duration-300 sm:max-w-none" style={atualizando ? ATUALIZANDO : MODAL} onInteractOutside={(e) => atualizando && e.preventDefault()} onEscapeKeyDown={(e) => atualizando && e.preventDefault()}>
        <DialogHeader className="gap-2 px-6 pt-6 pb-4">
          <span className="text-xs text-muted-foreground">{NOTA.data}</span>
          <DialogTitle className="font-heading text-xl font-medium">{NOTA.titulo}</DialogTitle>
          <Badge variant="soft" className="w-fit">{NOTA.versao}</Badge>
          <DialogDescription className="sr-only">O que mudou nesta versão do TekaFlow.</DialogDescription>
        </DialogHeader>

        {atualizando ? (
          <Atualizando fase={fase} progresso={progresso} />
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
              <section className="flex flex-col gap-2">
                <h3 className="flex items-center gap-2 text-base font-medium"><IconStar className="size-4 text-primary" /> Destaques</h3>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-base text-muted-foreground">
                  {NOTA.destaques.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </section>
              {NOTA.secoes.map((s) => (
                <section key={s.titulo} className="flex flex-col gap-2">
                  <h3 className="flex items-center gap-2 text-base font-medium"><span className="text-primary">{s.icone}</span> {s.titulo}</h3>
                  <ul className="flex flex-col gap-3 text-base">
                    {s.itens.map(([nome, desc]) => (
                      <li key={nome}><b>{nome}:</b> <span className="text-muted-foreground">{desc}</span></li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <DialogFooter className="border-t border-foreground/15 px-6 py-4">
              <Button onClick={() => setFase("baixando")}>Atualizar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
