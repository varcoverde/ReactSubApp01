import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { addLeadComment, fetchLeadDetail, updateLead } from '../api/leads.ts';
import { CommentList } from '../components/CommentList.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import type { CommentPayload, LeadDetail, LeadUpdatePayload } from '../types/lead.ts';
import { formatCurrency } from '../utils/number.ts';

interface LeadFormValues {
  status: LeadUpdatePayload['status'];
  observacoesInternas: LeadUpdatePayload['observacoesInternas'];
}

interface CommentForm {
  conteudo: string;
}

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [comentarioAberto, setComentarioAberto] = useState(false);

  const {
    data: lead,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => fetchLeadDetail(id!),
    enabled: Boolean(id)
  });

  const leadForm = useForm<LeadFormValues>({
    defaultValues: {
      status: 'novo',
      observacoesInternas: ''
    }
  });

  useEffect(() => {
    if (lead) {
      leadForm.reset({
        status: lead.status,
        observacoesInternas: lead.observacoesInternas ?? ''
      });
    }
  }, [lead, leadForm]);

  const comentarioForm = useForm<CommentForm>({
    defaultValues: { conteudo: '' }
  });

  const atualizarLeadMutation = useMutation({
    mutationFn: (payload: LeadUpdatePayload) => updateLead(id!, payload),
    onSuccess: (dadosAtualizados) => {
      queryClient.setQueryData<LeadDetail>(['lead', id], dadosAtualizados);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const adicionarComentarioMutation = useMutation({
    mutationFn: (payload: CommentPayload) => addLeadComment(id!, payload),
    onSuccess: (dadosAtualizados) => {
      comentarioForm.reset();
      setComentarioAberto(false);
      queryClient.setQueryData<LeadDetail>(['lead', id], dadosAtualizados);
    }
  });

  const handleSubmitLead = (dados: LeadFormValues) => {
    atualizarLeadMutation.mutate(dados);
  };

  const handleSubmitComentario = (dados: CommentForm) => {
    adicionarComentarioMutation.mutate(dados);
  };

  const timelineOrdenado = useMemo(
    () =>
      lead?.historico?.slice().sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()) ?? [],
    [lead?.historico]
  );

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando informações do lead...</p>;
  }

  if (isError || !lead) {
    return <p className="text-sm text-slate-500">Não foi possível carregar os dados do lead.</p>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="flex-1 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{lead.nome}</h2>
            <p className="text-sm text-slate-500">
              {lead.email} • {lead.telefone}
            </p>
          </div>
          <StatusBadge status={lead.status} />
        </header>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Empresa</dt>
            <dd className="text-base text-slate-700">{lead.empresa}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campanha</dt>
            <dd className="text-base text-slate-700">{lead.campanha}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Produto de interesse</dt>
            <dd className="text-base text-slate-700">{lead.produtoInteresse}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor estimado</dt>
            <dd className="text-base text-slate-700">{formatCurrency(lead.valorEstimado)}</dd>
          </div>
        </dl>

        <form
          onSubmit={leadForm.handleSubmit(handleSubmitLead)}
          className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900">Atualizar lead</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Controller
              name="status"
              control={leadForm.control}
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
                    <option value="novo">Novo</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="convertido">Convertido</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="observacoesInternas"
              control={leadForm.control}
              render={({ field }) => (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="observacoesInternas" className="text-sm font-semibold text-slate-700">
                    Observações internas
                  </label>
                  <textarea
                    id="observacoesInternas"
                    rows={4}
                    placeholder="Notas internas e próximos passos"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    {...field}
                  />
                </div>
              )}
            />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={atualizarLeadMutation.isPending}
          >
            Salvar alterações
          </button>
        </form>
      </section>

      <aside className="flex-1 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
        <h3 className="text-lg font-semibold text-slate-900">Linha do tempo</h3>
        {timelineOrdenado.length ? (
          <ul className="mt-4 space-y-4">
            {timelineOrdenado.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="font-semibold text-slate-800">{item.descricao}</div>
                <div className="text-xs text-slate-500">
                  {new Date(item.criadoEm).toLocaleString('pt-BR')} • {item.criadoPor}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Ainda não há eventos registrados.</p>
        )}

        <section className="mt-8">
          <header className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Comentários</h3>
            <button
              type="button"
              onClick={() => setComentarioAberto((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {comentarioAberto ? 'Cancelar' : 'Adicionar'}
            </button>
          </header>
          {comentarioAberto && (
            <form onSubmit={comentarioForm.handleSubmit(handleSubmitComentario)} className="space-y-3">
              <textarea
                placeholder="Escreva um novo comentário"
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...comentarioForm.register('conteudo', { required: true })}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={adicionarComentarioMutation.isPending}
              >
                Registrar comentário
              </button>
            </form>
          )}
          <CommentList comentarios={lead.comentarios} />
        </section>
      </aside>
    </div>
  );
};
