import { useLayoutEffect, useRef, useState } from "react"
import { IconArrowRight, IconFile } from "@tabler/icons-react"
import gsap from "gsap"

import { Fala, Palavras, Pontos } from "@/components/conversa"
import { GatoAnimado } from "@/components/gato-animado"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavegacao } from "../contexto"
import { LogoGatoAnimado } from "./chegar-grafismos"

/** Ruído fino sobre o degradê, para a superfície não parecer chapada. */
const RUIDO =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

const PERGUNTA = "Conta uma situação em que você discordou de uma decisão técnica do time."
const SUGESTAO = "Na migração do checkout, defendi manter a fila até medir a latência. Levei um teste de carga e o time revisou o plano."
const RESPOSTA = "Teve sim. Na migração do checkout eu achava arriscado trocar a fila sem medir antes, então levei um teste de carga pro time. Eles revisaram o plano e a gente entregou sem queda."

/** Tela 1: logo no alto à esquerda, com ondas, e o texto embaixo; à direita, a cena do gato ouvindo; botão no rodapé. */
export function Chegar() {
  const { avancar } = useNavegacao()
  const raiz = useRef<HTMLDivElement>(null)
  const [fala, setFala] = useState(false)
  const [falaIA, setFalaIA] = useState(false)

  useLayoutEffect(() => {
    const el = raiz.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      // Estado final, sem movimento, para quem pede menos animação.
      if (reduzido) {
        gsap.set(q(".palavra"), { display: "inline-block", autoAlpha: 1, y: 0 })
        gsap.set(q(".bolha, .balao-insight, .arquivos-ia"), { autoAlpha: 1, y: 0 })
        gsap.set(q(".pontos"), { display: "none" })
        return
      }

      // Barrinhas de voz de quem fala: cada uma com o seu ritmo, nunca iguais.
      q(".fala-barra").forEach((b, i) => {
        gsap.to(b, {
          scaleY: () => gsap.utils.random(0.2, 1),
          duration: () => gsap.utils.random(0.28, 0.6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          repeatRefresh: true,
          delay: (i % 5) * 0.09,
        })
      })
      // As manchas de cor andam devagar, cada uma no seu caminho.
      q(".mancha").forEach((m) => {
        const mover = () =>
          gsap.to(m, {
            x: gsap.utils.random(-70, 70),
            y: gsap.utils.random(-50, 50),
            scale: gsap.utils.random(0.9, 1.25),
            duration: gsap.utils.random(14, 22),
            ease: "sine.inOut",
            onComplete: mover,
          })
        mover()
      })
      gsap.to(q(".ponto"), { y: -3, opacity: 1, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.12 })

      const subir = { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
      // Começo limpo a cada volta
      tl.set(q(".bolha, .balao-insight"), { autoAlpha: 0, y: 28 })
        .set(q(".palavra"), { display: "none", autoAlpha: 0, y: 8 })
        .set(q(".arquivos-ia"), { display: "none", autoAlpha: 0, y: 10 })
        .set(q(".pontos"), { display: "flex", autoAlpha: 1 })
        .set(q(".texto"), { display: "none" })
        .set(q(".balao-insight"), { display: "none" })
        .set(q(".cabeca-insight"), { autoAlpha: 0 })

      // 1. Eles escrevem a pergunta
      tl.to(q(".bolha-eles"), { ...subir }, 0.6)
        .to({}, { duration: 1.1 })
        .to(q(".pontos-eles"), { autoAlpha: 0, duration: 0.2 })
        .set(q(".pontos-eles"), { display: "none" })
        .set(q(".texto-eles"), { display: "block" })
        .call(() => setFala(true))
        .to(q(".texto-eles .palavra"), { display: "inline-block", autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.075 })
        .call(() => setFala(false))

      // 2. A IA pensa e forma a sugestão dentro do mesmo balão
      tl.set(q(".balao-insight"), { display: "flex" }, "+=0.5")
        .to(q(".balao-insight"), { ...subir, duration: 0.7 })
        .to(q(".cabeca-insight"), { autoAlpha: 1, duration: 0.3 }, "<0.2")
        .to({}, { duration: 1.4 })
        .to(q(".pontos-ia"), { autoAlpha: 0, duration: 0.2 })
        .set(q(".pontos-ia"), { display: "none" })
        .set(q(".texto-ia"), { display: "block" })
        .call(() => { setFala(true); setFalaIA(true) })
        .to(q(".texto-ia .palavra"), { display: "inline-block", autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.07 })
        .call(() => { setFala(false); setFalaIA(false) })
        .set(q(".arquivos-ia"), { display: "flex" }, "+=0.2")
        .to(q(".arquivos-ia"), { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" })

      // 3. A pessoa responde, complementando
      tl.to(q(".bolha-voce"), { ...subir }, "+=0.9")
        .to({}, { duration: 1 })
        .to(q(".pontos-voce"), { autoAlpha: 0, duration: 0.2 })
        .set(q(".pontos-voce"), { display: "none" })
        .set(q(".texto-voce"), { display: "block" })
        .call(() => setFala(true))
        .to(q(".texto-voce .palavra"), { display: "inline-block", autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.07 })
        .call(() => setFala(false))

      // 4. Pausa para ler e recomeça
      tl.to({}, { duration: 9 }).to(q(".bolha"), { autoAlpha: 0, y: -16, duration: 0.7, ease: "power2.in" })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex h-full flex-col" ref={raiz}>
      <div className="grid min-h-0 flex-1 animate-in grid-cols-[1fr_1fr] fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative flex flex-col justify-between overflow-hidden px-10 pt-20 pb-6">
          <LogoGatoAnimado falando={fala} />
          <div className="relative flex flex-col gap-5">
            <h1 className="font-heading text-4xl font-medium text-balance">Fico por aqui, ouvindo com você.</h1>
            <p className="max-w-sm text-muted-foreground">
              O TekaFlow escuta a sua reunião e sussurra uma sugestão quando você precisa. Vamos deixar tudo pronto antes da próxima.
            </p>
          </div>
        </div>

        <div className="relative m-4 overflow-hidden rounded-2xl bg-linear-to-br from-primary/30 via-info/20 to-background">
          <div className="mancha absolute -top-20 -right-12 size-72 rounded-full bg-primary/25 blur-3xl" aria-hidden />
          <div className="mancha absolute -bottom-24 -left-16 size-72 rounded-full bg-info/30 blur-3xl" aria-hidden />
          <div className="mancha absolute top-1/3 left-1/3 size-56 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: RUIDO }} aria-hidden />

          <div className="relative flex h-full flex-col px-8 py-6">
            <div className="flex min-h-0 flex-1 flex-col justify-start gap-3 pt-6" aria-live="polite">
              <div className="bolha bolha-eles flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground">ELES</span>
                <Bubble variant="muted" className="max-w-full">
                  <BubbleContent className="flex flex-col gap-3">
                    <Fala classe="pontos pontos-eles" />
                    <span className="texto texto-eles hidden"><Palavras texto={PERGUNTA} /></span>
                    <Bubble variant="tinted" className="balao-insight max-w-full">
                      <BubbleContent className="flex flex-col gap-1">
                        <span className="cabeca-insight flex items-center gap-1.5 text-xs font-medium">
                          <GatoAnimado estado={falaIA ? "falando" : "idle"} parado bocaRepouso={[1, 1.7, 1]} className="size-3.5 shrink-0 text-primary" /> SUGIRO DIZER
                        </span>
                        <Pontos classe="pontos pontos-ia" />
                        <span className="texto texto-ia hidden"><Palavras texto={SUGESTAO} /></span>
                        <span className="arquivos-ia mt-1 hidden flex-wrap items-center gap-1.5">
                          {["briefing-vaga.md", "historico-projetos.docx"].map((f) => (
                            <span key={f} className="inline-flex h-5 items-center gap-1 rounded-full bg-background/60 px-2 text-xs text-muted-foreground"><IconFile className="size-3" />{f}</span>
                          ))}
                        </span>
                      </BubbleContent>
                    </Bubble>
                  </BubbleContent>
                </Bubble>
              </div>

              <div className="bolha bolha-voce flex flex-col items-end gap-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground">VOCÊ</span>
                <Bubble align="end" className="max-w-[85%]">
                  <BubbleContent>
                    <Fala classe="pontos pontos-voce" />
                    <span className="texto texto-voce hidden"><Palavras texto={RESPOSTA} /></span>
                  </BubbleContent>
                </Bubble>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <footer className="flex items-center justify-end px-10 py-4">
        <Button onClick={avancar}>
          Começar <IconArrowRight />
        </Button>
      </footer>
    </div>
  )
}
