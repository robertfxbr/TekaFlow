import type { ReactNode } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlatform } from "@/lib/platform"
import { Janela } from "./janela"
import { NavegacaoContext, SistemaContext, type Sistema } from "./contexto"

/** O sistema do protótipo é o do computador de quem abre. O Mac é o padrão. */
export const SISTEMA: Sistema = getPlatform() === "windows" ? "windows" : "mac"

/**
 * Moldura dos dois protótipos. Em cima, a escolha do fluxo (onboarding ou app); no meio, a janela do app; embaixo, os controles de cada fluxo.
 */
export function LayoutProto({ fluxo, titulo, navegacao, controles, children }: {
  fluxo: "onboarding" | "app" | "reuniao"
  titulo: string
  navegacao: { voltar: () => void; avancar: () => void }
  controles: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-8">
      <Tabs value={fluxo} onValueChange={(v) => { window.location.hash = v === "app" ? "#/app" : v === "reuniao" ? "#/reuniao" : "#/prototipo" }}>
        <TabsList aria-label="Fluxo do protótipo">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="reuniao">Em reunião</TabsTrigger>
        </TabsList>
      </Tabs>

      <SistemaContext.Provider value={SISTEMA}>
        <NavegacaoContext.Provider value={navegacao}>
          <Janela plataforma={SISTEMA} titulo={titulo}>{children}</Janela>
        </NavegacaoContext.Provider>
      </SistemaContext.Provider>

      <div className="flex flex-wrap items-center justify-center gap-4">{controles}</div>
    </div>
  )
}
