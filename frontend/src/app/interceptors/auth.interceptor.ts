/**
 * Camada 4 — authInterceptor
 * 1) Anexa Bearer token
 * 2) Se a API responder 401 (exceto no login), encerra a sessão
 */

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicos/auth.service';

export const authInterceptor: HttpInterceptorFn = (requisicao, next) => {
  const authService = inject(AuthService);
  const token = authService.obterToken();
  const ehLogin = requisicao.url.includes('/api/auth/login');

  const requisicaoFinal = token
    ? requisicao.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : requisicao;

  return next(requisicaoFinal).pipe(
    catchError((erro: unknown) => {
      if (
        erro instanceof HttpErrorResponse &&
        erro.status === 401 &&
        !ehLogin &&
        authService.estaAutenticado()
      ) {
        authService.sair('Sessão expirada. Entre novamente.');
      }
      return throwError(() => erro);
    }),
  );
};
