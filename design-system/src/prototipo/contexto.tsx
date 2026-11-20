import { createContext, useContext } from "react"

export type Sistema = "mac" | "windows"

export const SistemaContext = createContext<Sistema>("mac")
export const useSistema = () => useContext(SistemaContext)

/** Navegação entre telas, entregue por quem monta a casca. */
export type Navegacao = { voltar: () => void; avancar: () => void; /** Vai direto a uma etapa (1 a 6). Só existe no app real. */ irPara?: (etapa: number) => void }
export const NavegacaoContext = createContext<Navegacao>({ voltar: () => {}, avancar: () => {} })
export const useNavegacao = () => useContext(NavegacaoContext)

/** Variantes de uma tela, para testar lado a lado. A casca mostra o seletor quando a tela tem mais de uma. */
export const OpcaoContext = createContext<string>("A")
export const useOpcao = () => useContext(OpcaoContext)

/** No app real, o que ainda é simulado avisa em vez de fingir. Fora do app (protótipo), fica null e a simulação roda. */
export const NaoImplementadoContext = createContext<((o: string) => void) | null>(null)
export const useNaoImplementado = () => useContext(NaoImplementadoContext)
