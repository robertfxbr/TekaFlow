import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

type ModelRowProps = {
  icon: ReactNode
  name: string
  badges?: { label: string; tone?: "primary" | "muted" | "warning" }[]
  /** O que o modelo é, em uma frase. */
  description?: string
  /** Tamanho, idiomas e outros dados curtos. */
  detail: string
  selected?: boolean
  action: ReactNode
}

const tones = { primary: "soft", muted: "muted", warning: "warning" } as const

/** Largura única das ações da linha (Baixar, Usar, Em uso, progresso), para nenhuma mudar o tamanho ao trocar de estado. */
export const ACAO_LARGURA = "w-28 justify-center"

/** Linha de modelo: ícone, nome com selos, descrição, detalhe e a ação à direita. O hover vale para o cartão inteiro. */
export function ModelRow({ icon, name, badges = [], description, detail, selected, action }: ModelRowProps) {
  return (
    <Card variant={selected ? "selected" : "interactive"} padding="none" className="flex-row items-center gap-4 p-4" aria-current={selected ? "true" : undefined}>
      <ItemMedia variant="box">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>
          {name}
          {badges.map((b) => (
            <Badge key={b.label} variant={tones[b.tone ?? "muted"]}>
              {b.label}
            </Badge>
          ))}
        </ItemTitle>
        {description ? <ItemDescription className="line-clamp-1 text-foreground/80">{description}</ItemDescription> : null}
        <ItemDescription className="text-xs">{detail}</ItemDescription>
      </ItemContent>
      <ItemActions>{action}</ItemActions>
    </Card>
  )
}

/** Download em andamento: o carregamento, a barra fina e a porcentagem, em uma linha só, na mesma largura dos botões. */
export function Baixando({ valor, nome }: { valor: number; nome: string }) {
  return (
    <div className={`flex items-center gap-2 ${ACAO_LARGURA}`}>
      <Spinner className="size-4 shrink-0" />
      <Progress value={valor} size="thin" className="min-w-0 flex-1" aria-label={`Baixando ${nome}`} />
      <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">{valor}%</span>
    </div>
  )
}
