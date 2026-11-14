// Filtro do que o Whisper devolve (electron/stt/cleanTranscript.js)
const { cleanTranscript: c } = require('../electron/stt/cleanTranscript');
let f = 0;
const eq = (name, got, want) => { const ok = got === want; if (!ok) f++; console.log(ok ? 'ok  ' : 'FAIL', name, ok ? '' : JSON.stringify(got)); };
// alucinações em ruído/silêncio: somem
for (const t of ['.com.uk', '.com.br', '.com.br.', '.com', 'www.sup.com.com.au', 'site.com.br', '[Música]', '(risos)', '♪♪', 'Legendas pela comunidade Amara.org', 'Obrigado por assistir!', '...', 'a']) eq(`some: ${t}`, c(t), '');
// fala de verdade: fica (mesmo citando site)
eq('fala com site no meio', c('Entra no teka.com.br e baixa o instalador.'), 'Entra no teka.com.br e baixa o instalador.');
eq('fala comum', c('Me fala um pouco sobre você.'), 'Me fala um pouco sobre você.');
eq('tira marcação e mantém fala', c('[Música] Bom dia a todos'), 'Bom dia a todos');
eq('sigla curta', c('Ok, pode ser.'), 'Ok, pode ser.');
console.log(f ? `${f} falha(s)` : 'PASS: filtro de alucinação da transcrição');
process.exit(f ? 1 : 0);
