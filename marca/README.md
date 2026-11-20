# Marca TekaFlow

TekaFlow, antes Teka. O gato do Robert continua dentro do nome.

## Logo

Um gato ao lado da palavra **TekaFlow**, em duas formas:

- **Logo principal e símbolo principal:** a marca quadrada, com o gato dentro de um ícone arredondado. É a que se usa por padrão.
- **Logo versão 2:** o gato sem o quadrado (só a silhueta, com o rosto vazado). Entra só quando o contexto pede e quando o Carlos indicar.

| Arquivo | Uso |
|---|---|
| `logo/logo-horizontal-fundo-escuro.svg` | Ícone e palavra sobre o grafite neutro |
| `logo/logo-horizontal-fundo-limao.svg` | Ícone e palavra sobre o limão |
| `logo/logo-horizontal-fundo-claro.svg` | Ícone e palavra sobre branco ou fundo claro |
| `logo/logo-horizontal-mono.svg` | Ícone e palavra em uma cor (`currentColor`) |
| `logo/simbolo-fundo-escuro.svg`, `-limao.svg`, `-claro.svg`, `simbolo-mono.svg` | Só o ícone quadrado, uma versão por fundo |
| `logo/logo-gato-fundo-escuro.svg`, `-limao.svg`, `-claro.svg`, `logo-gato-mono.svg` | O gato sem o quadrado, com a palavra |
| `logo/gato-fundo-escuro.svg`, `-limao.svg`, `-claro.svg`, `gato-mono.svg` | Só o gato sem o quadrado, uma versão por fundo |
| `logo/palavra-branco.svg`, `logo/palavra-grafite.svg` | Só a palavra |
| `logo/area-de-respiro.svg` | A logo com a área de respiro desenhada |

A palavra está em contornos: nenhum arquivo precisa de fonte instalada. `previa.html` mostra todas as versões.

### Símbolo

Na marca quadrada, a cabeça do gato é vazada e mostra o fundo por dentro do ícone. No gato sem o quadrado, a silhueta é preenchida e o rosto fica vazado. Nas duas, o rosto tem dois olhos em arco (expressão Contente), uma boca de três barras de voz e um triângulo pequeno dentro de cada orelha.

| Medida | Valor |
|---|---|
| Grade | 16 por 16 células |
| Ícone | Quadrado da célula 1 à 15, cantos com raio de 4 |
| Cabeça | Bloco de 6 por 4, cantos de baixo com raio 2, orelhas em triângulos de 2 por 2 |
| Posição do gato | Desce 0,25 de célula, para a compensação óptica |
| Olhos | Arcos de 1,6 célula, centros em 6 e 10, traço de 0,55 |
| Boca | Três barras de 0,55 de largura e 1,0, 1,7 e 1,0 de altura (boca de "não falando", perto do "falando", que tem 1,1, 2,0 e 1,1) |
| Orelhas | Um triângulo pequeno dentro de cada orelha, na mesma cor do rosto |
| Fundo escuro | O traço pode descer 0,05 (0,50), porque traço claro sobre escuro parece mais grosso. Ainda em teste |

### Proporção

Uma **seção** é metade da altura das letras maiúsculas.

- O ícone tem **4 seções** de altura e fica centrado nas maiúsculas.
- O espaço entre o ícone e a palavra é de **1 seção**.
- A palavra tem uma cor só.
- A logo cresce e diminui inteira, na mesma proporção. Esticar só a largura ou só a altura a deforma.

### Área de respiro

**2 seções** em todos os lados, ou seja, meio símbolo. Em peças grandes ou impressas, 4 seções (um símbolo inteiro). Nenhum outro elemento entra nessa área.

### Palavra

**TekaFlow**, em **Chillax 600**, com espaçamento de -0,02 em. A Chillax é do Fontshare, com licença de uso comercial livre.

## Cores

| Cor | Hex | Uso |
|---|---|---|
| **Limão** | `#C5EF6B` | Cor de assinatura: ícone sobre o escuro, botão, destaque |
| **Grafite neutro** | `#1A1B1E` | Fundo escuro, texto, botão sobre o limão. É o "preto" da marca |
| **Verde escuro** | `#5C7F10` | Só o ícone sobre fundo claro |
| **Branco** | `#FFFFFF` | Palavra e texto sobre o grafite. Cabeça do gato no fundo claro |
| **Superfície escura** | `#25262A` | Card sobre o grafite neutro |
| **Azul céu** | `#5BC0FF` | Cor secundária, frio e leve, parente do verde. Degradês e destaques sobre o escuro. Contraste de 8,6 para 1 com o grafite, e 2,0 para 1 sobre branco, então não serve de texto em fundo claro |

A marca não usa preto absoluto. Os degradês combinam limão e azul céu, ou levam o limão ao grafite. O limão sobre branco tem cerca de 1,3 para 1 de contraste e não serve de texto nem de traço em fundo claro.

| Par | Contraste |
|---|---|
| Limão sobre grafite neutro | 13,1 para 1 |
| Grafite neutro sobre limão | 13,1 para 1 |
| Branco sobre grafite neutro | 17,2 para 1 |
| Verde escuro sobre branco | 4,7 para 1 |
| Grafite neutro sobre branco | 17,2 para 1 |

### Uso por fundo

| Fundo | Ícone | Cabeça | Rosto | Palavra |
|---|---|---|---|---|
| Grafite neutro | Limão | Vazada | Limão | Branco |
| Limão | Grafite neutro | Vazada | Grafite neutro | Grafite neutro |
| Branco ou claro | Verde escuro | Branca | Verde escuro | Grafite neutro |

As cores também estão em `cores/cores.css` e `cores/cores.json`.

## Tipografia

- **Logo:** Chillax 600, só na palavra TekaFlow.
- **Interface do app:** segue a tipografia do Teka atual.

## Posicionamento

**Frase:** Para quem está numa reunião ao vivo, o TekaFlow é o companheiro discreto que fica ouvindo ao seu lado e sussurra uma sugestão quando você precisa, com a IA que você já usa.

**Tagline:** Seu companheiro discreto que ouve junto e sussurra quando precisa.

**Tom de voz:** Tranquilo e Despretensioso. O discreto entra no Tranquilo, como voz baixa e sem alarde. A marca nunca diz "invisível".

Texto inicial, diferencial, exemplos e o que nunca prometer estão em [`posicionamento.md`](posicionamento.md).

## Grafismos

Os grafismos saem do moodboard aprovado (`moodboard.html`, `moodboard.png`) e de mais nada. O detalhe de cada elemento está em [grafismos.md](grafismos.md).

## Resumo

O que está certo, o que foi descartado e o que está em aberto: [consolidado.md](consolidado.md).
