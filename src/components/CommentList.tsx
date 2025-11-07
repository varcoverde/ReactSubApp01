import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { LeadComment } from '../types/lead.ts';

interface CommentListProps {
  comentarios: LeadComment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comentarios }) => {
  if (!comentarios.length) {
    return <p className="mt-4 text-sm text-slate-500">Ainda não há comentários para este lead.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comentarios.map((comentario) => (
        <div
          key={comentario.id}
          className="rounded-xl border-l-4 border-blue-600 bg-blue-50/60 p-4 shadow-sm"
        >
          <strong className="text-sm font-semibold text-slate-900">{comentario.autor}</strong>
          <div className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(comentario.criadoEm), {
              addSuffix: true,
              locale: ptBR
            })}
          </div>
          <p className="mt-2 text-sm text-slate-700">{comentario.conteudo}</p>
        </div>
      ))}
    </div>
  );
};
