import { IconClock, IconPlayerPlay } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

/** Estado vazio do Início. Versão provisória (opção A), até o Carlos escolher entre as três. */
export function InicioVazio({ onIniciar }: { onIniciar: () => void }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 p-8">
      <h1 className="font-heading text-2xl font-medium">Início</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <b className="font-heading text-lg font-medium">Nada por aqui ainda</b>
        <p className="max-w-[42ch] text-sm text-muted-foreground">Quando você fizer a sua primeira sessão, ela aparece aqui, com o resumo do que foi dito.</p>
        <Button onClick={onIniciar}><IconPlayerPlay /> Iniciar uma sessão</Button>
      </div>
    </div>
  )
}

/** Estado vazio de Sessões. Versão provisória (opção A). */
export function SessoesVazio() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 p-8">
      <h1 className="font-heading text-2xl font-medium">Sessões</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <IconClock className="size-10 text-primary" />
        <b className="font-heading text-lg font-medium">Nenhuma sessão ainda</b>
        <p className="max-w-[42ch] text-sm text-muted-foreground">As sessões que você fizer ficam guardadas aqui, para rever depois.</p>
      </div>
    </div>
  )
}
