import type { ReactNode } from "react"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useNavegacao } from "@/prototipo/contexto"

type OnboardingFrameProps = {
  step: number
  total?: number
  title: string
  description: string
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  nextLabel?: string
  skipLabel?: string
}

/** Moldura do onboarding: progresso em segmentos, título numerado, conteúdo e rodapé de ponta a ponta. */
export function OnboardingFrame({
  step,
  total = 4,
  title,
  description,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continuar",
  skipLabel = "Pular",
}: OnboardingFrameProps) {
  const { irPara } = useNavegacao()
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 animate-in flex-col gap-8 overflow-y-auto px-10 pt-8 fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-medium">{step}. {title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>

        <div className="flex flex-col gap-6 pb-6">{children}</div>
      </div>

      <Separator />
      <footer className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-10 py-4">
        <div className="flex">
          <Button variant="ghost" onClick={onBack} disabled={!onBack}>
            Voltar
          </Button>
        </div>
        <div
          className="flex w-32 flex-col items-center gap-2"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label={`Etapa ${step} de ${total}`}
        >
          <div className="flex gap-2">
            {Array.from({ length: total }, (_, i) => (
              irPara ? (
                // A etapa 1 não tem moldura, então o ponto i leva à etapa i + 2.
                <button key={i} type="button" aria-label={`Ir para a etapa ${i + 2}`} onClick={() => irPara(i + 2)} className="group flex h-4 cursor-pointer items-center outline-none">
                  <span className={cn("h-1 w-4 rounded-full transition-colors group-hover:bg-primary/70 group-focus-visible:ring-2 group-focus-visible:ring-ring", i < step ? "bg-primary" : "bg-muted")} />
                </button>
              ) : (
                <span key={i} className={cn("h-1 w-4 rounded-full", i < step ? "bg-primary" : "bg-muted")} />
              )
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {step} de {total}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          {onSkip ? (
            <Button variant="ghost" onClick={onSkip}>
              {skipLabel}
            </Button>
          ) : null}
          <Button onClick={onNext}>
            {nextLabel} <IconArrowRight />
          </Button>
        </div>
      </footer>
    </div>
  )
}
