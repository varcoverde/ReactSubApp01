import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchLeads } from '../api/leads.ts';
import { LeadFilters } from '../components/LeadFilters.tsx';
import { LeadTable } from '../components/LeadTable.tsx';
import { useLeadFilters } from '../hooks/useLeadFilters.ts';
import type { LeadFilter } from '../types/lead.ts';

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

  const { data: leads = [], isFetching } = useQuery({
    queryKey: ['leads', filtrosSanitizados],
    queryFn: () => fetchLeads(filtrosSanitizados),
    keepPreviousData: true
  });

  const handleSubmit = (novosFiltros: LeadFilter) => {
    definirFiltros(novosFiltros);
  };

  const handleReset = () => {
    limparFiltros();
  };

  return (
    <div>
      <LeadFilters valores={filtros} onSubmit={handleSubmit} onReset={handleReset} />
      <LeadTable leads={leads} carregando={isFetching} />
    </div>
  );
};
