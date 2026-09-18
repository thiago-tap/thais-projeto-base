/**
 * Camada 2c — AuthController
 * POST /api/auth/login — pública
 * POST /api/auth/trocar-senha — protegida (JWT)
 */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, type RespostaLogin } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { TrocarSenhaDto } from './dto/trocar-senha.dto.js';
import { JwtAuthGuard, type RequisicaoComUsuario } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dados: LoginDto): Promise<RespostaLogin> {
    return this.authService.entrar(dados);
  }

  @Post('trocar-senha')
  @UseGuards(JwtAuthGuard)
  async trocarSenha(
    @Body() dados: TrocarSenhaDto,
    @Req() requisicao: RequisicaoComUsuario,
  ): Promise<{ mensagem: string }> {
    const idUsuario = requisicao.usuarioJwt?.sub ?? '';
    return this.authService.trocarSenha(idUsuario, dados);
  }
}
