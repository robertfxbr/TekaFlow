// Responde uma pergunta sobre arquivos de uma pasta usando a IA que a pessoa conectou e escolheu.
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { spawn } = require("node:child_process")
const { lerArquivos } = require("./leitor.cjs")

const TIMEOUT = 60000
const MODELOS = {
  openai: "gpt-4o-mini",
  anthropic: "claude-haiku-4-5",
  google: "gemini-2.5-flash",
  chatgpt: "gpt-5.6-sol",
  chatgptAlternativos: ["gpt-5.6-terra", "gpt-5.6-luna", "gpt-6.1-sol", "gpt-5.4"], // os ids são os que outros apps mostram; o serviço não os documenta
  claude: "haiku",
}
const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"

class Falha extends Error {}
const falha = (msg) => new Falha(msg)

const PRIMEIRA_PESSOA = "A resposta será dita em voz alta pela própria pessoa numa reunião. Escreva em PRIMEIRA PESSOA (eu, meu, minha), como se fosse ela falando, em tom natural e direto, nunca em terceira pessoa e sem falar dela como outra pessoa. Use também o que ela já disse na conversa para complementar e manter a coerência.";

function montarPrompt(pergunta, trechos, curto = false, conversa) {
  const blocos = trechos.map((t) => `### Arquivo: ${t.arquivo}\n${t.texto}`).join("\n\n")
  return [
    "Você ajuda uma pessoa a consultar os próprios arquivos. Responda em português do Brasil.",
    "Regras: responda somente com base nos arquivos abaixo; se a resposta não estiver neles, diga isso com clareza; seja curto e direto; cite entre parênteses o nome dos arquivos que usou.",
    "",
    blocos,
    "",
    conversa !== undefined ? PRIMEIRA_PESSOA : "",
    conversa ? `Conversa até agora (Você é quem vai usar a sugestão; Outros são os demais participantes):\n${conversa}\n` : "",
    curto ? "Responda em UMA frase curta, em português, num tom humano e direto, como um colega atencioso. Sem listas, sem citar nomes de arquivo entre parênteses e sem explicar o que leu. É só um teste rápido." : "",
    `Pergunta: ${pergunta}`,
  ].join("\n")
}

// Traduz status HTTP e erros de rede em frases que um designer entende.
function erroHttp(status, corpo = "") {
  let bruto = String(corpo)
  try { const j = JSON.parse(bruto.replace(/ \(modelos tentados:.*\)$/, "")); bruto = j.detail || j.error?.message || bruto } catch {}
  const detalhe = bruto.replace(/\s+/g, " ").trim().slice(0, 200)
  const cod = `(código ${status})`
  if (status === 401 || status === 403) return falha(`A conexão foi recusada. Reconecte a IA. ${cod}`)
  if (status === 429 || /quota|insufficient|billing|rate/i.test(corpo)) return falha(`O limite de uso acabou. Tente mais tarde ou troque de modelo. ${cod}`)
  if (status === 404 || (/model/i.test(corpo) && status === 400)) return falha(`Esse modelo não está mais disponível. Escolha outro. ${cod}`)
  if (status >= 500) return falha(`O serviço está fora do ar agora. Tente de novo em alguns minutos. ${cod}`)
  return falha(`A IA recusou o pedido.${detalhe ? ` O serviço respondeu: ${detalhe}` : ""} ${cod}`)
}
function traduzir(e) {
  if (e instanceof Falha) return e.message
  if (e?.name === "TimeoutError" || e?.name === "AbortError") return "A IA demorou demais. Tente de novo ou troque de modelo."
  if (e?.cause?.code && /ENOTFOUND|ECONN|ETIMEDOUT|EAI_AGAIN|ENETUNREACH/.test(e.cause.code)) return "Sem conexão com a internet. Confira a rede e tente de novo."
  if (e instanceof TypeError && /fetch failed/i.test(e.message)) return "Sem conexão com a internet. Confira a rede e tente de novo."
  return "Não consegui falar com a IA."
}

function criarPergunta(db, banco) {
  const { safeStorage } = (() => { try { return require("electron") } catch { return {} } })()
  const estado = () => db.lerConfig(banco).ia || { conectadas: [], ativa: null }
  const escolhido = (id, padrao) => estado().modelos?.[id] || padrao

  function lerSegredo(nome) {
    const bruto = db.lerConfig(banco)["segredo_" + nome]
    if (!bruto) return null
    try {
      const json = bruto.startsWith("c:") ? safeStorage.decryptString(Buffer.from(bruto.slice(2), "base64")) : bruto.slice(2)
      return JSON.parse(json)
    } catch { return null }
  }
  function gravarSegredo(nome, valor) {
    const bruto = JSON.stringify(valor)
    const v = safeStorage?.isEncryptionAvailable?.() ? "c:" + safeStorage.encryptString(bruto).toString("base64") : "p:" + bruto
    db.salvarConfig(banco, "segredo_" + nome, v)
  }

  const postar = (url, cab, corpo) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...cab }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(TIMEOUT) })

  async function chamarChave(prompt) {
    const anthropic = lerSegredo("anthropic")?.chave
    const openai = lerSegredo("openai")?.chave
    if (openai) {
      const r = await postar("https://api.openai.com/v1/chat/completions", { Authorization: `Bearer ${openai}` }, { model: MODELOS.openai, messages: [{ role: "user", content: prompt }] })
      if (!r.ok) throw erroHttp(r.status, await r.text())
      return { texto: (await r.json()).choices?.[0]?.message?.content, modelo: MODELOS.openai }
    }
    if (anthropic) {
      const r = await postar("https://api.anthropic.com/v1/messages", { "x-api-key": anthropic, "anthropic-version": "2023-06-01" }, { model: MODELOS.anthropic, max_tokens: 1024, messages: [{ role: "user", content: prompt }] })
      if (!r.ok) throw erroHttp(r.status, await r.text())
      return { texto: (await r.json()).content?.map((c) => c.text || "").join(""), modelo: MODELOS.anthropic }
    }
    throw falha("Nenhuma chave de API está conectada.")
  }

  async function chamarGemini(prompt) {
    const chave = lerSegredo("google")?.chave
    if (!chave) throw falha("A chave do Gemini não está conectada.")
    let modelo = escolhido("gemini", MODELOS.google)
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      const r = await postar(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, { "x-goog-api-key": chave }, { contents: [{ role: "user", parts: [{ text: prompt }] }] })
      if (!r.ok) {
        const corpo = await r.text()
        // O Google avisa quando um modelo saiu de linha e diz qual usar no lugar: troca e tenta de novo, uma vez.
        const novo = corpo.match(/use models\/([\w.-]+)/)?.[1]
        if (tentativa === 0 && novo && /no longer available/i.test(corpo)) {
          modelo = novo
          const i = estado(); i.modelos = { ...(i.modelos || {}), gemini: novo }; db.salvarConfig(banco, "ia", i)
          continue
        }
        throw erroHttp(r.status, corpo)
      }
      const j = await r.json()
      return { texto: j.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join(""), modelo }
    }
    throw falha("O Gemini não respondeu.")
  }

  function claudeCode(prompt) {
    const bin = [path.join(os.homedir(), ".local/bin/claude"), "/opt/homebrew/bin/claude", "/usr/local/bin/claude"].find((p) => fs.existsSync(p))
    if (!bin) return Promise.reject(falha("Não achei o Claude Code neste Mac."))
    return new Promise((resolve, reject) => {
      // Sem ferramentas e sem salvar sessão: ele só responde, não mexe em nada.
      const filho = spawn(bin, ["-p", "--output-format", "text", "--model", escolhido("claude", MODELOS.claude), "--tools", "", "--no-session-persistence"], { cwd: os.tmpdir(), stdio: ["pipe", "pipe", "pipe"] })
      let saida = "", erro = ""
      const timer = setTimeout(() => { filho.kill("SIGKILL"); reject(falha("A IA demorou demais. Tente de novo ou troque de modelo.")) }, TIMEOUT)
      filho.stdout.on("data", (d) => (saida += d))
      filho.stderr.on("data", (d) => (erro += d))
      filho.on("error", () => { clearTimeout(timer); reject(falha("O Claude Code não abriu.")) })
      filho.on("close", (codigo) => {
        clearTimeout(timer)
        if (codigo === 0 && saida.trim()) return resolve({ texto: saida.trim(), modelo: "Claude Code" })
        const t = saida + erro
        if (/login|authenticat|unauthorized/i.test(t)) return reject(falha("O Claude Code está sem login. Abra o terminal e rode claude para entrar."))
        if (/limit|quota|usage/i.test(t)) return reject(falha("O limite de uso do Claude acabou por agora."))
        reject(falha("O Claude Code não conseguiu responder."))
      })
      filho.stdin.on("error", () => {})
      filho.stdin.end(prompt)
    })
  }

  // Backend do ChatGPT (mesmo caminho do Codex CLI), com o token OAuth guardado.
  const exp = (jwt) => { try { return JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString()).exp * 1000 } catch { return 0 } }
  const contaId = (jwt) => { try { const p = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString()); return p["https://api.openai.com/auth"]?.chatgpt_account_id || p.chatgpt_account_id || null } catch { return null } }
  async function renovar(token) {
    const r = await fetch("https://auth.openai.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", client_id: CLIENT_ID, refresh_token: token.refresh_token }),
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok) throw falha("O login do ChatGPT venceu. Conecte de novo nas configurações.")
    const novo = await r.json()
    const unido = { ...token, ...novo, refresh_token: novo.refresh_token || token.refresh_token }
    gravarSegredo("chatgpt", unido)
    return unido
  }
  async function chamarChatgpt(prompt) {
    let token = lerSegredo("chatgpt")
    if (!token?.access_token) throw falha("O ChatGPT não está conectado.")
    if (token.refresh_token && Date.now() > exp(token.access_token) - 60000) { try { token = await renovar(token) } catch (e) { if (Date.now() > exp(token.access_token)) throw e } }
    const enviar = (tk, modelo) => fetch("https://chatgpt.com/backend-api/codex/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tk.access_token}`, "OpenAI-Beta": "responses=experimental", ...(contaId(tk.access_token) ? { "chatgpt-account-id": contaId(tk.access_token) } : {}) },
      body: JSON.stringify({ model: modelo, instructions: "Você responde perguntas sobre arquivos do usuário.", input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }], stream: true, store: false }),
      signal: AbortSignal.timeout(TIMEOUT),
    })
    // O backend do ChatGPT não é documentado e os modelos mudam: se um for recusado, tenta o próximo.
    const modelos = [escolhido("chatgpt", MODELOS.chatgpt), ...MODELOS.chatgptAlternativos.filter((m) => m !== escolhido("chatgpt", ""))]
    let r, usado = modelos[0], ultimo = ""
    for (const m of modelos) {
      usado = m
      r = await enviar(token, m)
      if (r.status === 401 && token.refresh_token) { token = await renovar(token); r = await enviar(token, m) }
      if (r.ok) break
      ultimo = await r.text()
      if (!(r.status === 400 || r.status === 404) || !/model/i.test(ultimo)) throw erroHttp(r.status, ultimo)
    }
    if (!r.ok) throw erroHttp(r.status, `${ultimo} (modelos tentados: ${modelos.join(", ")})`)
    // A resposta vem em fluxo (SSE): junta os pedaços de texto.
    let texto = "", resto = ""
    const dec = new TextDecoder()
    for await (const pedaco of r.body) {
      resto += dec.decode(pedaco, { stream: true })
      const linhas = resto.split("\n")
      resto = linhas.pop()
      for (const l of linhas) {
        if (!l.startsWith("data:")) continue
        try { const j = JSON.parse(l.slice(5)); if (j.type === "response.output_text.delta" && j.delta) texto += j.delta } catch {}
      }
    }
    return { texto, modelo: usado }
  }

  async function chamar(prompt, forcada) {
    const ativa = forcada || estado().ativa
    if (!ativa) throw falha("Nenhuma IA conectada. Conecte uma em Modelos.")
    const mapa = { chatgpt: chamarChatgpt, claude: claudeCode, gemini: chamarGemini, chave: chamarChave }
    if (!mapa[ativa]) throw falha("Não conheço a IA escolhida.")
    const r = await mapa[ativa](prompt)
    if (!r.texto?.trim()) throw falha("A IA não devolveu resposta.")
    return { texto: r.texto.trim(), modelo: r.modelo }
  }

  async function perguntar({ pergunta, pasta, arquivos, curto, conversa }) {
    try {
      if (!pergunta?.trim()) return { ok: false, erro: "Escreva uma pergunta." }
      // Sem arquivos marcados (reunião sem pasta), a IA sugere a resposta só com o que sabe.
      if (!(arquivos || []).length) {
        const r = await chamar(`${PRIMEIRA_PESSOA}\n${conversa ? `\nConversa até agora:\n${conversa}\n` : ""}\nSugira uma resposta curta (no máximo 3 frases, em português) para esta pergunta feita a ela:\n${pergunta.trim()}`)
        return { ok: true, texto: r.texto, fontes: [], modelo: r.modelo, ignorados: [] }
      }
      const { trechos, ignorados } = await lerArquivos(pasta, arquivos || [], curto ? 8000 : 60000)
      if (!trechos.length) return { ok: false, erro: ignorados[0]?.motivo || "Escolha pelo menos um arquivo .md, .txt ou .pdf." }
      const r = await chamar(montarPrompt(pergunta.trim(), trechos, curto, conversa))
      return { ok: true, texto: r.texto, fontes: trechos.map((t) => t.arquivo), modelo: r.modelo, ignorados }
    } catch (e) {
      return { ok: false, erro: traduzir(e) }
    }
  }

  // Pares de perguntas prontas, sem exigir raciocínio. Um par é sorteado a cada teste.
  const PARES = [
    [["Qual é a capital da França?", "paris"], ["Quanto é 7 + 5?", "12"]],
    [["Qual é a capital do Brasil?", "brasilia"], ["Quanto é 9 - 4?", "5"]],
    [["Qual é a capital do Japão?", "toquio"], ["Quanto é 6 x 3?", "18"]],
  ]
  const limpar = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  async function ping(id) {
    const t0 = Date.now()
    const par = PARES[Math.floor(Math.random() * PARES.length)]
    const perguntas = par.map((x) => x[0])
    try {
      const r = await chamar(`Responda em duas linhas, uma resposta por linha, sem explicar nada:\n1) ${perguntas[0]}\n2) ${perguntas[1]}`, id)
      const linhas = r.texto.split("\n").map((l) => l.trim()).filter(Boolean)
      const acertos = par.map((x, i) => limpar(linhas[i] ?? "").includes(x[1]) || (i === 1 && limpar(r.texto).includes(x[1])))
      return { ok: true, ms: Date.now() - t0, modelo: r.modelo, resposta: r.texto.trim(), perguntas, acertos }
    } catch (e) {
      return { ok: false, ms: Date.now() - t0, erro: traduzir(e) }
    }
  }

  // Modelos disponíveis em cada conexão, direto do serviço quando dá. Descrições ficam no app (nossa tabela), não aqui.
  async function modelos(id) {
    try {
      if (id === "gemini") {
        const chave = lerSegredo("google")?.chave
        if (!chave) return { ok: false, erro: "Conecte o Gemini primeiro." }
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": chave }, signal: AbortSignal.timeout(15000) })
        if (!r.ok) return { ok: false, erro: "Não consegui buscar os modelos do Gemini." }
        const j = await r.json()
        const fora = /(embedding|tts|image|live|audio|transcri|robotics|computer-use|deep-research|veo|imagen|learnlm|gemma|aqa|-latest|exp|customtools|vision|thinking-\d)/i
        const versao = (id) => parseFloat(id.match(/^gemini-(\d+(?:\.\d+)?)/)?.[1] ?? "0")
        const familia = (id) => (/flash-lite/.test(id) ? 2 : /flash/.test(id) ? 0 : 1)
        const brutos = (j.models || [])
          .filter((m) => m.supportedGenerationMethods?.includes("generateContent") && /^models\/gemini-\d/.test(m.name) && !fora.test(m.name))
          .map((m) => ({ id: m.name.replace("models/", ""), nome: m.displayName || m.name }))
          .sort((x, y) => versao(y.id) - versao(x.id) || familia(x.id) - familia(y.id))
          .slice(0, 6)
        // Só entram os modelos que respondem de verdade a esta chave (alguns saem de linha ou não estão no plano gratuito).
        const prova = await Promise.all(brutos.map(async (m) => {
          try {
            const rr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m.id}:generateContent`, { method: "POST", headers: { "x-goog-api-key": chave, "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "oi" }] }], generationConfig: { maxOutputTokens: 8 } }), signal: AbortSignal.timeout(15000) })
            return rr.ok ? null : `${m.id}: código ${rr.status}`
          } catch { return `${m.id}: sem resposta` }
        }))
        const vivos = brutos.filter((_, i) => prova[i] === null)
        if (!vivos.length) return { ok: false, erro: `Nenhum modelo do Gemini respondeu a esta chave. ${prova[0] ?? ""}` }
        brutos.splice(0, brutos.length, ...vivos)
        const rec = brutos.find((m) => familia(m.id) === 0)?.id
        const lista = [...brutos.map((m) => ({ ...m, recomendado: m.id === rec }))].sort((x, y) => Number(y.recomendado) - Number(x.recomendado))
        return { ok: true, modelos: lista }
      }
      if (id === "claude") return { ok: true, modelos: [{ id: "haiku", nome: "Claude Haiku 5.5", recomendado: true }, { id: "sonnet", nome: "Claude Sonnet 5.5" }, { id: "opus", nome: "Claude Opus 5.5" }] }
      if (id === "chatgpt") return { ok: true, modelos: [{ id: "gpt-5.6-luna", nome: "GPT-5.6 Luna", recomendado: true }, { id: "gpt-5.6-terra", nome: "GPT-5.6 Terra" }, { id: "gpt-5.6-sol", nome: "GPT-5.6 Sol" }] }
      return { ok: true, modelos: [] }
    } catch { return { ok: false, erro: "Sem conexão com a internet. Confira a rede e tente de novo." } }
  }

  return { perguntar, ping, modelos }
}

module.exports = { criarPergunta }
