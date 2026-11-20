import { useEffect, useId, useRef } from "react"

import { cn } from "@/lib/utils"
import { CABECA_GATO, criarGato, type ControleGato, type EstadoGato, type OlharGato, type OpcoesGato } from "@/lib/gato-animacao"

type GatoAnimadoProps = {
  /** O que o gato está fazendo. Padrão: idle. */
  estado?: EstadoGato
  /** Para onde ele olha, de -1 a 1 em cada eixo (x positivo é para a direita, y negativo é para cima). Sem valor, cada estado escolhe o seu olhar. */
  olhar?: OlharGato
  /** Boca do gato quieto: padrão três pontos; `[1, 1.7, 1]` é a boca da logo. */
  bocaRepouso?: OpcoesGato["bocaRepouso"]
  /** Olhos do gato quieto. Padrão: contente (arcos). */
  olhosPadrao?: OpcoesGato["olhosPadrao"]
  /** Parado no repouso: sem piscar nem respirar. Só se mexe quando fala. */
  parado?: boolean
  /** Pensando com os olhos contentes. */
  pensandoContente?: boolean
  /** Cada vez que este número muda, o gato dá a piscada longa (olhos abertos por um tempo). */
  espiarSinal?: number
  className?: string
}

/**
 * O gato do TekaFlow, sem o quadrado, com o rosto vazado. Pega a cor do texto (`currentColor`),
 * então `text-primary` pinta de limão e `text-foreground` de branco ou grafite.
 * Respeita "reduzir movimento": os estados trocam o rosto, mas nada se mexe sozinho.
 */
export function GatoAnimado({ estado = "idle", olhar = null, bocaRepouso, espiarSinal = 0, olhosPadrao, parado, className }: GatoAnimadoProps) {
  const ref = useRef<SVGSVGElement>(null)
  const controle = useRef<ControleGato | null>(null)
  const id = useId().replace(/:/g, "")

  useEffect(() => {
    if (!ref.current) return
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    controle.current = criarGato(ref.current, reduzir, { bocaRepouso, olhosPadrao, parado })
    return () => controle.current?.destruir()
    // a boca de repouso só vale na criação
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    controle.current?.ir(estado)
  }, [estado])

  useEffect(() => {
    if (espiarSinal) controle.current?.espiar()
  }, [espiarSinal])

  useEffect(() => {
    controle.current?.olhar(olhar)
  }, [olhar])

  return (
    <svg ref={ref} viewBox="3 2.9 10 10" role="img" aria-label="Gato do TekaFlow" className={cn("size-40 text-primary", className)}>
      <defs>
        <mask id={`gato-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
          <rect width="16" height="16" fill="#000" />
          <g transform="translate(0 .25)">
            <path d={CABECA_GATO} fill="#fff" stroke="#fff" strokeWidth=".5" strokeLinejoin="round" />
            <path d="M4.95 5.8L5.05 4.8L6.15 5.4Z" fill="#000" stroke="#000" strokeWidth=".25" strokeLinejoin="round" />
            <path d="M11.05 5.8L10.95 4.8L9.85 5.4Z" fill="#000" stroke="#000" strokeWidth=".25" strokeLinejoin="round" />
            <rect data-gato="oE" fill="#000" />
            <rect data-gato="oD" fill="#000" />
            <path data-gato="aE" fill="none" stroke="#000" strokeWidth=".55" strokeLinecap="round" />
            <path data-gato="aD" fill="none" stroke="#000" strokeWidth=".55" strokeLinecap="round" />
            <rect data-gato="b0" fill="#000" />
            <rect data-gato="b1" fill="#000" />
            <rect data-gato="b2" fill="#000" />
          </g>
        </mask>
      </defs>
      <g data-gato="corpo">
        <rect width="16" height="16" fill="currentColor" mask={`url(#gato-${id})`} />
      </g>
    </svg>
  )
}
