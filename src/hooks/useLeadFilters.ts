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
      const filtrados: LeadFilter = {};

      if (novosFiltros.busca) {
        filtrados.busca = novosFiltros.busca;
      }

      if (novosFiltros.status) {
        filtrados.status = novosFiltros.status;
      }

      if (novosFiltros.origem) {
        filtrados.origem = novosFiltros.origem;
      }

      if (novosFiltros.dataInicial) {
        filtrados.dataInicial = novosFiltros.dataInicial;
      }

      if (novosFiltros.dataFinal) {
        filtrados.dataFinal = novosFiltros.dataFinal;
      }

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
