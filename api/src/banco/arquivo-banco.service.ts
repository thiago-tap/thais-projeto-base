/**
 * Camada 1 — ArquivoBancoService
 * Em vez de PostgreSQL/MySQL, lemos e gravamos um arquivo JSON.
 * Fluxo: ler arquivo → alterar em memória → gravar de volta.
 */

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { BancoDados, Usuario } from '../comum/modelos/usuario.modelo.js';

@Injectable()
export class ArquivoBancoService implements OnModuleInit {
  /** Caminho absoluto do arquivo que simula o banco de dados. */
  private readonly caminhoArquivo =
    process.env.CAMINHO_BANCO ?? join(process.cwd(), 'dados', 'banco.json');

  private banco: BancoDados = { usuarios: [] };

  /** Ao iniciar a API, carrega o JSON para a memória. */
  async onModuleInit(): Promise<void> {
    await this.carregarDoArquivo();
  }

  /** Lê o arquivo disco e atualiza a cópia em memória. */
  async carregarDoArquivo(): Promise<void> {
    const conteudo = await fs.readFile(this.caminhoArquivo, 'utf-8');
    this.banco = JSON.parse(conteudo) as BancoDados;
  }

  /** Persiste a cópia em memória de volta no arquivo JSON. */
  async salvarNoArquivo(): Promise<void> {
    const conteudo = JSON.stringify(this.banco, null, 2);
    await fs.writeFile(this.caminhoArquivo, conteudo, 'utf-8');
  }

  /** Devolve uma cópia da lista de usuários (evita mutação acidental). */
  listarUsuarios(): Usuario[] {
    return [...this.banco.usuarios];
  }

  /** Busca um usuário pelo e-mail (login e validação de duplicidade). */
  buscarPorEmail(email: string): Usuario | undefined {
    const emailNormalizado = email.trim().toLowerCase();
    return this.banco.usuarios.find(
      (usuario) => usuario.email.toLowerCase() === emailNormalizado,
    );
  }

  /** Busca um usuário pelo id. */
  buscarPorId(id: string): Usuario | undefined {
    return this.banco.usuarios.find((usuario) => usuario.id === id);
  }

  /**
   * Adiciona um usuário e grava o arquivo.
   * O id é gerado com base no maior id numérico existente + 1.
   */
  async adicionarUsuario(
    usuarioSemId: Omit<Usuario, 'id' | 'criadoEm' | 'atualizadoEm'> &
      Partial<Pick<Usuario, 'criadoEm' | 'atualizadoEm'>>,
  ): Promise<Usuario> {
    const maiorId = this.banco.usuarios.reduce((maior, usuario) => {
      const numero = Number.parseInt(usuario.id, 10);
      return Number.isNaN(numero) ? maior : Math.max(maior, numero);
    }, 0);

    const agora = new Date().toISOString();
    const novoUsuario: Usuario = {
      id: String(maiorId + 1),
      nome: usuarioSemId.nome,
      email: usuarioSemId.email,
      senhaHash: usuarioSemId.senhaHash,
      perfil: usuarioSemId.perfil,
      criadoEm: usuarioSemId.criadoEm ?? agora,
      atualizadoEm: usuarioSemId.atualizadoEm ?? agora,
    };

    this.banco.usuarios.push(novoUsuario);
    await this.salvarNoArquivo();
    return novoUsuario;
  }

  /**
   * Atualiza campos de um usuário existente e grava o arquivo.
   * Sempre renova atualizadoEm.
   */
  async atualizarUsuario(
    id: string,
    alteracoes: Partial<Omit<Usuario, 'id' | 'criadoEm'>>,
  ): Promise<Usuario> {
    const indice = this.banco.usuarios.findIndex((usuario) => usuario.id === id);

    if (indice < 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const atual = this.banco.usuarios[indice];
    const atualizado: Usuario = {
      ...atual,
      ...alteracoes,
      id: atual.id,
      criadoEm: atual.criadoEm,
      atualizadoEm: new Date().toISOString(),
    };

    this.banco.usuarios[indice] = atualizado;
    await this.salvarNoArquivo();
    return atualizado;
  }

  /** Remove um usuário pelo id e grava o arquivo. */
  async removerUsuario(id: string): Promise<void> {
    const indice = this.banco.usuarios.findIndex((usuario) => usuario.id === id);

    if (indice < 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    this.banco.usuarios.splice(indice, 1);
    await this.salvarNoArquivo();
  }
}
