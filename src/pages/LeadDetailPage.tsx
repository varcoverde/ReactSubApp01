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
    return <p>Carregando informações do lead...</p>;
  }

  if (isError || !lead) {
    return <p>Não foi possível carregar os dados do lead.</p>;
  }

  return (
    <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
      <section className="card" style={{ flex: 2 }}>
        <header className="flex flex-between">
          <div>
            <h2 style={{ marginTop: 0 }}>{lead.nome}</h2>
            <p className="text-muted">{lead.email} • {lead.telefone}</p>
          </div>
          <StatusBadge status={lead.status} />
        </header>

        <div className="mt-md">
          <strong>Empresa:</strong> {lead.empresa}
        </div>
        <div className="mt-md">
          <strong>Campanha:</strong> {lead.campanha}
        </div>
        <div className="mt-md">
          <strong>Produto de interesse:</strong> {lead.produtoInteresse}
        </div>
        <div className="mt-md">
          <strong>Valor estimado:</strong> {formatCurrency(lead.valorEstimado)}
        </div>

        <form onSubmit={leadForm.handleSubmit(handleSubmitLead)} className="mt-lg">
          <div className="filters-grid">
            <Controller
              name="status"
              control={leadForm.control}
              render={({ field }) => (
                <div>
                  <label htmlFor="status">Status</label>
                  <select id="status" {...field}>
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
                <div>
                  <label htmlFor="observacoesInternas">Observações internas</label>
                  <textarea id="observacoesInternas" rows={4} placeholder="Notas internas e próximos passos" {...field} />
                </div>
              )}
            />
          </div>
          <button type="submit" className="mt-md" disabled={atualizarLeadMutation.isPending}>
            Salvar alterações
          </button>
        </form>
      </section>

      <aside className="card" style={{ flex: 1 }}>
        <h3 style={{ marginTop: 0 }}>Linha do tempo</h3>
        {timelineOrdenado.length ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {timelineOrdenado.map((item) => (
              <li key={item.id} style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600 }}>{item.descricao}</div>
                <div className="comment-date">
                  {new Date(item.criadoEm).toLocaleString('pt-BR')} • {item.criadoPor}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Ainda não há eventos registrados.</p>
        )}

        <section className="mt-lg">
          <header className="flex flex-between" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Comentários</h3>
            <button
              type="button"
              onClick={() => setComentarioAberto((prev) => !prev)}
              style={{ backgroundColor: '#1f2937' }}
            >
              {comentarioAberto ? 'Cancelar' : 'Adicionar'}
            </button>
          </header>
          {comentarioAberto && (
            <form onSubmit={comentarioForm.handleSubmit(handleSubmitComentario)} className="mt-md">
              <textarea
                placeholder="Escreva um novo comentário"
                rows={3}
                {...comentarioForm.register('conteudo', { required: true })}
              />
              <button type="submit" className="mt-md" disabled={adicionarComentarioMutation.isPending}>
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
