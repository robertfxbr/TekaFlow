# Modelos de transcrição: o que existe, quanto pesa e como vai em português

**Data:** 20 de Novembro de 2026 · **Para quê:** alimentar a tela 2 (Transcrição) com modelos reais, sem placeholder.

Todo número abaixo vem de uma página lida nesta pesquisa. O que não foi confirmado está marcado **(não confirmado)**.

## 1. A lista do Handy é a melhor?

Não é uma lista de "melhores". É o **catálogo do próprio app**, escolhido por ele. O que vale dela: mostra o que roda bem em computador comum, com tamanho real. O catálogo atual tem mais de 40 modelos, todos no formato GGUF, baixados do Hugging Face e carregados por um motor próprio (`transcribe-cpp`). As notas de precisão e velocidade que o app mostra são **calculadas por ele** a partir de testes dele, não são um ranking independente.

Fonte: catálogo do repositório do Handy (github.com/cjpais/Handy, arquivo `src-tauri/src/catalog/catalog.json`).

## 2. Tamanhos reais

### Whisper (OpenAI, licença MIT, 99 idiomas, inclui português)

Arquivos do whisper.cpp no Hugging Face (huggingface.co/ggerganov/whisper.cpp):

| Modelo | Tamanho do arquivo | Versão compacta (q5) |
|---|---|---|
| tiny | 77,7 MB | 32,2 MB |
| base | 148 MB | 59,7 MB |
| small | 488 MB | 190 MB |
| medium | 1,53 GB | 539 MB |
| large-v3 | 3,1 GB | 1,08 GB |
| large-v3-turbo | 1,62 GB | 574 MB |

Versões q8 (qualidade quase igual à cheia, bem menores): small 264 MB, medium 823 MB, turbo 874 MB.

Parâmetros e velocidade relativa, do README do Whisper (medidos em inglês numa placa A100): tiny 39 M, base 74 M, small 244 M, medium 769 M, large 1550 M, turbo 809 M. O turbo roda cerca de 8 vezes mais rápido que o large.

Memória em uso (README do whisper.cpp): tiny ~273 MB, base ~388 MB, small ~852 MB, medium ~2,1 GB, large ~3,9 GB.

### Parakeet v3 (NVIDIA, licença CC-BY-4.0)

25 idiomas europeus, **português incluído**. 600 milhões de parâmetros. No Handy, a versão GGUF pesa **739,5 MB**. A página da NVIDIA não informa o tamanho do arquivo.

### Os modelos do Handy que importam para o Teka

| Modelo | Tamanho (versão padrão) | Idiomas | Observação do catálogo |
|---|---|---|---|
| Parakeet TDT 0.6B v3 | 739,5 MB | 25, com português | "Fast and accurate, great overall multilingual pick" |
| Nemotron Streaming 3.5 | 751,1 MB | 32 códigos de idioma | Transcreve em fluxo, enquanto a pessoa fala |
| Whisper Small | 269,8 MB | 99 | Pequeno e amplo |
| Whisper Medium | 831,5 MB | 99 | "Broadest language support, but may run a bit slow" |
| Whisper Large v3 Turbo | 886,4 MB | 100 | Rápido com placa de vídeo |
| Whisper Large v3 | 1,67 GB | 99 | Melhor em Mac com chip Apple ou placa de vídeo |
| Voxtral Mini 4B Realtime | 4,73 GB | 13, com português | Pesado, em fluxo |
| Cohere Transcribe | 2,41 GB | 14, com português | Não transcreve em fluxo |
| Canary 180M Flash | 218,4 MB | só en, de, es, fr | **Sem português** |
| Parakeet Unified English | 731,4 MB | só inglês | **Sem português** |

## 3. Português do Brasil

Erro de palavras (WER, quanto menor melhor). Os testes **não são comparáveis entre si**: cada um normaliza o texto de um jeito.

**Tabela do Open ASR Leaderboard** (artigo arxiv.org/abs/2510.06961, tabela 4, posição de 8 de Outubro de 2025, média de MLS, FLEURS e CoVoST-2):

| Modelo | Erro em português |
|---|---|
| Whisper Large v3 | 4,38 |
| Voxtral Mini 3B | 4,80 |
| Phi 4 Multimodal | 5,15 |
| Parakeet TDT 0.6B v3 | 5,95 |
| Canary 1B v2 | 6,23 |

**Parakeet v3, página da NVIDIA:** FLEURS pt 4,76, MLS pt 7,50, CoVoST pt 3,96. A própria página avisa: o treino usa **português de Portugal**, e a maioria dos testes usa português do Brasil.

**Whisper, artigo original** (valores tirados de um resumo, não do texto literal, então **não confirmado**): no FLEURS português, tiny 20,1, base 13,0, small 7,3, medium 5,0, large 4,8, large-v2 4,3.

**O que isso permite dizer:** o Whisper Large v3 lidera em português entre os modelos medidos, com o Parakeet v3 perto e muito mais leve (739 MB contra 1,67 GB). Para o Whisper, small já fica em torno de 7% de erro, e a partir do medium em torno de 5%.

**Não encontrado (não confirmado):**
- Erro de português do large-v3 e do turbo fora da tabela acima.
- Modelos Whisper refinados para português brasileiro (esta busca não foi feita).
- Maçã: o Apple SpeechTranscriber (macOS 26) roda no aparelho e o sistema gerencia o modelo, mas **a lista de idiomas, se inclui pt-BR, e o tamanho não aparecem nas páginas lidas**. Dá para conferir no Mac com `SpeechTranscriber.supportedLocales`.

## 4. Motores e o que roda onde

| Motor | Mac | Windows |
|---|---|---|
| whisper.cpp | Metal (GPU do chip Apple), Core ML opcional | CPU, CUDA (placa NVIDIA), Vulkan |
| Parakeet v3 (original NVIDIA) | A página cita só Linux e placas NVIDIA | Idem. Precisa de uma versão convertida, como a do Handy (GGUF) |
| Apple SpeechTranscriber | Sim, macOS 26 | Não existe |

## 5. O que sugiro listar na tela 2

Só modelos com português confirmado e tamanho real:

1. **Whisper Small** (269,8 MB em q8): o leve, para qualquer máquina.
2. **Whisper Medium** (831,5 MB): equilíbrio.
3. **Whisper Large v3 Turbo** (886,4 MB): rápido e preciso, melhor com GPU.
4. **Whisper Large v3** (1,67 GB): o mais preciso em português.
5. **Parakeet v3** (739,5 MB): leve e preciso, com a ressalva do português europeu no treino.
6. **Apple Speech** (só no Mac): tamanho e português ainda a confirmar.

Decisão do Carlos pendente: quais entram e em que ordem.

## 6. Fontes

- github.com/cjpais/Handy (catálogo e README)
- huggingface.co/ggerganov/whisper.cpp e github.com/ggml-org/whisper.cpp
- github.com/openai/whisper e huggingface.co/openai/whisper-large-v3-turbo
- huggingface.co/nvidia/parakeet-tdt-0.6b-v3
- arxiv.org/abs/2510.06961 (Open ASR Leaderboard) e arxiv.org/abs/2212.04356 (Whisper)
- developer.apple.com/videos/play/wwdc2025/277 (Apple SpeechTranscriber)
