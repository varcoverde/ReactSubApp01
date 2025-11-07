import { useState } from 'react';

import type { LeadFilter } from '../types/lead.ts';

const filtrosPadrao: LeadFilter = {
  status: 'todos'
};

export const useLeadFilters = () => {
  const [filtros, setFiltros] = useState<LeadFilter>(filtrosPadrao);

  const atualizarFiltro = <K extends keyof LeadFilter>(chave: K, valor: LeadFilter[K]) => {
    setFiltros((prev) => ({
      ...prev,
      [chave]: valor || undefined
    }));
  };

  const definirFiltros = (novosFiltros: LeadFilter) => {
    setFiltros(() => {
      const filtrados = Object.entries(novosFiltros).reduce<LeadFilter>((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key as keyof LeadFilter] = value as LeadFilter[keyof LeadFilter];
        }
        return acc;
      }, {} as LeadFilter);

      return { ...filtrosPadrao, ...filtrados };
    });
  };

  const limparFiltros = () => setFiltros(filtrosPadrao);

  return {
    filtros,
    atualizarFiltro,
    definirFiltros,
    limparFiltros
  };
};
