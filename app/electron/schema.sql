-- Sessões do TekaFlow. Colunas do banco do projeto original (id, started_at, ended_at, subject, status),
-- mais `tag` (o tipo da reunião) e `questions` (quantas perguntas a IA respondeu).
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  subject TEXT,
  tag TEXT,
  questions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ended'
);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);

-- Configurações simples do aplicativo (chave e valor): se o onboarding terminou, a etapa em que parou e o que foi escolhido nele.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
