/**
 * Camada 3b — UsuariosController
 * Rotas protegidas: listar, detalhar, cadastrar, editar e excluir.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  type RequisicaoComUsuario,
} from '../auth/jwt-auth.guard.js';
import type {
  PerfilUsuario,
  UsuarioPublico,
} from '../comum/modelos/usuario.modelo.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import {
  type OrdenacaoUsuarios,
  UsuariosService,
} from './usuarios.service.js';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  buscarUsuarios(
    @Query('busca') busca?: string,
    @Query('perfil') perfil?: PerfilUsuario,
    @Query('ordenar') ordenar?: OrdenacaoUsuarios,
  ): UsuarioPublico[] {
    return this.usuariosService.buscarUsuarios({ busca, perfil, ordenar });
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string): UsuarioPublico {
    return this.usuariosService.buscarPorId(id);
  }

  @Post()
  async cadastrarUsuario(
    @Body() dados: CriarUsuarioDto,
  ): Promise<UsuarioPublico> {
    return this.usuariosService.cadastrarUsuario(dados);
  }

  @Put(':id')
  async atualizarUsuario(
    @Param('id') id: string,
    @Body() dados: AtualizarUsuarioDto,
  ): Promise<UsuarioPublico> {
    return this.usuariosService.atualizarUsuario(id, dados);
  }

  @Delete(':id')
  async excluirUsuario(
    @Param('id') id: string,
    @Req() requisicao: RequisicaoComUsuario,
  ): Promise<{ mensagem: string }> {
    const idLogado = requisicao.usuarioJwt?.sub ?? '';
    await this.usuariosService.excluirUsuario(id, idLogado);
    return { mensagem: 'Usuário excluído com sucesso.' };
  }
}
