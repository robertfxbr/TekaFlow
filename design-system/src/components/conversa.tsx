/** Peças da conversa animada, usadas na tela 1 e no chat do Contexto. Quem anima é uma linha do tempo do GSAP, que procura as classes `palavra`, `ponto` e `fala-barra`. */

/** Texto que se forma palavra por palavra. Cada palavra nasce invisível e a animação a revela. */
export function Palavras({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(" ").map((p, i) => (
        <span key={i} className="palavra inline-block whitespace-pre opacity-0">{p} </span>
      ))}
    </>
  )
}

/** Três pontinhos de "pensando". */
export function Pontos({ classe }: { classe: string }) {
  return (
    <span className={`${classe} flex h-5 items-center gap-1`} role="status" aria-label="Escrevendo">
      {[0, 1, 2].map((i) => <span key={i} className="ponto size-1.5 rounded-full bg-current" />)}
    </span>
  )
}

/** Cinco barrinhas de voz: alguém está falando. */
export function Fala({ classe }: { classe: string }) {
  return (
    <span className={`${classe} flex h-5 items-center gap-1`} role="status" aria-label="Falando">
      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="fala-barra h-5 w-1 origin-center rounded-full bg-current" />)}
    </span>
  )
}
