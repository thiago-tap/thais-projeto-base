/**
 * Utilitário — iniciais do nome para o avatar do cabeçalho.
 */

export function obterIniciais(nome: string | null | undefined): string {
  const texto = nome?.trim() ?? '';
  if (!texto) {
    return '?';
  }
  const partes = texto.split(/\s+/).filter(Boolean);
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
