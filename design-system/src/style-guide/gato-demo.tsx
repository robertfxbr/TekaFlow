import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GatoAnimado } from "@/components/gato-animado"
import type { EstadoGato, OlharGato } from "@/lib/gato-animacao"

const ESTADOS: [EstadoGato, string][] = [
  ["idle", "Idle"],
  ["falando", "Falando"],
  ["lendo", "Lendo"],
  ["pensando", "Pensando"],
  ["escrevendo", "Escrevendo"],
]

const OLHARES: [string, OlharGato][] = [
  ["Automático", null],
  ["Esquerda", { x: -1, y: 0 }],
  ["Direita", { x: 1, y: 0 }],
  ["Cima", { x: 0, y: -1 }],
]

/** O gato animado do TekaFlow, com os estados que o app pode usar. */
export function GatoDemo() {
  const [estado, setEstado] = useState<EstadoGato>("idle")
  const [olhar, setOlhar] = useState<OlharGato>(null)
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border p-8">
      <GatoAnimado estado={estado} olhar={olhar} className="size-48" />
      <div className="flex flex-wrap justify-center gap-2">
        {ESTADOS.map(([id, nome]) => (
          <Button key={id} size="sm" variant={estado === id ? "default" : "outline"} onClick={() => setEstado(id)}>
            {nome}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {OLHARES.map(([nome, alvo]) => (
          <Button key={nome} size="sm" variant={olhar === alvo ? "secondary" : "ghost"} onClick={() => setOlhar(alvo)}>
            {nome}
          </Button>
        ))}
      </div>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Em uso: <code>{`<GatoAnimado estado="falando" />`}</code>. Pensando e Escrevendo são o loading padrão. O olhar é opcional: no estado Lendo, o app passa para onde o texto está.
      </p>
    </div>
  )
}
