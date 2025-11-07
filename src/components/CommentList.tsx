import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { LeadComment } from '../types/lead.ts';

interface CommentListProps {
  comentarios: LeadComment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comentarios }) => {
  if (!comentarios.length) {
    return <p className="text-muted">Ainda não há comentários para este lead.</p>;
  }

  return (
    <div className="mt-md">
      {comentarios.map((comentario) => (
        <div key={comentario.id} className="comment">
          <strong>{comentario.autor}</strong>
          <div className="comment-date">
            {formatDistanceToNow(new Date(comentario.criadoEm), {
              addSuffix: true,
              locale: ptBR
            })}
          </div>
          <p>{comentario.conteudo}</p>
        </div>
      ))}
    </div>
  );
};
