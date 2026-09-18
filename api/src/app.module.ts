/**
 * AppModule — ponto de montagem da API.
 * Aqui ligamos autenticação, usuários e o serviço do arquivo JSON.
 */

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';

@Module({
  imports: [AuthModule, UsuariosModule],
})
export class AppModule {}
