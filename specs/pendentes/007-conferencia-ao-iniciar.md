# Conferência ao iniciar a reunião (o padrão)

**Estado:** implementado no app em 20 de Novembro de 2026 (reuniao.tsx), com ajustes: sem mensagens do gato, conferência de até 20 s, janela própria

**Decisões do Carlos, 20 de Novembro de 2026.** Esta spec guarda o padrão do que acontece quando a pessoa clica em Iniciar. O protótipo interativo está em `design-system/public/reuniao-iniciar.html`.

## O fluxo
1. A pessoa clica em **Iniciar a reunião**. A janela do chat lateral já abre (sem modal "Antes de iniciar" e sem tela de simular fala).
2. A conferência roda ali, **no pé do chat**, perto da caixa de pergunta, em três linhas compactas: **Som**, **Transcrição** e **Modelo**. Cada linha tem uma setinha que abre uma lista pequena **para cima** (troca rápida, como o seletor de som do Windows).
3. **Som:** entrada de voz e saída de áudio juntas. O app toca um som baixinho e confere se a entrada capta. Os dois dispositivos começam no **padrão do sistema**.
4. **Transcrição:** a pessoa fala e vê o texto.
5. **Modelo:** o app manda sozinho uma pergunta de teste genérica e só confere que respondeu, sem mostrar a resposta.
6. Quando tudo passa, as linhas somem e **o gato chega feliz** dizendo que está tudo certo. A gravação começa.

## A janela
- **Em cima:** nome da pasta de contexto e quantos arquivos serão usados (sem listar nomes de arquivo), o nome do modelo e, durante a reunião, "Ouvindo" com o tempo e o nome do modelo. Uma **linha divisória** separa essa parte do chat.
- **Chat:** as mensagens aparecem de cima para baixo e a janela rola sozinha para a mais nova, como no WhatsApp.
- **Embaixo:** a conferência (só no começo) e a caixa de pergunta.

## Quando algo não dá certo
**A reunião nunca para por causa de um erro.** O app continua tentando transcrever.
- **Erro grave, sem som:** aviso no chat: "Não estamos captando som. Se você continuar assim, a reunião não será transcrita. Ela segue aberta e o TekaFlow continua tentando." Ações: **Trocar a entrada**, **Continuar mesmo assim** e **Tentar de novo**.
- Se a pessoa continua, o topo mostra "Gravando sem som 00:12 · tentando transcrever" e um atalho "Trocar entrada".
- Se o som volta (por troca de entrada ou sozinho), o gato avisa "Voltei a ouvir" e a transcrição segue. Nada do que foi dito depois disso se perde.
- Falha do modelo ou da transcrição: mesmo tratamento, com a mensagem de erro padronizada (frase, o que fazer e código).

## Ligação com outras specs
Tudo o que é transcrito é salvo aos poucos, como na spec `006-salvar-reunioes.md`. O contexto da pasta já vem carregado (spec do contexto pré-carregado, em `DECISIONS.md`).
