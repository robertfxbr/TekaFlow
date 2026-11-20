# Animação do gato

O gato do TekaFlow se mexe por estados. O que o app precisa usar já está no `design-system/` e roda no Style Guide, em [localhost:5180/#gato](http://localhost:5180/#gato).

Para ver todos os estados ao vivo, abra [animacoes-gato.html](animacoes-gato.html).

## Como usar

```tsx
import { GatoAnimado } from "@/components/gato-animado"

<GatoAnimado estado="falando" className="size-40 text-primary" />
<GatoAnimado estado="lendo" olhar={{ x: 1, y: 0.1 }} />
```

A cor vem do texto (`currentColor`): `text-primary` pinta de limão e `text-foreground` de branco ou grafite. O olhar é opcional, de -1 a 1 em cada eixo (x positivo é para a direita, y negativo é para cima).

## Estados

| Estado | Olhos | Boca | Movimento |
|---|---|---|---|
| `idle` | Contente (arcos), que **seguem o mouse, devagar e com um pequeno atraso**. É o **padrão onde há logo** | Quieta, três pontos (a logo usa a boca de três barras) | Sorri e respira. De tempos em tempos pisca, abre os olhos, pisca duas vezes e volta a sorrir |
| `falando` | Atento (abertos e mais juntos). A troca com o Contente acontece numa piscada | Três risquinhos que crescem e encolhem | Pisca de vez em quando e mexe um pouquinho |
| `lendo` | Como falando, com o olhar indo para onde o texto está | Também fala | Pisca e mexe |
| `pensando` e `escrevendo` | Abertos, passeando para cima e para os lados, com piscadas normais de vez em quando (como no lendo) | Três pontinhos que crescem em onda. **O gato fica estático**: só os olhos e a boca se mexem | É o **loading padrão**: usar quando o gato pensa e quando está escrevendo |

## Onde está cada coisa

| Arquivo | O que é |
|---|---|
| `design-system/src/components/gato-animado.tsx` | O componente React, com o desenho do gato |
| `design-system/src/lib/gato-animacao.ts` | O motor, sem React. Tempos e intensidades em `GATO_TEMPOS`. O contorno da cabeça está em `CABECA_GATO` |
| `design-system/src/style-guide/gato-demo.tsx` | A demonstração no Style Guide |
| `marca/playground-gato.html` | O playground original, para testar ritmo |
| `marca/rascunhos/loading-gato-opcoes.html` | As doze opções de loading. Rascunho guardado: a escolhida foi a 2, “pontinhos na boca” |

## O que falta

- **Forma da cabeça:** quando a cabeça for decidida (ver `marca/refino-orelhas.html`), troca-se só `CABECA_GATO`.
- Com "reduzir movimento" ligado, o gato troca de estado mas não se mexe sozinho.
