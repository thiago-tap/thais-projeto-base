/**
 * Extrai mensagem amigável de erros HTTP do Nest.
 */

import { HttpErrorResponse } from '@angular/common/http';

export function extrairMensagemHttp(
  erro: unknown,
  padrao = 'Ocorreu um erro. Tente novamente.',
): string {
  if (erro instanceof HttpErrorResponse) {
    const corpo = erro.error as { message?: string | string[] } | null;
    if (typeof corpo?.message === 'string') {
      return corpo.message;
    }
    if (Array.isArray(corpo?.message)) {
      return corpo.message.join(' ');
    }
    if (erro.status === 0) {
      return 'Não foi possível conectar à API. Ela está rodando na porta 3000?';
    }
  }
  return padrao;
}
