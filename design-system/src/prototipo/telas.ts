export type Tela = { id: string; nome: string }

/** As sete telas do onboarding e da tela inicial, na ordem do fluxo. */
export const TELAS: Tela[] = [
  { id: "chegar", nome: "Chegar" },
  { id: "transcricao", nome: "Transcrição" },
  { id: "cerebro", nome: "Cérebro" },
  { id: "permissoes", nome: "Permissões" },
  { id: "testar", nome: "Testar tudo" },
  { id: "contexto", nome: "Contexto" },
  { id: "inicio", nome: "Tela inicial" },
]
