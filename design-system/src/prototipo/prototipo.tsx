import { useState } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OpcaoContext } from "./contexto"
import { LayoutProto } from "./layout"
import { Contexto } from "./telas/contexto"
import { Inicio } from "./telas/inicio"
import { Permissoes } from "./telas/permissoes"
import { Testar } from "./telas/testar"
import { Cerebro } from "./telas/cerebro"
import { Chegar } from "./telas/chegar"
import { Transcricao } from "./telas/transcricao"
import { TELAS } from "./telas"

/** Telas com variantes para testar. Hoje nenhuma. */
const OPCOES: Record<string, string[]> = {}

const TELA_POR_ID: Record<string, React.ReactNode> = {
  chegar: <Chegar />,
  transcricao: <Transcricao />,
  cerebro: <Cerebro />,
  permissoes: <Permissoes />,
  testar: <Testar />,
  contexto: <Contexto />,
  inicio: <Inicio />,
}

/** Protótipo do onboarding: sete telas, com os controles de navegação embaixo. */
export function Prototipo() {
  const [indice, setIndice] = useState(0)
  const [opcao, setOpcao] = useState("A")
  const tela = TELAS[indice]
  const opcoes = OPCOES[tela.id]

  const ir = (novo: number) => {
    if (novo < 0 || novo >= TELAS.length) return
    setIndice(novo)
    setOpcao("A")
  }

  return (
    <OpcaoContext.Provider value={opcao}>
      <LayoutProto
        fluxo="onboarding"
        titulo="TekaFlow"
        navegacao={{ voltar: () => ir(indice - 1), avancar: () => ir(indice + 1) }}
        controles={
          <>
            <Button variant="outline" size="sm" onClick={() => ir(indice - 1)} disabled={indice === 0}><IconArrowLeft /> Voltar</Button>
            <Select value={String(indice)} onValueChange={(v) => ir(Number(v))}>
              <SelectTrigger size="sm" className="w-56" aria-label="Ir para a tela"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TELAS.map((t, i) => <SelectItem key={t.id} value={String(i)}>{i + 1}. {t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => ir(indice + 1)} disabled={indice === TELAS.length - 1}>Avançar <IconArrowRight /></Button>
            <Button variant="ghost" size="sm" onClick={() => ir(TELAS.length - 1)}>Pular para o final</Button>
            {opcoes ? opcoes.map((o) => <Button key={o} size="sm" variant={opcao === o ? "secondary" : "ghost"} onClick={() => setOpcao(o)}>Opção {o}</Button>) : null}
          </>
        }
      >
        <div key={tela.id} className="absolute inset-0">{TELA_POR_ID[tela.id]}</div>
      </LayoutProto>
    </OpcaoContext.Provider>
  )
}
