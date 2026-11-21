import { useEffect, useState } from "react"

import { Modais } from "@/prototipo/modais"
import { PrototipoApp } from "@/prototipo-app/prototipo-app"
import { Prototipo } from "@/prototipo/prototipo"
import { StyleGuide } from "@/style-guide/style-guide"

/** Duas páginas: o Style Guide e, em #/prototipo, o protótipo clicável. */
export function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const aoMudar = () => setHash(window.location.hash)
    window.addEventListener("hashchange", aoMudar)
    return () => window.removeEventListener("hashchange", aoMudar)
  }, [])
  if (hash === "#/modais") return <Modais />
  if (hash === "#/app") return <PrototipoApp />
  if (hash === "#/reuniao") return <PrototipoApp reuniao />
  return hash === "#/prototipo" ? <Prototipo /> : <StyleGuide />
}

export default App
