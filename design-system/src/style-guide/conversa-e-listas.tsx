import {
  IconArrowUp,
  IconChevronUp,
  IconFile,
  IconFolder,
  IconHome,
  IconMicrophone,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Message, MessageContent, MessageHeader } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

function Demo({ titulo, children, largo = false }: { titulo: string; children: React.ReactNode; largo?: boolean }) {
  return (
    <Card className={largo ? "md:col-span-2" : undefined}>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export function ConversaEListas() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Demo titulo="Conversa: balão, mensagem e rolagem sozinha até o fim" largo>
        <MessageScrollerProvider>
          <MessageScroller className="h-80 rounded-lg border border-border">
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent className="gap-4">
                <MessageScrollerItem>
                  <Message>
                    <MessageContent className="gap-1">
                      <MessageHeader>OUTROS</MessageHeader>
                      <Bubble variant="muted">
                        <BubbleContent>
                          Conta uma situação em que você discordou de uma decisão técnica do time.
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                <MessageScrollerItem>
                  <Message align="end">
                    <MessageContent className="gap-1">
                      <MessageHeader className="justify-end">VOCÊ</MessageHeader>
                      <Bubble align="end">
                        <BubbleContent>Na migração do checkout, defendi manter a fila até medir a latência.</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                <MessageScrollerItem>
                  <Message>
                    <MessageContent className="gap-1">
                      <MessageHeader>OUTROS</MessageHeader>
                      <Bubble variant="muted">
                        <BubbleContent className="flex flex-col gap-2">
                          Qual foi o maior erro que você cometeu em um projeto?
                          <Bubble variant="tinted" className="max-w-full">
                            <BubbleContent className="flex flex-col gap-1">
                              <span className="flex items-center gap-2 text-xs font-medium"><IconSparkles className="size-3" /> SUGIRO DIZER</span>
                              Subestimei a migração de dados do checkout. Hoje rodo um ensaio com dados reais antes de marcar a data.
                              <span className="text-xs text-muted-foreground">historico-projetos.md</span>
                            </BubbleContent>
                          </Bubble>
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                <MessageScrollerItem scrollAnchor>
                  <Message>
                    <MessageContent className="gap-1">
                      <MessageHeader>TEKA</MessageHeader>
                      <Bubble variant="secondary">
                        <BubbleContent>Você defendeu manter a fila até medir a latência e provou com um teste de carga.</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <p className="text-xs text-muted-foreground">O insight é um balão dentro de outro, na variante que pega o tom da cor primária.</p>
      </Demo>

      <Demo titulo="Campo de pergunta">
        <InputGroup>
          <InputGroupAddon align="inline-start"><IconSparkles /></InputGroupAddon>
          <InputGroupInput placeholder="Pergunte algo à IA" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Falar"><IconMicrophone /></InputGroupButton>
            <InputGroupButton size="icon-xs" variant="default" aria-label="Enviar"><IconArrowUp /></InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Demo>

      <Demo titulo="Seção que abre e fecha">
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">Medidores de áudio <IconChevronUp /></Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3 pt-3">
            <Progress value={45} />
            <Progress value={20} />
          </CollapsibleContent>
        </Collapsible>
      </Demo>

      <Demo titulo="Linhas de modelo">
        <ItemGroup className="gap-2">
          <Item variant="outline">
            <ItemMedia variant="icon"><IconMicrophone /></ItemMedia>
            <ItemContent>
              <ItemTitle>Apple Speech <Badge>Recomendado</Badge></ItemTitle>
              <ItemDescription>No seu Mac, sem baixar nada.</ItemDescription>
            </ItemContent>
            <ItemActions><Badge variant="secondary">Em uso</Badge></ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon"><IconFile /></ItemMedia>
            <ItemContent>
              <ItemTitle>Whisper Small <Badge variant="outline">Equilibrado</Badge></ItemTitle>
              <ItemDescription>Vários idiomas · 466 MB</ItemDescription>
            </ItemContent>
            <ItemActions><Button size="sm" variant="secondary">Baixar</Button></ItemActions>
          </Item>
        </ItemGroup>
      </Demo>

      <Demo titulo="Pasta, estado vazio e arquivos">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><IconFolder /></EmptyMedia>
            <EmptyTitle>Escolher uma pasta</EmptyTitle>
            <EmptyDescription>Texto, Markdown e PDF.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button>Escolher pasta</Button></EmptyContent>
        </Empty>
        <AttachmentGroup>
          <Attachment state="done">
            <AttachmentMedia><IconFile /></AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>briefing-vaga.md</AttachmentTitle>
              <AttachmentDescription>4 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="processing">
            <AttachmentMedia><IconFile /></AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>perfil-empresa.pdf</AttachmentTitle>
              <AttachmentDescription>Lendo…</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
      </Demo>

      <Demo titulo="Processando">
        <div className="flex items-center gap-3 text-sm"><Spinner /> Procurando nos arquivos…</div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Demo>

      <Demo titulo="Menu lateral">
        <SidebarProvider className="min-h-0">
          <Sidebar collapsible="none" className="h-60 w-full rounded-lg border border-border">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Teka</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem><SidebarMenuButton isActive><IconHome /> Início</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton><IconFolder /> Contexto</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton><IconSettings /> Configurações</SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </Demo>
    </div>
  )
}
