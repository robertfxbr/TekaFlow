import type { ComponentProps } from "react"

import { OnboardingFrame } from "@/components/onboarding-frame"

/** No onboarding, a tela vem dentro da moldura (título, progresso, voltar e continuar). Em Configurações, vem só o conteúdo. */
export function Envoltorio({ modo, children, ...moldura }: { modo: "onboarding" | "config" } & ComponentProps<typeof OnboardingFrame>) {
  if (modo === "config") return <div className="flex flex-col gap-6">{children}</div>
  return <OnboardingFrame {...moldura}>{children}</OnboardingFrame>
}
