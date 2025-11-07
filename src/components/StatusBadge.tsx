import type { LeadStatus } from '../types/lead.ts';

const statusMap: Record<LeadStatus, { label: string; className: string }> = {
  novo: {
    label: 'Novo',
    className: 'inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700'
  },
  em_andamento: {
    label: 'Em andamento',
    className: 'inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
  },
  convertido: {
    label: 'Convertido',
    className: 'inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
  },
  perdido: {
    label: 'Perdido',
    className: 'inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'
  }
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const statusInfo = statusMap[status];

  return <span className={statusInfo.className}>{statusInfo.label}</span>;
};
