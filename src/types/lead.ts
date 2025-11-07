export type LeadStatus = 'novo' | 'em_andamento' | 'convertido' | 'perdido';

export interface LeadSummary {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  status: LeadStatus;
  origem: string;
  criadoEm: string;
}

export interface LeadDetail extends LeadSummary {
  campanha: string;
  produtoInteresse: string;
  valorEstimado: number;
  observacoesInternas?: string;
  comentarios: LeadComment[];
  historico: LeadTimelineEntry[];
}

export interface LeadComment {
  id: string;
  autor: string;
  conteudo: string;
  criadoEm: string;
}

export interface LeadTimelineEntry {
  id: string;
  descricao: string;
  criadoEm: string;
  criadoPor: string;
}

export interface LeadFilter {
  busca?: string;
  status?: LeadStatus | 'todos';
  origem?: string;
  dataInicial?: string;
  dataFinal?: string;
}

export interface LeadUpdatePayload {
  status?: LeadStatus;
  observacoesInternas?: string;
}

export interface CommentPayload {
  conteudo: string;
}
