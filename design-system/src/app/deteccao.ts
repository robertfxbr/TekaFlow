/** Duas ideias do projeto original: achar a pergunta na fala dos outros e tirar o eco do microfone. */

const COMECOS = [
  "como", "qual", "quais", "quando", "onde", "por que", "porque", "quanto", "quantos", "quantas", "quem", "o que", "em que", "de que", "para que", "sera que",
  "voce pode", "voce consegue", "voce poderia", "voce ja", "voce tem", "voce conhece", "voce acha", "voce trabalhou",
  "pode me", "poderia me", "consegue me", "queria saber", "gostaria de saber", "me conta", "me conte", "me fala", "me fale", "me explica", "me explique", "me diz", "me diga", "me descreva",
  "fale sobre", "fala sobre", "conte sobre", "fale um pouco", "descreva", "comente sobre", "se apresenta", "se apresente", "apresente-se", "tem alguma", "existe alguma", "costuma",
  "what", "why", "how", "when", "where", "which", "who", "can you", "could you", "would you", "do you", "did you", "are you", "have you", "tell me", "describe", "walk me", "explain",
]

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim()

/** Devolve a pergunta que está no trecho, ou null. */
export function detectarPergunta(texto: string): string | null {
  const bruto = texto.replace(/\s+/g, " ").trim()
  if (bruto.length < 14) return null
  const comInterrogacao = bruto.match(/[^.!?\n]{10,}\?/g)
  if (comInterrogacao?.length) return comInterrogacao.sort((a, b) => b.length - a.length)[0].trim()
  const norm = normalizar(bruto)
  return COMECOS.some((c) => norm.startsWith(c) || norm.includes(` ${c} `)) ? bruto : null
}

const palavras = (t: string) => normalizar(t).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 2)

/** Quanto da fala menor aparece na maior (0 a 1). */
export function parecidas(a: string, b: string): number {
  const wa = palavras(a), wb = palavras(b)
  if (wa.length < 3 || wb.length < 3) return 0
  const [pequena, grande] = wa.length <= wb.length ? [wa, wb] : [wb, wa]
  const sobra = new Map<string, number>()
  for (const w of grande) sobra.set(w, (sobra.get(w) ?? 0) + 1)
  let acertos = 0
  for (const w of pequena) { const n = sobra.get(w) ?? 0; if (n > 0) { acertos++; sobra.set(w, n - 1) } }
  return acertos / pequena.length
}
