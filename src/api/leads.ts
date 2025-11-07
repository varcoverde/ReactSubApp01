import { apiClient } from './client.ts';
import type {
  CommentPayload,
  LeadDetail,
  LeadFilter,
  LeadSummary,
  LeadUpdatePayload
} from '../types/lead.ts';

export const fetchLeads = async (filtros: LeadFilter): Promise<LeadSummary[]> => {
  const { data } = await apiClient.get<LeadSummary[]>('/leads', {
    params: filtros
  });

  return data;
};

export const fetchLeadDetail = async (id: string): Promise<LeadDetail> => {
  const { data } = await apiClient.get<LeadDetail>(`/leads/${id}`);
  return data;
};

export const updateLead = async (
  id: string,
  payload: LeadUpdatePayload
): Promise<LeadDetail> => {
  const { data } = await apiClient.patch<LeadDetail>(`/leads/${id}`, payload);
  return data;
};

export const addLeadComment = async (
  id: string,
  payload: CommentPayload
): Promise<LeadDetail> => {
  const { data } = await apiClient.post<LeadDetail>(`/leads/${id}/comentarios`, payload);
  return data;
};
