import logoClaro from "@/assets/marca/logo-gato-fundo-claro.svg"
import logoEscuro from "@/assets/marca/logo-gato-fundo-escuro.svg"
import { Escalas } from "./escalas"
import {
  IconDownload,
  IconMicrophone,
  IconMoon,
  IconPlayerStop,
  IconSparkles,
  IconSun,
} from "@tabler/icons-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-provider"
import { ConversaEListas } from "@/style-guide/conversa-e-listas"
import { GatoDemo } from "@/style-guide/gato-demo"
import { PecasTeka } from "@/style-guide/pecas-teka"
import { shortcutKeys } from "@/lib/platform"

const principios = [
  ["Legibilidade ganha de densidade", "Em chamada o texto é lido de relance. Nada encolhe para caber."],
  ["Quieto até ser chamado", "A cor de destaque aparece só onde a pessoa precisa agir."],
  ["Componente do shadcn primeiro", "Só se constrói do zero o que o shadcn não tem, e antes se pergunta."],
  ["O espaço anda na grade de 4", "4, 8, 12, 16, 20, 24, 32, 36, 40 e 48. O 28 não existe."],
  ["Nada assume Mac ou Windows", "Atalho e controle de janela dependem do sistema e ficam em um ponto só."],
]

const cores = [
  { nome: "background", bg: "bg-background", fg: "text-foreground" },
  { nome: "card", bg: "bg-card", fg: "text-card-foreground" },
  { nome: "popover", bg: "bg-popover", fg: "text-popover-foreground" },
  { nome: "primary", bg: "bg-primary", fg: "text-primary-foreground" },
  { nome: "secondary", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { nome: "muted", bg: "bg-muted", fg: "text-muted-foreground" },
  { nome: "accent", bg: "bg-accent", fg: "text-accent-foreground" },
  { nome: "success", bg: "bg-success", fg: "text-success-foreground" },
  { nome: "warning", bg: "bg-warning", fg: "text-warning-foreground" },
  { nome: "info", bg: "bg-info", fg: "text-info-foreground" },
]

const tamanhos = [
  ["text-xs", "12 px"],
  ["text-sm", "14 px"],
  ["text-base", "16 px"],
  ["text-lg", "20 px"],
  ["text-xl", "24 px"],
  ["text-2xl", "28 px"],
  ["text-3xl", "32 px"],
  ["text-4xl", "40 px"],
]

const degraus = [
  ["w-1", "4"],
  ["w-2", "8"],
  ["w-3", "12"],
  ["w-4", "16"],
  ["w-5", "20"],
  ["w-6", "24"],
  ["w-8", "32"],
  ["w-9", "36"],
  ["w-10", "40"],
  ["w-12", "48"],
]

const raios = [
  ["rounded-sm", "4"],
  ["rounded-md", "8"],
  ["rounded-lg", "12"],
  ["rounded-xl", "16"],
]

function Secao({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl font-medium">{titulo}</h2>
      {children}
    </section>
  )
}

function Demo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export function StyleGuide() {
  const atalho = shortcutKeys("D")
  const { theme, setTheme } = useTheme()

  return (
    <TooltipProvider>
      <main className="mx-auto flex max-w-5xl flex-col gap-12 p-8">
        <header className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <img src={theme === "light" ? logoClaro : logoEscuro} alt="TekaFlow" className="h-10 w-fit self-start rounded-lg" />
            <h1 className="font-heading text-4xl font-medium">Style Guide</h1>
            <p className="text-base text-muted-foreground">
              A base do Design System, resumida. O produto abre no tema escuro. Use o seletor para ver o claro.
            </p>
          </div>
          <Tabs value={theme === "light" ? "light" : "dark"} onValueChange={(valor) => setTheme(valor === "light" ? "light" : "dark")}>
            <TabsList aria-label="Tema">
              <TabsTrigger value="dark"><IconMoon /> Escuro</TabsTrigger>
              <TabsTrigger value="light"><IconSun /> Claro</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <Secao id="direcao" titulo="Direção">
          <ol className="grid gap-4 md:grid-cols-2">
            {principios.map(([titulo, texto], i) => (
              <li key={titulo} className="flex gap-4 rounded-lg border border-border p-4">
                <span className="font-heading text-2xl text-foreground">{i + 1}</span>
                <div className="flex flex-col gap-1">
                  <b className="text-base font-medium">{titulo}</b>
                  <span className="text-sm text-muted-foreground">{texto}</span>
                </div>
              </li>
            ))}
          </ol>
        </Secao>

        <Secao id="fundamentos" titulo="Fundamentos">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Cores</h3>
            <Escalas />
            <h4 className="text-sm font-medium">Cores do sistema</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {cores.map((c) => (
                <div key={c.nome} className={`flex h-20 flex-col justify-between rounded-lg border border-border p-3 text-xs ${c.bg} ${c.fg}`}>
                  <span className="text-base font-medium">Aa</span>
                  <span>{c.nome}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Cada cor tem um par de texto, e todos os pares passam em AA (4,5:1) nos dois temas. No escuro, a primária é o limão com texto grafite; no claro, é o verde escuro com texto branco. Sucesso, alerta e informação são derivados do tom da marca, com a matiz girada, e o alerta é mais claro porque amarelo escuro vira marrom.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Tipografia</h3>
            <p className="text-sm text-muted-foreground">
              Títulos em Outfit e texto em Figtree. Tamanhos em múltiplos de 2 ou 4, com entrelinha em múltiplos de 4.
            </p>
            <div className="flex flex-col gap-2">
              {tamanhos.map(([classe, px]) => (
                <div key={classe} className="flex items-baseline gap-4">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">{px}</span>
                  <span className={`${classe} font-heading`}>Vamos conferir se está tudo certo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Espaço</h3>
            <p className="text-sm text-muted-foreground">Base 4, sem o 28. Mesma escala para padding, margem, gap e caixas.</p>
            <div className="flex flex-col gap-2">
              {degraus.map(([classe, px]) => (
                <div key={classe} className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">{px} px</span>
                  <div className={`h-4 rounded-sm bg-primary ${classe}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Raios</h3>
            <div className="flex gap-6">
              {raios.map(([classe, px]) => (
                <div key={classe} className="flex flex-col items-center gap-2">
                  <div className={`size-12 border border-border bg-secondary ${classe}`} />
                  <span className="text-xs text-muted-foreground">{px} px</span>
                </div>
              ))}
            </div>
          </div>
        </Secao>

        <Secao id="componentes" titulo="Componentes">
          <div className="grid gap-6 md:grid-cols-2">
            <Demo titulo="Botão">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Continuar</Button>
                <Button variant="secondary">Testar de novo</Button>
                <Button variant="outline">Voltar</Button>
                <Button variant="ghost">Pular</Button>
                <Button variant="destructive">Encerrar</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm"><IconDownload /> Baixar</Button>
                <Button size="lg"><IconPlayerStop /> Parar</Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" aria-label="Falar"><IconMicrophone /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Falar</TooltipContent>
                </Tooltip>
              </div>
            </Demo>

            <Demo titulo="Selo">
              <div className="flex flex-wrap gap-2">
                <Badge>Recomendado</Badge>
                <Badge variant="secondary">Equilibrado</Badge>
                <Badge variant="outline">Mais pesado</Badge>
                <Badge variant="destructive">Falhou</Badge>
              </div>
            </Demo>

            <Demo titulo="Campo e seletor">
              <Input placeholder="Pergunte algo à IA" />
              <Select defaultValue="pt">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português (BR)</SelectItem>
                  <SelectItem value="en">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </Demo>

            <Demo titulo="Abas">
              <Tabs defaultValue="ouvir">
                <TabsList>
                  <TabsTrigger value="ouvir"><IconMicrophone /> Ouvir</TabsTrigger>
                  <TabsTrigger value="responder"><IconSparkles /> Responder</TabsTrigger>
                </TabsList>
                <TabsContent value="ouvir" className="pt-4 text-sm text-muted-foreground">Quem transforma voz em texto.</TabsContent>
                <TabsContent value="responder" className="pt-4 text-sm text-muted-foreground">A IA que escreve as respostas.</TabsContent>
              </Tabs>
            </Demo>

            <Demo titulo="Escolha">
              <RadioGroup defaultValue="apple">
                <label className="flex items-center gap-3 text-sm"><RadioGroupItem value="apple" /> Apple Speech</label>
                <label className="flex items-center gap-3 text-sm"><RadioGroupItem value="whisper" /> Whisper Small</label>
              </RadioGroup>
              <Separator />
              <label className="flex items-center gap-3 text-sm"><Checkbox defaultChecked /> briefing-vaga.md</label>
              <label className="flex items-center justify-between gap-3 text-sm">Redução de eco <Switch /></label>
            </Demo>

            <Demo titulo="Progresso">
              <Progress value={70} />
              <p className="text-xs text-muted-foreground">Nível do microfone, 70%.</p>
            </Demo>

            <Demo titulo="Atalho, avatar e rolagem">
              <div className="flex items-center gap-4">
                <KbdGroup>
                  {atalho.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </KbdGroup>
                <Avatar>
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              </div>
              <ScrollArea className="h-24 rounded-lg border border-border">
                <ul className="flex flex-col gap-2 p-3 text-sm">
                  {["Entrevista técnica, Acme", "Cold call, Lumen Energia", "Apresentação ao CEO, Orbe", "Call em inglês, Northwind"].map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </ScrollArea>
            </Demo>

            <Demo titulo="Confirmação">
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-base">Cartão</CardTitle>
                  <CardDescription>Agrupa uma decisão e o que vem com ela.</CardDescription>
                </CardHeader>
              </Card>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Encerrar sessão</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Encerrar a sessão?</AlertDialogTitle>
                    <AlertDialogDescription>Salvamos a transcrição e o resumo em Sessões.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continuar ouvindo</AlertDialogCancel>
                    <AlertDialogAction>Encerrar sessão</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Demo>
          </div>
        </Secao>

        <Secao id="conversa" titulo="Conversa, listas e menus">
          <ConversaEListas />
        </Secao>

        <Secao id="pecas" titulo="Peças do TekaFlow">
          <PecasTeka />
        </Secao>

        <Secao id="gato" titulo="Gato animado">
          <GatoDemo />
        </Secao>
      </main>
    </TooltipProvider>
  )
}
