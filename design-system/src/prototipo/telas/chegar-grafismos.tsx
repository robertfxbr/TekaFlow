import { useEffect, useRef, useState } from "react"

import gato from "@/assets/marca/gato-fundo-escuro.svg"
import palavra from "@/assets/marca/palavra-branco.svg?raw"
import { GatoAnimado } from "@/components/gato-animado"
import { cn } from "@/lib/utils"

/** Cores das ondas, as da marca: limão, azul céu e a cor de superfície (onde elas somem). */
const LIMAO = "#C5EF6B"
const AZUL_CEU = "#5BC0FF"
const SUPERFICIE = "#25262A"

function useReduzido() {
  const [reduzido] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  return reduzido
}

const mistura = (a: number, b: number, k: number) => a + (b - a) * k
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const corMisturada = (a: string, b: string, k: number) => {
  const [ra, ga, ba] = hex(a)
  const [rb, gb, bb] = hex(b)
  return `rgb(${Math.round(mistura(ra, rb, k))} ${Math.round(mistura(ga, gb, k))} ${Math.round(mistura(ba, bb, k))})`
}

const ANEIS = 6
const CICLO_LENTO = 16 // segundos por volta, no repouso (metade da velocidade de antes)
const CICLO_RAPIDO = 5.4 // segundos por volta, quando o gato fala (50% mais rápido que antes)
const FORCA_REPOUSO = 0.5 // metade da opacidade de antes
const FORCA_FALA = 1.5 // 50% a mais de opacidade que antes

/**
 * Ondas em quadradinho (o formato do ícone) que saem do ponto central e perdem a cor. Quem usa põe o gato no centro.
 * No repouso, ficam mais lentas e mais fracas. Com `rapido` (o gato falando), ganham velocidade e opacidade, com um fade curto e sem pular.
 */
export function OndasQuadradas({ className, rapido = false }: { className?: string; rapido?: boolean }) {
  const reduzido = useReduzido()
  const aneis = useRef<(SVGRectElement | null)[]>([])
  const rapidoRef = useRef(rapido)

  useEffect(() => {
    rapidoRef.current = rapido
  }, [rapido])

  useEffect(() => {
    if (reduzido) return
    let fase = 0
    let vel = 1 / CICLO_LENTO
    let forca = FORCA_REPOUSO
    let antes = performance.now()
    let raf = 0
    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - antes) / 1000)
      antes = agora
      vel += ((rapidoRef.current ? 1 / CICLO_RAPIDO : 1 / CICLO_LENTO) - vel) * (1 - Math.exp(-2.5 * dt))
      forca += ((rapidoRef.current ? FORCA_FALA : FORCA_REPOUSO) - forca) * (1 - Math.exp(-7 * dt)) // fade rápido, em cerca de meio segundo
      fase += vel * dt
      aneis.current.forEach((el, i) => {
        if (!el) return
        const p = (fase + i / ANEIS) % 1
        const opacidade = p < 0.1 ? mistura(0, 0.09, p / 0.1) : p < 0.55 ? mistura(0.09, 0.05, (p - 0.1) / 0.45) : mistura(0.05, 0, (p - 0.55) / 0.45)
        const cor = p < 0.25 ? LIMAO : p < 0.6 ? corMisturada(LIMAO, AZUL_CEU, (p - 0.25) / 0.35) : corMisturada(AZUL_CEU, SUPERFICIE, (p - 0.6) / 0.4)
        el.setAttribute("transform", `scale(${mistura(1, 9, p).toFixed(3)})`)
        el.setAttribute("opacity", (opacidade * forca).toFixed(4))
        el.setAttribute("stroke", cor)
        el.setAttribute("stroke-width", (p < 0.5 ? mistura(2.5, 1.5, p / 0.5) : mistura(1.5, 0.75, (p - 0.5) / 0.5)).toFixed(2))
      })
      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)
    return () => cancelAnimationFrame(raf)
  }, [reduzido])

  return (
    <svg viewBox="-300 -300 600 600" className={className} aria-hidden>
      {Array.from({ length: ANEIS }, (_, i) =>
        reduzido ? (
          <rect key={i} x={-60 * (1.6 + i * 0.7)} y={-60 * (1.6 + i * 0.7)} width={120 * (1.6 + i * 0.7)} height={120 * (1.6 + i * 0.7)} rx={34 * (1.6 + i * 0.7)} fill="none" stroke={i < 2 ? LIMAO : AZUL_CEU} strokeWidth={1} opacity={Math.max(0.008, 0.04 - i * 0.006)} />
        ) : (
          <rect key={i} ref={(el) => { aneis.current[i] = el }} x={-60} y={-60} width={120} height={120} rx={34} fill="none" stroke={LIMAO} strokeWidth={2.5} vectorEffect="non-scaling-stroke" opacity={0} />
        ),
      )}
    </svg>
  )
}

/** Adesivo de estado: pílula com contorno branco, sem sombra, levemente inclinada. */
export function Adesivo({ children, className, avatar }: { children: React.ReactNode; className?: string; avatar?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border-[3px] border-white px-4 py-1.5 font-heading text-base font-semibold whitespace-nowrap", avatar && "pl-1.5", className)}>
      {avatar ? (
        <span className="flex size-6 items-center justify-center rounded-full bg-[#1A1B1E]"><img src={gato} alt="" className="size-4" /></span>
      ) : null}
      {children}
    </span>
  )
}

/** A logo (gato sem o quadrado e a palavra), com o gato animado e as ondas saindo dele. O gato fala enquanto a resposta é escrita. */
export function LogoGatoAnimado({ falando = false }: { falando?: boolean }) {
  const reduzido = useReduzido()
  return (
    <div className="relative flex items-center gap-2.5 self-start" role="img" aria-label="TekaFlow">
      <OndasQuadradas rapido={!reduzido && falando} className="pointer-events-none absolute top-5 left-5 size-56 -translate-x-1/2 -translate-y-1/2 overflow-visible" />
      <GatoAnimado estado={!reduzido && falando ? "falando" : "idle"} bocaRepouso={[1, 1.7, 1]} className="relative size-10 text-primary" />
      <div className="relative h-[23px] text-foreground [&_svg]:h-full [&_svg]:w-auto" dangerouslySetInnerHTML={{ __html: palavra.replace(/#FFFFFF/gi, "currentColor") }} aria-hidden />
    </div>
  )
}
