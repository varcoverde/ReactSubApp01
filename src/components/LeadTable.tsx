import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { LeadSummary } from '../types/lead.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface LeadTableProps {
  leads: LeadSummary[];
  carregando?: boolean;
}

export const LeadTable = ({ leads, carregando }: LeadTableProps) => {
  if (carregando) {
    return <p>Carregando leads...</p>;
  }

  if (!leads.length) {
    return <p>Nenhum lead encontrado para os filtros selecionados.</p>;
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Empresa</th>
            <th>Contato</th>
            <th>Status</th>
            <th>Origem</th>
            <th>Criado em</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.nome}</strong>
                <div className="text-muted">{lead.email}</div>
              </td>
              <td>{lead.empresa}</td>
              <td>{lead.telefone}</td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
              <td>{lead.origem}</td>
              <td>{format(new Date(lead.criadoEm), "dd 'de' MMMM yyyy", { locale: ptBR })}</td>
              <td>
                <Link to={`/leads/${lead.id}`}>Ver detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
