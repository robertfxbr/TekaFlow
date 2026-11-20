import { useCallback, useEffect, useState } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type Estado =
  | { fase: "fechado" }
  | { fase: "verificando" }
  | { fase: "atual"; versao: string }
  | { fase: "nova"; versao: string; podeInstalar: boolean; pagina?: string; notas?: string }
  | { fase: "baixando"; versao: string }
  | { fase: "pronta"; versao: string }
  | { fase: "erro"; texto: string }

/** Atualização do app: confere a versão nova na abertura (sem fazer barulho se não houver) e quando a pessoa pede. */
export function useAtualizacao() {
  const [estado, setEstado] = useState<Estado>({ fase: "fechado" })

  const verificar = useCallback(async (aPedido: boolean) => {
    const api = window.api
    if (!api) { if (aPedido) setEstado({ fase: "erro", texto: "A atualização só funciona no aplicativo." }); return }
    if (aPedido) setEstado({ fase: "verificando" })
    const r = await api.verificarAtualizacao().catch(() => null)
    if (!r?.ok) { if (aPedido) setEstado({ fase: "erro", texto: r?.erro ?? "Não consegui verificar agora." }); return }
    if (r.nova && r.versao) setEstado({ fase: "nova", versao: r.versao, podeInstalar: Boolean(r.podeInstalar), pagina: r.pagina, notas: r.notas })
    else if (aPedido) setEstado({ fase: "atual", versao: r.atual ?? "" })
  }, [])

  // Na abertura, confere em silêncio
  useEffect(() => { const t = window.setTimeout(() => void verificar(false), 4000); return () => window.clearTimeout(t) }, [verificar])

  const baixar = async () => {
    if (estado.fase !== "nova") return
    const versao = estado.versao
    setEstado({ fase: "baixando", versao })
    const r = await window.api!.baixarAtualizacao().catch(() => null)
    setEstado(r?.ok ? { fase: "pronta", versao } : { fase: "erro", texto: r?.erro ?? "O download falhou. Tente de novo." })
  }

  const fechar = () => setEstado({ fase: "fechado" })
  const aberto = estado.fase !== "fechado"

  const dialogo = (
    <AlertDialog open={aberto} onOpenChange={(a) => !a && estado.fase !== "baixando" && fechar()}>
      <AlertDialogContent>
        {estado.fase === "verificando" ? (
          <AlertDialogHeader><AlertDialogTitle>Verificando</AlertDialogTitle><AlertDialogDescription>Procurando uma versão nova.</AlertDialogDescription></AlertDialogHeader>
        ) : estado.fase === "atual" ? (
          <>
            <AlertDialogHeader><AlertDialogTitle>Você está na versão mais nova</AlertDialogTitle><AlertDialogDescription>TekaFlow {estado.versao}.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogAction onClick={fechar}>Fechar</AlertDialogAction></AlertDialogFooter>
          </>
        ) : estado.fase === "nova" ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Versão {estado.versao} disponível</AlertDialogTitle>
              <AlertDialogDescription>{estado.podeInstalar ? "O TekaFlow baixa a atualização e reinicia. Suas reuniões e configurações continuam como estão." : "Esta versão precisa ser baixada pela página, porque muda mais do que o app consegue trocar sozinho."}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={fechar}>Depois</AlertDialogCancel>
              {estado.podeInstalar ? <AlertDialogAction onClick={(e) => { e.preventDefault(); void baixar() }}>Baixar e reiniciar</AlertDialogAction> : <AlertDialogAction onClick={() => { void window.api?.abrirPaginaDaVersao(estado.pagina ?? ""); fechar() }}>Abrir a página</AlertDialogAction>}
            </AlertDialogFooter>
          </>
        ) : estado.fase === "baixando" ? (
          <AlertDialogHeader><AlertDialogTitle>Baixando a versão {estado.versao}</AlertDialogTitle><AlertDialogDescription>Não feche o app.</AlertDialogDescription></AlertDialogHeader>
        ) : estado.fase === "pronta" ? (
          <>
            <AlertDialogHeader><AlertDialogTitle>Versão {estado.versao} pronta</AlertDialogTitle><AlertDialogDescription>Reinicie para começar a usar. Reuniões abertas são salvas antes.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel onClick={fechar}>Depois</AlertDialogCancel><AlertDialogAction onClick={() => void window.api?.reiniciarParaAtualizar()}>Reiniciar agora</AlertDialogAction></AlertDialogFooter>
          </>
        ) : estado.fase === "erro" ? (
          <>
            <AlertDialogHeader><AlertDialogTitle>Não deu para atualizar</AlertDialogTitle><AlertDialogDescription>{estado.texto}</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogAction onClick={fechar}>Entendi</AlertDialogAction></AlertDialogFooter>
          </>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  )

  return { verificar, dialogo }
}
