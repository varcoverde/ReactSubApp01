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
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Controller
          name="busca"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="busca" className="text-sm font-semibold text-slate-700">
                Buscar
              </label>
              <input
                id="busca"
                placeholder="Nome, email ou telefone"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                id="status"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...field}
              >
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
            <div className="space-y-2">
              <label htmlFor="origem" className="text-sm font-semibold text-slate-700">
                Origem
              </label>
              <input
                id="origem"
                placeholder="Campanha, landing page..."
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="dataInicial"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="dataInicial" className="text-sm font-semibold text-slate-700">
                Data inicial
              </label>
              <input
                id="dataInicial"
                type="date"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="dataFinal"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="dataFinal" className="text-sm font-semibold text-slate-700">
                Data final
              </label>
              <input
                id="dataFinal"
                type="date"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...field}
              />
            </div>
          )}
        />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Limpar filtros
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          Aplicar
        </button>
      </div>
    </form>
  );
};
