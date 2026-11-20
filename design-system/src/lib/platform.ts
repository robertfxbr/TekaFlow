export type Platform = "mac" | "windows" | "other"

type NavigatorComPlataforma = Navigator & {
  userAgentData?: { platform?: string }
}

/** Mac, Windows ou outro. É o único lugar que olha o sistema operacional. */
export function getPlatform(): Platform {
  const nav = navigator as NavigatorComPlataforma
  const plataforma = (nav.userAgentData?.platform ?? nav.platform ?? "").toLowerCase()

  if (plataforma.includes("mac")) return "mac"
  if (plataforma.includes("win")) return "windows"
  return "other"
}

/** Teclas de um atalho com a tecla de comando do sistema: ⌘ no Mac, Ctrl no Windows. */
export function shortcutKeys(key: string): string[] {
  return getPlatform() === "mac" ? ["⌘", key] : ["Ctrl", key]
}
