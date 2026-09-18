/**
 * Camada 3 — UsuariosService
 * Busca (filtro + ordenação), cadastro, detalhe, edição e exclusão.
 */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ArquivoBancoService } from '../banco/arquivo-banco.service.js';
import type {
  PerfilUsuario,
  Usuario,
  UsuarioPublico,
} from '../comum/modelos/usuario.modelo.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';

export type OrdenacaoUsuarios = 'nome' | 'nome-desc';

export interface FiltrosBuscaUsuarios {
  busca?: string;
  perfil?: PerfilUsuario;
  ordenar?: OrdenacaoUsuarios;
}

@Injectable()
export class UsuariosService {
  constructor(private readonly arquivoBanco: ArquivoBancoService) {}

  /**
   * Lista usuários sem o hash da senha.
   * Filtros: texto (nome/e-mail), perfil e ordenação por nome.
   */
  buscarUsuarios(filtros: FiltrosBuscaUsuarios = {}): UsuarioPublico[] {
    let lista = this.arquivoBanco.listarUsuarios();
    const termo = filtros.busca?.trim().toLowerCase();

    if (termo) {
      lista = lista.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(termo) ||
          usuario.email.toLowerCase().includes(termo),
      );
    }

    if (filtros.perfil) {
      lista = lista.filter((usuario) => usuario.perfil === filtros.perfil);
    }

    const ordenar = filtros.ordenar ?? 'nome';
    lista = [...lista].sort((a, b) => {
      const comparacao = a.nome.localeCompare(b.nome, 'pt-BR', {
        sensitivity: 'base',
      });
      return ordenar === 'nome-desc' ? -comparacao : comparacao;
    });

    return lista.map((usuario) => this.paraPublico(usuario));
  }

  /** Detalhe de um usuário (tela de edição). */
  buscarPorId(id: string): UsuarioPublico {
    const usuario = this.arquivoBanco.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return this.paraPublico(usuario);
  }

  /**
   * Cadastra um novo usuário.
   * E-mail duplicado → 409 Conflict.
   */
  async cadastrarUsuario(dados: CriarUsuarioDto): Promise<UsuarioPublico> {
    const emailExistente = this.arquivoBanco.buscarPorEmail(dados.email);

    if (emailExistente) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const criado = await this.arquivoBanco.adicionarUsuario({
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senhaHash,
      perfil: dados.perfil,
    });

    return this.paraPublico(criado);
  }

  /**
   * Atualiza nome, e-mail e perfil.
   * Senha só muda se vier preenchida no DTO.
   */
  async atualizarUsuario(
    id: string,
    dados: AtualizarUsuarioDto,
  ): Promise<UsuarioPublico> {
    const existente = this.arquivoBanco.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const emailNormalizado = dados.email.trim().toLowerCase();
    const outroComMesmoEmail = this.arquivoBanco.buscarPorEmail(emailNormalizado);
    if (outroComMesmoEmail && outroComMesmoEmail.id !== id) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const alteracoes: Partial<Omit<Usuario, 'id' | 'criadoEm'>> = {
      nome: dados.nome.trim(),
      email: emailNormalizado,
      perfil: dados.perfil,
    };

    if (dados.senha && dados.senha.trim().length > 0) {
      alteracoes.senhaHash = await bcrypt.hash(dados.senha, 10);
    }

    const atualizado = await this.arquivoBanco.atualizarUsuario(id, alteracoes);
    return this.paraPublico(atualizado);
  }

  /**
   * Remove um usuário.
   * Bloqueia se o id for o do usuário logado (não se autoexcluir).
   */
  async excluirUsuario(id: string, idUsuarioLogado: string): Promise<void> {
    if (id === idUsuarioLogado) {
      throw new BadRequestException(
        'Você não pode excluir a própria conta enquanto estiver logado.',
      );
    }

    const existente = this.arquivoBanco.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.arquivoBanco.removerUsuario(id);
  }

  /** Remove o campo sensível antes de responder ao cliente. */
  private paraPublico(usuario: Usuario): UsuarioPublico {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      criadoEm: usuario.criadoEm,
      atualizadoEm: usuario.atualizadoEm,
    };
  }
}
