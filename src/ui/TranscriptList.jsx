import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

// As falas da conversa. Fica separada da tela principal e só se redesenha
// quando as falas ou a fala respondida mudam: a sugestão chega em dezenas de
// pedaços por segundo, e cada pedaço redesenhava as até 500 falas junto.
// onAnswer precisa ser estável entre os desenhos (veja answerLineStable).
export const TranscriptList = memo(function TranscriptList({ lines, answered, onAnswer }) {
  return lines.map((t, i) => (
    <div
      key={t.id ?? i}
      className={`bubble ${t.source} clickable ${answered === t.text ? 'answered' : ''}`}
      role="button"
      tabIndex={0}
      title="Clique para o copiloto responder a esta fala"
      onClick={() => onAnswer(t)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAnswer(t); } }}
    >
      <span className="who">
        {t.source === 'mic' ? 'Você' : 'Reunião'}
        <span className="reply-hint"><Sparkles size={9} /> responder</span>
      </span>
      {t.text}
      {t.translation && <span className="translation">{t.translation}</span>}
    </div>
  ));
});
