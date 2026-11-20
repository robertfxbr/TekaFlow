import type { Grupo, Totais } from "@/prototipo/telas/inicio"
import type { Sessoes } from "./api"

const MIN = 60 * 1000

const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** "Hoje", "Ontem" ou, antes disso, "Quinta-feira, 12 de Novembro", com dia da semana e mês em maiúscula. */
function rotuloDoDia(ms: number, agora: Date) {
  const dia = new Date(ms)
  const inicioDe = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dif = Math.round((inicioDe(agora) - inicioDe(dia)) / (24 * 60 * MIN))
  if (dif === 0) return "Hoje"
  if (dif === 1) return "Ontem"
  const semana = capitalizar(new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(dia))
  const mes = capitalizar(new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(dia))
  return `${semana}, ${dia.getDate()} de ${mes}`
}

const hora = (ms: number) => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(ms))

/** As sessões do banco viram os grupos por dia da tela inicial. */
export function agruparPorDia(dados: Sessoes, agora = new Date()): Grupo[] {
  const grupos: Grupo[] = []
  for (const s of dados.sessoes) {
    const rotulo = rotuloDoDia(s.inicio, agora)
    const minutos = s.fim ? Math.max(1, Math.round((s.fim - s.inicio) / MIN)) : 0
    const meta = `${hora(s.inicio)} · ${minutos} min · ${s.perguntas} ${s.perguntas === 1 ? "pergunta" : "perguntas"}`
    const reuniao = { titulo: s.titulo, meta, tag: s.tag ?? "Reunião" }
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.dia === rotulo) ultimo.reunioes.push(reuniao)
    else grupos.push({ dia: rotulo, reunioes: [reuniao] })
  }
  return grupos
}

/** "4 h 20" a partir dos minutos totais. */
export function totaisDoPainel(dados: Sessoes): Totais {
  const { sessoes, minutos, respostas } = dados.totais
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return { sessoes: String(sessoes), ouvidas: h > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`, respostas: String(respostas) }
}
