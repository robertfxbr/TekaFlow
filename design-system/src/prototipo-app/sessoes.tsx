import { useState } from "react"
import { IconBook2, IconSearch } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { filtrarGrupos } from "../prototipo/telas/inicio"

/** Sessões: todas as reuniões, agrupadas por dia. Dados de exemplo. */
export function Sessoes({ onAbrir }: { onAbrir?: (titulo: string) => void }) {
  const [termo, setTermo] = useState("")
  const grupos = filtrarGrupos(termo)
  return (
    <div className="flex min-w-0 flex-1 animate-in flex-col gap-6 overflow-y-auto p-8 fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-2xl font-medium">Sessões</h1>
        <span className="flex-1" />
        <InputGroup className="w-64">
          <InputGroupAddon align="inline-start"><IconSearch /></InputGroupAddon>
          <InputGroupInput placeholder="Buscar nas sessões" aria-label="Buscar nas sessões" value={termo} onChange={(e) => setTermo(e.target.value)} />
        </InputGroup>
        <Button variant="outline">Filtrar</Button>
      </div>
      {grupos.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma sessão encontrada.</p> : null}
      {grupos.map((g) => (
        <section key={g.dia} className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-muted-foreground">{g.dia}</h2>
          {g.reunioes.map((r) => (
            <Item key={r.titulo} variant="outline" size="sm" role="button" tabIndex={0} onClick={() => onAbrir?.(r.titulo)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAbrir?.(r.titulo)} className="cursor-pointer transition-colors hover:border-foreground/30 hover:bg-muted/60">
              <ItemMedia variant="box"><IconBook2 /></ItemMedia>
              <ItemContent>
                <ItemTitle>{r.titulo}</ItemTitle>
                <ItemDescription>{r.meta}</ItemDescription>
              </ItemContent>
              <ItemActions><Badge variant="secondary">{r.tag}</Badge></ItemActions>
            </Item>
          ))}
        </section>
      ))}
    </div>
  )
}
