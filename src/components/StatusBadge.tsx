import type { LeadStatus } from '../types/lead.ts';

const statusMap: Record<LeadStatus, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'badge badge-success' },
  em_andamento: { label: 'Em andamento', className: 'badge badge-warning' },
  convertido: { label: 'Convertido', className: 'badge badge-success' },
  perdido: { label: 'Perdido', className: 'badge badge-danger' }
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const statusInfo = statusMap[status];

  return <span className={statusInfo.className}>{statusInfo.label}</span>;
};
