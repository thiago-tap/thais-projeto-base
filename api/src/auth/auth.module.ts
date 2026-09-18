/**
 * Módulo de autenticação — agrupa login e a guarda JWT.
 */

import { Module } from '@nestjs/common';
import { BancoModule } from '../banco/banco.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Module({
  imports: [BancoModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, BancoModule, JwtAuthGuard],
})
export class AuthModule {}
