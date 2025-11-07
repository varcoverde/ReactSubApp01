import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import type { LeadFilter } from '../types/lead.ts';

interface LeadFiltersProps {
  valores: LeadFilter;
  onSubmit: (valores: LeadFilter) => void;
  onReset: () => void;
}

export const LeadFilters = ({ valores, onSubmit, onReset }: LeadFiltersProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<LeadFilter>({
    defaultValues: valores
  });

  useEffect(() => {
    reset(valores);
  }, [reset, valores]);

  const submitHandler = (data: LeadFilter) => {
    onSubmit(data);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="filters-grid">
        <Controller
          name="busca"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="busca">Buscar</label>
              <input id="busca" placeholder="Nome, email ou telefone" {...field} />
            </div>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" {...field}>
                <option value="todos">Todos</option>
                <option value="novo">Novo</option>
                <option value="em_andamento">Em andamento</option>
                <option value="convertido">Convertido</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>
          )}
        />
        <Controller
          name="origem"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="origem">Origem</label>
              <input id="origem" placeholder="Campanha, landing page..." {...field} />
            </div>
          )}
        />
        <Controller
          name="dataInicial"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="dataInicial">Data inicial</label>
              <input id="dataInicial" type="date" {...field} />
            </div>
          )}
        />
        <Controller
          name="dataFinal"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="dataFinal">Data final</label>
              <input id="dataFinal" type="date" {...field} />
            </div>
          )}
        />
      </div>
      <div className="flex flex-between mt-md">
        <button type="button" onClick={handleReset} style={{ backgroundColor: '#f1f5f9', color: '#1f2937' }}>
          Limpar filtros
        </button>
        <button type="submit" disabled={isSubmitting}>
          Aplicar
        </button>
      </div>
    </form>
  );
};
