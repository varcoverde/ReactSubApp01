import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchLeads } from '../api/leads.ts';
import { LeadFilters } from '../components/LeadFilters.tsx';
import { LeadTable } from '../components/LeadTable.tsx';
import { useLeadFilters } from '../hooks/useLeadFilters.ts';
import type { LeadFilter, LeadSummary } from '../types/lead.ts';

const limparStatusTodos = (filtros: LeadFilter) => {
  const { status, ...resto } = filtros;
  return {
    ...resto,
    ...(status && status !== 'todos' ? { status } : {})
  };
};

export const LeadSearchPage = () => {
  const { filtros, definirFiltros, limparFiltros } = useLeadFilters();

  const filtrosSanitizados = useMemo(() => limparStatusTodos(filtros), [filtros]);

  const { data: leads = [], isFetching } = useQuery<LeadSummary[]>({
    queryKey: ['leads', filtrosSanitizados],
    queryFn: () => fetchLeads(filtrosSanitizados),
    placeholderData: (previousData) => previousData
  });

  const handleSubmit = (novosFiltros: LeadFilter) => {
    definirFiltros(novosFiltros);
  };

  const handleReset = () => {
    limparFiltros();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Leads</h2>
        <p className="mt-1 text-sm text-slate-500">Acompanhe e filtre os leads gerados pelas campanhas.</p>
      </div>
      <LeadFilters valores={filtros} onSubmit={handleSubmit} onReset={handleReset} />
      <LeadTable leads={leads} carregando={isFetching} />
    </div>
  );
};
