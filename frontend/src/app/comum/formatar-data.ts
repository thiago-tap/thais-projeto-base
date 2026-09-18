/**
 * Formata datas ISO da auditoria para exibição na aula (pt-BR).
 */

export function formatarDataHora(iso: string | undefined | null): string {
  if (!iso) {
    return '—';
  }
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) {
    return iso;
  }
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
