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
    return <p className="text-sm text-slate-500">Carregando leads...</p>;
  }

  if (!leads.length) {
    return <p className="text-sm text-slate-500">Nenhum lead encontrado para os filtros selecionados.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-6 py-3">Lead</th>
            <th className="px-6 py-3">Empresa</th>
            <th className="px-6 py-3">Contato</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Origem</th>
            <th className="px-6 py-3">Criado em</th>
            <th className="px-6 py-3 text-right">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {leads.map((lead) => (
            <tr key={lead.id} className="transition hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900">{lead.nome}</div>
                <div className="text-xs text-slate-500">{lead.email}</div>
              </td>
              <td className="px-6 py-4">{lead.empresa}</td>
              <td className="px-6 py-4">{lead.telefone}</td>
              <td className="px-6 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4">{lead.origem}</td>
              <td className="px-6 py-4">
                {format(new Date(lead.criadoEm), "dd 'de' MMMM yyyy", { locale: ptBR })}
              </td>
              <td className="px-6 py-4 text-right">
                <Link to={`/leads/${lead.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
