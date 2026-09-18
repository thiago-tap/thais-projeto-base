/**
 * Módulo do “banco” em arquivo JSON.
 * Exporta ArquivoBancoService para Auth e Usuarios usarem a mesma instância.
 */

import { Module } from '@nestjs/common';
import { ArquivoBancoService } from './arquivo-banco.service.js';

@Module({
  providers: [ArquivoBancoService],
  exports: [ArquivoBancoService],
})
export class BancoModule {}
