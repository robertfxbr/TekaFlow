# TekaFlow, marca consolidada

**Estado em 20 de Novembro de 2026.** Este é o resumo do que está decidido, do que foi descartado e do que ainda está em aberto. O detalhe e a ordem das conversas estão em `DECISIONS.md`.

## O que está certo

### Nome e posicionamento
- **Nome:** TekaFlow (antes Teka, antes OpenPerssua). O gato do Robert continua dentro do nome.
- **Frase:** "Seu companheiro discreto que ouve junto e sussurra quando precisa." Versão curta, para o app: **"Seu companheiro discreto de reuniões."**
- **Tom de voz:** Tranquilo e Despretensioso. Frases curtas, sem exclamação, sem prometer tempo nem resultado. A marca diz "discreto".
- **Texto da tela 1:** "Fico por aqui, ouvindo com você." e "O TekaFlow escuta a sua reunião e sussurra uma sugestão quando você precisa. Vamos deixar tudo pronto antes da próxima." Revisado contra o padrão de escrita.

### Logo
- **Logo principal e símbolo principal:** a marca quadrada (o gato dentro do ícone) com a palavra. É a que se usa por padrão.
- **Logo versão 2:** o gato sem o quadrado, com a palavra. Só quando o Carlos pedir ou o contexto exigir.
- **Rosto final:** olhos Contente (arcos), boca de três barras (1,0, 1,7 e 1,0 de altura), um triângulo pequeno dentro de cada orelha, traço de 0,55.
- **Palavra:** Chillax 600, em contornos. Ícone de 4 seções, 1 seção de espaço, área de respiro de 2 seções.
- Arquivos em `marca/logo/` (18 SVGs), gerados por `_construcao/exportar.py`.

### Cores
Grafite `#1A1B1E`, branco `#FFFFFF`, limão `#C5EF6B`, superfície `#25262A`, azul céu `#5BC0FF` e verde escuro `#5C7F10` (só no ícone claro, nunca como fundo de quadro). O selo vermelho do ícone do app é a única exceção.

### Grafismos: só os do moodboard
O moodboard (`marca/moodboard.html`) é a fonte. Nada além disso, salvo pedido dele.
- **Letra em cartaz:** "Tek" gigante em limão sobre o grafite, com a pílula "ouvindo…".
- **Ondas em quadradinho:** no formato do ícone, saindo do gato, perdendo a cor (limão, azul céu, sumir).
- **Adesivos de estado:** pílulas "ouvindo", "pensando", "escrevendo", "diga isso", sem sombra, com contorno branco.
- **Símbolo com selo vermelho**, o **tom de voz em azul céu** e a **logo principal em limão** com retângulos arredondados ao fundo.
- Detalhe de cada um em `marca/grafismos.md`.

### Animação do gato
- **Estados:** idle (olhos Contente que seguem o mouse; de tempos em tempos pisca, abre os olhos, pisca duas vezes e volta a sorrir; é o padrão onde há logo), falando (olhos abertos, boca em risquinhos), lendo, pensando e escrevendo.
- **Loading padrão:** os pontinhos na boca, em onda, com os olhos abertos passeando para cima e piscando normalmente de vez em quando. Serve para pensando e escrevendo. Os outros onze rascunhos estão em `marca/rascunhos/`.
- **Componente:** `GatoAnimado` (React) e o motor `gato-animacao.ts`, com a boca da logo no repouso e um modo parado.
- Documentado em `marca/animacao-gato.md`.

### Tela 1 do onboarding (também no app)
- Logo no alto à esquerda, com o gato animado e as ondas suaves saindo dele (metade da opacidade e da velocidade parado; 50% mais de cada quando fala, com fade curto). O texto fica embaixo.
- À direita, o degradê nas cores da marca, a conversa animada e, no "sugiro dizer", o gato do tamanho do texto, que fala enquanto a sugestão é escrita e fica parado, sorrindo, depois.
- Título da página: "TekaFlow, seu companheiro discreto de reuniões".
- A mesma tela serve ao protótipo e ao aplicativo, que a importam do mesmo arquivo.

### Tela de sucesso do navegador
Feita com o Impeccable em `app/electron/sucesso.html`: gato com uma onda única, "Pronto. Pode voltar ao TekaFlow." e "Você já pode fechar esta aba." Sem fonte nem arquivo externo.

## O que foi descartado

- **Degradê e vidro** nos grafismos (a tela 1 mantém o degradê do painel, por pedido dele), barrinhas de onda de áudio como grafismo, mascote 3D, ilustração gerada por IA.
- **Dois pontos que viram rosto**, relevo de papel, texto em círculo ("Ouve junto, sussurra quando precisa"), letras soltas em quadradinhos, pontos que se dissolvem, peças que se encaixam, ouvir por desenho.
- **Verde escuro de fundo** e **branco de fundo** nos quadros do moodboard.
- **Destaques** na tela 1 (lista, colunas, etiquetas): saíram na opção B.
- **Fala em pílulas do "prazo"** no moodboard e o quadro de pílulas de conversa.

## Em aberto

- **Forma da cabeça e das orelhas:** seis versões em `marca/refino-orelhas.html` (A a F). Ainda não escolhida.
- **Traço 0,50 no fundo escuro** (0,05 mais fino): ainda não aplicado nos SVGs.
- **Tamanho mínimo, ícone da barra de menu e versão vertical** da logo.
- **Azul céu como cor do app:** o app usa `info` (#6EB7E6), um pouco mais suave que o azul céu da marca.
- **Demais telas do onboarding:** receber o mesmo tratamento (logo, ondas, gato animado, textos do posicionamento).
