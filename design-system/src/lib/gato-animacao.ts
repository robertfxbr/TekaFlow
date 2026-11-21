/**
 * Motor de animação do gato do TekaFlow. Não depende de React: recebe o <svg> montado pelo
 * componente `GatoAnimado` e muda só os atributos dos olhos, da boca e do corpo.
 *
 * Estados (os mesmos do playground em `marca/playground-gato.html`):
 *  - idle:      olhos Contente (arcos), que seguem o mouse. De tempos em tempos pisca, abre os olhos e olha em volta, pisca duas vezes e volta a sorrir. Boca quieta (três pontos)
 *  - falando:   olhos Atento (abertos), boca em risquinhos, pisca e mexe um pouco
 *  - lendo:     como falando, com o olhar indo para onde alguém escreve (`olhar`)
 *  - pensando:  o loading padrão do gato ("pontinhos na boca"): os olhos abertos passeiam para cima e para os lados e os três pontinhos da boca crescem em onda. Serve para pensando e para escrevendo.
 *
 * A troca entre Contente e Atento acontece numa piscada.
 */

/** Contorno da cabeça com as orelhas, em coordenadas da grade 16 por 16. Trocar aqui quando a forma da cabeça for decidida. */
export const CABECA_GATO = "M4 6L4.5 3.5L7 5H9L11.5 3.5L12 6V10A2 2 0 0 1 10 12H6A2 2 0 0 1 4 10Z"

export type EstadoGato = "idle" | "falando" | "lendo" | "pensando" | "escrevendo"
export type OlharGato = { x: number; y: number } | null

type Olhos = "contente" | "atento"

const SW = 0.55 // traço dos olhos e da boca, igual ao da logo
const EY = 7.7 // altura dos olhos, em coordenadas da cabeça
const EXC: [number, number] = [6, 10] // centros dos olhos Contente (arcos), como na logo
const EXA: [number, number] = [6.45, 9.55] // centros dos olhos Atento, mais juntos

/** Tempos e intensidades em um só lugar, para ajustar sem mexer no motor. */
export const GATO_TEMPOS = {
  piscadaMs: 110,
  trocaDeOlhosMs: 120,
  intervaloMs: [1100, 2900] as [number, number],
  falaTrocaMs: [90, 200] as [number, number],
}

type Valores = {
  lx: number
  ly: number
  aberto: number
  atento: number
  boca: number
  b: [number, number, number]
  ox: number
  oy: number
  rot: number
}

const suave = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))
const rr = Math.random

export type ControleGato = {
  ir: (estado: EstadoGato) => void
  olhar: (alvo: OlharGato) => void
  piscar: () => void
  espiar: (ms?: number) => void
  destruir: () => void
}

export type OpcoesGato = {
  /** Alturas das três barras da boca quando o gato está quieto. Padrão: três pontos. A logo usa [1, 1.7, 1]. */
  bocaRepouso?: [number, number, number]
  /** Olhos do gato quieto: "contente" (arcos, padrão) ou "atento" (abertos). */
  olhosPadrao?: "contente" | "atento"
  /** Pensando com os olhos contentes (arcos), em vez dos olhos abertos. */
  pensandoContente?: boolean
  /** Parado: no repouso (idle) o gato não pisca, não passeia o olhar e não respira. Só se mexe quando fala. */
  parado?: boolean
}

export function criarGato(svg: SVGSVGElement, reduzirMovimento: boolean, opcoes: OpcoesGato = {}): ControleGato {
  const repouso: [number, number, number] = opcoes.bocaRepouso ?? [SW, SW, SW]
  const el = (nome: string) => svg.querySelector<SVGElement>(`[data-gato="${nome}"]`)!
  const oE = el("oE"), oD = el("oD"), aE = el("aE"), aD = el("aD")
  const bocas = [el("b0"), el("b1"), el("b2")]
  const corpo = el("corpo")

  const v: Valores = { lx: 0, ly: 0, aberto: 1, atento: 0, boca: 1, b: [...repouso], ox: 0, oy: 0, rot: 0 }
  const alvo: Valores = { ...v, b: [...repouso] }
  let estado: EstadoGato = "idle"
  let olhosAtual: Olhos = "contente"
  let olharManual: OlharGato = null
  let ocupado = false
  let proxFala = 0
  let raf = 0
  let vivo = true
  const timers = new Set<number>()
  const depois = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id)
      if (vivo) fn()
    }, ms)
    timers.add(id)
  }

  const set = (e: SVGElement, o: Record<string, number | string>) => {
    for (const k in o) e.setAttribute(k, String(o[k]))
  }

  function desenhar() {
    const dx = v.lx * 0.5
    const dy = v.ly * 0.4
    const w = 0.6 + 0.5 * (1 - v.aberto)
    const h = 1.5 * v.aberto + 0.5 * (1 - v.aberto)
    ;[[oE, EXA[0]], [oD, EXA[1]]].forEach(([e, cx]) =>
      set(e as SVGElement, { x: (cx as number) + dx - w / 2, y: EY + dy - h / 2, width: w, height: h, rx: Math.min(w, h) / 2, opacity: v.atento }),
    )
    ;[[aE, EXC[0]], [aD, EXC[1]]].forEach(([e, cx]) => {
      const x = (cx as number) + dx * 0.8
      const yb = EY + 0.3 + dy * 0.4
      const yc = yb - 1.2 * v.aberto // piscar achata o arco num traço
      set(e as SVGElement, { d: `M${x - 0.8} ${yb}Q${x} ${yc} ${x + 0.8} ${yb}`, opacity: 1 - v.atento })
    })
    bocas.forEach((b, i) => {
      const x = 7 + i
      set(b, { x: x - SW / 2, y: 10 - v.b[i] / 2, width: SW, height: v.b[i], rx: SW / 2, opacity: v.boca })
    })
    corpo.setAttribute("transform", `translate(${v.ox.toFixed(3)} ${v.oy.toFixed(3)}) rotate(${v.rot.toFixed(2)} 8 8)`)
  }

  function bocaAtual(): "quieta" | "falando" | "pensando" {
    return { idle: "quieta", falando: "falando", lendo: "falando", pensando: "pensando", escrevendo: "pensando" }[estado] as "quieta" | "falando" | "pensando"
  }
  const carregando = () => estado === "pensando" || estado === "escrevendo"

  function quadro(agora: number) {
    if (!vivo) return
    const dt = Math.min(0.05, (agora - ultimo) / 1000)
    ultimo = agora
    const T = agora / 1000
    if (estado === "idle" && !opcoes.parado && !olharManual && !reduzirMovimento && ponteiro) {
      // idle: os olhos seguem o mouse, com mais força quanto mais longe ele está (até um limite)
      const r = svg.getBoundingClientRect()
      const dx = ponteiro.x - (r.left + r.width / 2)
      const dy = ponteiro.y - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const forca = Math.min(1, dist / 240)
      alvoMouse.lx = suave(alvoMouse.lx, (dx / dist) * forca, 1.6, dt) // atraso: o alvo também chega devagar
      alvoMouse.ly = suave(alvoMouse.ly, (dy / dist) * forca * 0.7, 1.6, dt)
      alvo.lx = alvoMouse.lx
      alvo.ly = alvoMouse.ly
    }
    if (carregando() && !olharManual && !reduzirMovimento) {
      // loading: o olhar passeia devagar para cima e para os lados
      alvo.lx = Math.sin(T * 1.2) * 0.8
      alvo.ly = -0.7 + Math.sin(T * 2) * 0.2
    }
    // no idle os olhos seguem o mouse devagar, com um pouco de atraso; nos outros estados a resposta é rápida
    const seguindo = estado === "idle" && !opcoes.parado && !olharManual
    const velOlhar = seguindo ? 2.2 : 10
    v.lx = suave(v.lx, alvo.lx, velOlhar, dt)
    v.ly = suave(v.ly, alvo.ly, velOlhar, dt)
    v.aberto = suave(v.aberto, alvo.aberto, 34, dt)
    v.atento = suave(v.atento, alvo.atento, 40, dt)
    const mexe = (estado === "falando" || estado === "lendo") && !reduzirMovimento
    // o gato só se mexe (balanço, giro) quando fala ou lê; parado e no loading ele fica estático e só os olhos e a boca mudam
    const k = mexe ? 1 : opcoes.parado || carregando() ? 0 : 0.35
    const ox = reduzirMovimento ? 0 : Math.sin(T * 1.7) * 0.05 * k + (mexe ? Math.sin(T * 6.1) * 0.03 : 0)
    const oy = reduzirMovimento ? 0 : Math.sin(T * 1.3) * 0.04 * k + (mexe ? -Math.abs(Math.sin(T * 5.3)) * 0.05 : 0)
    const rot = reduzirMovimento ? 0 : Math.sin(T * 1.1) * 0.9 * k + (mexe ? Math.sin(T * 4.2) * 0.7 : 0)
    v.ox = suave(v.ox, ox, 12, dt)
    v.oy = suave(v.oy, oy, 12, dt)
    v.rot = suave(v.rot, rot, 12, dt)
    const boca = bocaAtual()
    for (let i = 0; i < 3; i++) v.b[i] = suave(v.b[i], alvo.b[i], boca === "falando" ? 22 : 12, dt)
    if (boca === "falando" && agora > proxFala) {
      alvo.b = [1 + rr() * 0.9, 1.3 + rr() * 1.4, 1 + rr() * 1.1]
      const [a, b] = GATO_TEMPOS.falaTrocaMs
      proxFala = agora + a + rr() * (b - a)
    }
    if (boca === "pensando") alvo.b = [0, 1, 2].map((i) => SW + 0.9 * Math.max(0, Math.sin(T * 5 - i * 1.1))) as [number, number, number]
    desenhar()
    raf = requestAnimationFrame(quadro)
  }
  let ultimo = performance.now()
  let ponteiro: { x: number; y: number } | null = null
  const alvoMouse = { lx: 0, ly: 0 }
  const aoMover = (ev: PointerEvent) => {
    ponteiro = { x: ev.clientX, y: ev.clientY }
  }
  if (!opcoes.parado) window.addEventListener("pointermove", aoMover)

  function piscar(meio?: () => void) {
    if (ocupado) return
    ocupado = true
    alvo.aberto = 0
    depois(() => {
      meio?.()
      alvo.aberto = 1
      depois(() => {
        ocupado = false
      }, 90)
    }, GATO_TEMPOS.piscadaMs)
  }

  function olhosDesejados(): Olhos {
    return (estado === "idle" || (estado === "pensando" && opcoes.pensandoContente)) && !espiando && opcoes.olhosPadrao !== "atento" ? "contente" : "atento"
  }
  let espiando = false
  function aplicarOlhos() {
    const d = olhosDesejados()
    if (d === olhosAtual) return
    const troca = () => {
      olhosAtual = d
      alvo.atento = d === "atento" ? 1 : 0
    }
    if (reduzirMovimento) troca()
    else if (!ocupado) piscar(troca)
    else depois(aplicarOlhos, 160)
  }
  function aplicarBoca() {
    if (bocaAtual() === "quieta") alvo.b = [...repouso]
    proxFala = 0
  }

  // Passeia o olhar e pisca de tempos em tempos. Cada estado tem o seu jeito.
  function laco() {
    if (!reduzirMovimento && !(opcoes.parado && estado === "idle")) {
      if (estado === "idle") {
        // o idle é o ciclo de espiar (ver `cicloIdle`)
      } else if (carregando()) {
        // pensando e escrevendo: olhos abertos, que piscam normalmente de vez em quando, como no lendo
        if (rr() < 0.5) depois(() => piscar(), 400 + rr() * 1200)
      } else if (estado === "falando") {
        if (!olharManual) {
          alvo.lx = (rr() - 0.5) * 0.6
          alvo.ly = (rr() - 0.5) * 0.25
        }
        if (rr() < 0.6) depois(() => piscar(), 300 + rr() * 900)
      } else if (estado === "lendo") {
        if (rr() < 0.5) depois(() => piscar(), 400 + rr() * 1200)
      }
    }
    const [a, b] = GATO_TEMPOS.intervaloMs
    depois(laco, a + rr() * (b - a))
  }

  /**
   * O idle: o gato sorri com os olhos em arco e segue o mouse com os olhos. De tempos em tempos pisca, abre os olhos,
   * pisca duas vezes e volta a sorrir. É a antiga "espiada", agora o jeito normal de ficar parado.
   */
  function cicloIdle() {
    if (!reduzirMovimento && !opcoes.parado && estado === "idle" && !espiando) {
      espiando = true
      aplicarOlhos()
      depois(() => piscar(), 1300)
      depois(() => piscar(), 1800)
      depois(() => {
        espiando = false
        aplicarOlhos()
      }, 3700)
    }
    depois(cicloIdle, 8500 + rr() * 3000)
  }

  function aplicarOlhar() {
    if (olharManual) {
      alvo.lx = olharManual.x
      alvo.ly = olharManual.y
    } else if (estado === "lendo") {
      alvo.lx = 0.6
      alvo.ly = 0.1
    } else if (carregando()) {
      alvo.ly = -0.7
    } else {
      alvo.lx = 0
      alvo.ly = 0
    }
  }

  const controle: ControleGato = {
    ir(novo) {
      estado = novo
      aplicarOlhar()
      aplicarOlhos()
      aplicarBoca()
    },
    olhar(a) {
      olharManual = a
      aplicarOlhar()
    },
    piscar: () => piscar(),
    /** Piscada longa: troca os olhos felizes pelos olhos abertos por um tempo e volta. */
    espiar(ms = 1600) {
      if (espiando) return
      espiando = true
      aplicarOlhos()
      depois(() => {
        espiando = false
        aplicarOlhos()
      }, ms)
    },
    destruir() {
      vivo = false
      window.removeEventListener("pointermove", aoMover)
      cancelAnimationFrame(raf)
      timers.forEach((id) => window.clearTimeout(id))
      timers.clear()
    },
  }

  desenhar()
  if (!opcoes.parado) depois(cicloIdle, 2500)
  laco()
  raf = requestAnimationFrame(quadro)
  return controle
}
