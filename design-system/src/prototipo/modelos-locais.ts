import type { ReactNode } from "react"

export type ModeloLocal = {
  id: string
  nome: string
  badges: { label: string; tone?: "primary" | "muted" | "warning" }[]
  descricao: string
  detalhe: string
}

/**
 * Modelos de linguagem que rodam no computador. Os nomes e tamanhos são da biblioteca do Ollama (tamanho de download da versão padrão),
 * e os idiomas, das páginas dos próprios modelos. Qwen3 não tem versão de 2B nem de 7B: os tamanhos reais são 0.6B, 1.7B, 4B, 8B, 14B, 32B.
 */
export const MODELOS_LOCAIS: ModeloLocal[] = [
  { id: "qwen3-1.7b", nome: "Qwen3 1.7B", badges: [{ label: "Mais leve" }], descricao: "Da Alibaba. O menor da lista, roda em qualquer computador.", detalhe: "Mais de 100 idiomas · 1,4 GB" },
  { id: "llama3.2-3b", nome: "Llama 3.2 3B", badges: [{ label: "Português oficial", tone: "primary" }], descricao: "Da Meta. Tem o português entre os idiomas oficiais.", detalhe: "8 idiomas · contexto de 128 mil · 2 GB" },
  { id: "qwen3-4b", nome: "Qwen3 4B", badges: [{ label: "Equilibrado" }], descricao: "Da Alibaba. Um passo acima do 1.7B, ainda leve.", detalhe: "Mais de 100 idiomas · 2,5 GB" },
  { id: "gemma3-4b", nome: "Gemma 3 4B", badges: [{ label: "Entende imagens", tone: "primary" }], descricao: "Do Google. Lê texto e imagem.", detalhe: "Mais de 140 idiomas · 3,4 GB" },
  { id: "qwen3-8b", nome: "Qwen3 8B", badges: [{ label: "Mais pesado", tone: "warning" }], descricao: "Da Alibaba. O maior da lista, pede mais memória.", detalhe: "Mais de 100 idiomas · 5,2 GB" },
]

export type { ReactNode }
