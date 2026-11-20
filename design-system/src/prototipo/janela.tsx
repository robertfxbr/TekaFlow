import type { ReactNode } from "react"
import { IconMinus, IconSquare, IconX } from "@tabler/icons-react"

import type { Platform } from "@/lib/platform"

/** Tamanho fixo da janela do app, igual em todas as telas. */
export const JANELA = { width: 1040, height: 640 }

function ControlesMac() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="size-3 rounded-full bg-destructive" />
      <span className="size-3 rounded-full bg-warning" />
      <span className="size-3 rounded-full bg-success" />
    </div>
  )
}

function ControlesWindows() {
  return (
    <div className="flex items-center gap-4 text-muted-foreground" aria-hidden>
      <IconMinus className="size-4" />
      <IconSquare className="size-4" />
      <IconX className="size-4" />
    </div>
  )
}

/** Moldura da janela do app, com os controles do Mac (à esquerda) ou do Windows (à direita). */
export function Janela({
  plataforma,
  titulo,
  children,
}: {
  plataforma: Exclude<Platform, "other">
  titulo: string
  children: ReactNode
}) {
  const mac = plataforma === "mac"
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border bg-background shadow-lg"
      style={{ width: JANELA.width, height: JANELA.height }}
    >
      <header className="flex h-10 shrink-0 items-center justify-between border-b px-4">
        {mac ? <ControlesMac /> : <span className="text-xs text-muted-foreground">{titulo}</span>}
        {mac ? <span className="text-xs text-muted-foreground">{titulo}</span> : <ControlesWindows />}
        {mac ? <span className="w-12" /> : null}
      </header>
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  )
}
