/**
 * Camada 2b — JwtAuthGuard
 * Guarda de rota do Nest: exige Authorization: Bearer <token>.
 * Sem Passport — só lemos o header e validamos com o AuthService.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type PayloadJwt } from './auth.service.js';

export type RequisicaoComUsuario = Request & { usuarioJwt?: PayloadJwt };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const requisicao = context.switchToHttp().getRequest<RequisicaoComUsuario>();
    const cabecalho = requisicao.headers.authorization;

    if (!cabecalho?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'É necessário estar autenticado para acessar este recurso.',
      );
    }

    const token = cabecalho.slice('Bearer '.length).trim();
    const payload = this.authService.validarToken(token);
    requisicao.usuarioJwt = payload;
    return true;
  }
}
