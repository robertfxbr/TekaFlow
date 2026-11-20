import { useEffect, useState } from "react"

const PASSOS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

type Escala = { nome: string; prefixo: string; descricao: string; marcas: Partial<Record<(typeof PASSOS)[number], string>> }

const ESCALAS: Escala[] = [
  {
    nome: "Marca",
    prefixo: "brand",
    descricao: "Do limão da assinatura ao verde escuro. É a cor de ação do produto.",
    marcas: { 300: "Limão", 700: "Verde escuro" },
  },
  {
    nome: "Grafite",
    prefixo: "grafite",
    descricao: "O neutro da marca, com um fundo levemente frio. Não existe preto absoluto.",
    marcas: { 900: "Superfície escura", 950: "Grafite neutro" },
  },
]

/** Lê o valor hexadecimal de cada passo direto do CSS, para a página nunca divergir dos tokens. */
function useHex(prefixo: string) {
  const [valores, setValores] = useState<Record<number, string>>({})
  useEffect(() => {
    const estilo = getComputedStyle(document.documentElement)
    setValores(Object.fromEntries(PASSOS.map((p) => [p, estilo.getPropertyValue(`--${prefixo}-${p}`).trim().toUpperCase()])))
  }, [prefixo])
  return valores
}

function Linha({ escala }: { escala: Escala }) {
  const hex = useHex(escala.prefixo)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <b className="text-sm font-medium">{escala.nome}</b>
        <span className="text-xs text-muted-foreground">{escala.descricao}</span>
      </div>
      <div className="grid grid-cols-11 gap-1">
        {PASSOS.map((p) => (
          <div key={p} className="flex flex-col gap-1">
            <div
              className="h-16 rounded-md border border-border"
              style={{ backgroundColor: `var(--${escala.prefixo}-${p})` }}
              role="img"
              aria-label={`${escala.nome} ${p}`}
            />
            <span className="text-xs font-medium">{p}</span>
            <span className="text-xs text-muted-foreground">{hex[p]}</span>
            {escala.marcas[p] ? <span className="text-xs text-foreground">{escala.marcas[p]}</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

/** As duas escalas da marca, de 50 a 950. */
export function Escalas() {
  return (
    <div className="flex flex-col gap-6">
      {ESCALAS.map((e) => (
        <Linha key={e.prefixo} escala={e} />
      ))}
    </div>
  )
}
