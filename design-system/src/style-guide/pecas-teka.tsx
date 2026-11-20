import { IconCheck, IconCube, IconDownload } from "@tabler/icons-react"

import { Fala, Palavras, Pontos } from "@/components/conversa"
import { LogoClaude, LogoGemini, LogoOllama, LogoOpenai } from "@/components/marcas"
import { ACAO_LARGURA, ModelRow } from "@/components/model-row"
import { OnboardingFrame } from "@/components/onboarding-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

function Demo({ titulo, nota, children }: { titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <b className="text-sm">{titulo}</b>
          {nota ? <span className="text-xs text-muted-foreground">{nota}</span> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

/** As peças que o TekaFlow criou ou variou além do shadcn: logos de marca, linha de modelo, moldura do onboarding, peças da conversa e as variantes novas. */
export function PecasTeka() {
  return (
    <div className="flex flex-col gap-6">
      <Demo titulo="Selos" nota="Variantes de estado além das do shadcn: success, warning, soft e muted.">
        <div className="flex flex-wrap gap-2">
          <Badge>Selecionado</Badge>
          <Badge variant="success"><IconCheck /> Concedido</Badge>
          <Badge variant="soft">Recomendado</Badge>
          <Badge variant="warning">Mais pesado</Badge>
          <Badge variant="muted">Mais leve</Badge>
          <Badge variant="secondary">Pendente</Badge>
          <Badge variant="outline">Opcional</Badge>
        </div>
      </Demo>

      <Demo titulo="Cartão" nota="Variantes: default, interactive (hover na borda) e selected (contorno na cor da marca). Margem interna: none, sm, md e lg.">
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md"><span className="text-sm">default, md</span></Card>
          <Card variant="interactive" padding="md"><span className="text-sm">interactive, md</span></Card>
          <Card variant="selected" padding="md"><span className="text-sm">selected, md</span></Card>
        </div>
      </Demo>

      <Demo titulo="Progresso" nota="O tamanho thin tem 4 px e serve para download e nível de áudio.">
        <div className="flex flex-col gap-3">
          <Progress value={60} aria-label="Progresso padrão" />
          <Progress value={60} size="thin" aria-label="Progresso fino" />
        </div>
      </Demo>

      <Demo titulo="Logos de marca" nota="Conjunto aberto Simple Icons, em uma cor só: seguem a cor do texto. Sem logo próprio, o ícone genérico é o cubo.">
        <div className="flex flex-wrap items-center gap-6">
          <LogoOpenai className="size-6" /><LogoClaude className="size-6" /><LogoGemini className="size-6" /><LogoOllama className="size-6" /><IconCube className="size-6" />
        </div>
      </Demo>

      <Demo titulo="Linha de modelo" nota="Ícone numa caixa neutra, nome com selos, descrição, dados e a ação à direita. Todas as ações têm a mesma largura. Selecionado ganha contorno e fundo suaves.">
        <div className="flex flex-col gap-2">
          <ModelRow icon={<IconCube />} name="Whisper Small" badges={[{ label: "Mais leve" }]} description="Da OpenAI. Leve, roda em qualquer computador." detail="99 idiomas · 270 MB" action={<Button variant="outline" className={ACAO_LARGURA}><IconDownload /> Baixar</Button>} />
          <ModelRow icon={<IconCube />} name="Whisper Large v3" badges={[{ label: "Mais preciso", tone: "primary" }, { label: "Mais pesado", tone: "warning" }]} description="Da OpenAI. O que mais acerta em português, e o mais pesado." detail="99 idiomas · 1,67 GB" selected action={<Badge className={ACAO_LARGURA}><IconCheck /> Em uso</Badge>} />
        </div>
      </Demo>

      <Demo titulo="Moldura do onboarding" nota="Título numerado, conteúdo com rolagem e rodapé fixo com Voltar, progresso e Continuar. A animação de entrada só mexe no conteúdo.">
        <div className="h-72 overflow-hidden rounded-xl border">
          <OnboardingFrame step={2} title="Título da etapa" description="Uma frase que explica a etapa." onBack={() => {}} onNext={() => {}}>
            <div className="h-10 rounded-lg bg-muted" />
          </OnboardingFrame>
        </div>
      </Demo>

      <Demo titulo="Peças da conversa" nota="Barrinhas de voz (alguém falando), pontinhos (a IA pensando) e o texto que se forma palavra por palavra. Aqui estão paradas; na tela 1 e no Contexto o GSAP as anima.">
        <div className="flex flex-wrap items-center gap-8">
          <Fala classe="" />
          <Pontos classe="" />
          <span className="text-sm [&_.palavra]:opacity-100"><Palavras texto="O texto se forma palavra por palavra." /></span>
        </div>
      </Demo>

      <Demo titulo="Janela de conexão e painel lateral" nota="Janela para um passo curto (login, chave). O painel lateral serve para um passo mais longo.">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Abrir janela</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Entrar com o ChatGPT</DialogTitle>
                <DialogDescription>Vamos abrir o navegador para você entrar com a sua conta.</DialogDescription>
              </DialogHeader>
              <DialogFooter><Button variant="ghost">Cancelar</Button><Button>Abrir o login</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline">Abrir painel</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Painel lateral</SheetTitle>
                <SheetDescription>Conteúdo que precisa de mais espaço que uma janela.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </Demo>

      <Demo titulo="Campo de texto longo">
        <Textarea placeholder="Escreva aqui" aria-label="Texto longo" />
      </Demo>
    </div>
  )
}
