import { useState } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { NaoImplementadoContext, NavegacaoContext, OpcaoContext, SistemaContext } from "@/prototipo/contexto"
import { Cerebro } from "@/prototipo/telas/cerebro"
import { Chegar } from "@/prototipo/telas/chegar"
import { Contexto } from "@/prototipo/telas/contexto"
import { Testar } from "@/prototipo/telas/testar"
import { Transcricao } from "@/prototipo/telas/transcricao"

/** As cinco telas do onboarding (quatro etapas numeradas), na ordem. A sétima tela do protótipo é a tela inicial, que o aplicativo mostra depois. */
const ETAPAS = [<Chegar key="1" />, <Transcricao key="2" />, <Cerebro key="3" />, <Testar key="4" step={3} total={4} />, <Contexto key="5" />]

export const TOTAL_ETAPAS = ETAPAS.length

/** O onboarding do aplicativo. Hoje as etapas são as do protótipo, ainda simuladas; cada uma vira real numa spec própria. */
export function Onboarding({ etapa, onEtapa, onConcluir }: { etapa: number; onEtapa: (n: number) => void; onConcluir: () => void }) {
  const [opcao] = useState("A")
  const [aviso, setAviso] = useState<string | null>(null)
  const indice = Math.min(Math.max(etapa, 1), TOTAL_ETAPAS) - 1

  const voltar = () => indice > 0 && onEtapa(indice)
  const avancar = () => (indice >= TOTAL_ETAPAS - 1 ? onConcluir() : onEtapa(indice + 2))

  return (
    <SistemaContext.Provider value="mac">
      <OpcaoContext.Provider value={opcao}>
        <NavegacaoContext.Provider value={{ voltar, avancar, irPara: onEtapa }}>
          <NaoImplementadoContext.Provider value={setAviso}>
            <div key={indice} className="relative h-full">
              {ETAPAS[indice]}
            </div>
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
          </NaoImplementadoContext.Provider>
        </NavegacaoContext.Provider>
      </OpcaoContext.Provider>
    </SistemaContext.Provider>
  )
}
