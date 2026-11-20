# Grafismos do TekaFlow

**Decisão do Carlos, 20 de Novembro de 2026:** o moodboard (`marca/moodboard.html` e `marca/moodboard.png`) é o que vai ser. Os grafismos e todo o resto saem dele. **Nada além disso.** Elemento novo só entra se ele pedir.

## O que existe

| Elemento | O que é | Regras |
|---|---|---|
| **Logo principal** | A marca quadrada (gato dentro do ícone) com a palavra | Sobre o limão. Formas de fundo em retângulos de cantos arredondados, `#B9E15C` |
| **Letra em cartaz** | "Teka" gigante em Chillax 700, cortado pela borda do quadro | Limão sobre o grafite. Pílula "ouvindo…" no topo, com o gato. Sem "Flow" |
| **Ondas em quadradinho** | O **gato sem o quadrado** no centro, com anéis em quadrado arredondado em volta, que abrem e perdem a cor | Sobre o grafite, sem contorno escuro. Cor dos anéis: limão, depois azul céu, depois a superfície. Cantos na mesma proporção do ícone (0,286) |
| **Símbolo com selo** | O símbolo da marca com o selo vermelho de notificação | Sobre a superfície `#25262A`. O vermelho só aparece no selo |
| **Adesivos de estado** | Pílulas "ouvindo", "pensando", "escrevendo" e "diga isso" | Sem sombra. Contorno branco puro de 6 px. Cores: grafite com texto limão, branco, azul céu. Levemente inclinados |
| **Tom de voz** | Frase curta no alto e etiquetas embaixo | Azul céu. "Seu companheiro discreto de reuniões." em duas linhas (sem viúva nem órfã) e as etiquetas "Mac e Windows" e "No seu computador", com espaço entre elas |

## O que não existe

Degradê, relevo de papel, barra de onda de áudio, dois pontos que viram rosto, texto em círculo, letras soltas em quadradinhos, verde escuro de fundo. Foram olhados e descartados.

## Cores

Só as da marca: grafite `#1A1B1E`, branco `#FFFFFF`, limão `#C5EF6B`, superfície `#25262A`, verde escuro `#5C7F10` (só no ícone claro, nunca de fundo de quadro) e azul céu `#5BC0FF`. Mais o vermelho do selo.

## Como regenerar

```bash
python3 _construcao/moodboard-visual.py
```
As ondas vêm de `_construcao/ondas.py`. O PNG sai pelo Chrome sem tela (ver `_construcao/LEIA-ME.md`).
