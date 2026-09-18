/**
 * Camada 2 — AuthService
 * Compara a senha com o hash do arquivo e emite um JWT simples (sem Passport).
 * Também troca a senha do usuário logado.
 */

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ArquivoBancoService } from '../banco/arquivo-banco.service.js';
import type { Usuario, UsuarioPublico } from '../comum/modelos/usuario.modelo.js';
import { LoginDto } from './dto/login.dto.js';
import { TrocarSenhaDto } from './dto/trocar-senha.dto.js';

/** Segredo didático — em produção viria de variável de ambiente. */
export const JWT_SEGREDO = 'painel-usuarios-aula-secreto';

export interface PayloadJwt {
  sub: string;
  email: string;
}

export interface RespostaLogin {
  token: string;
  usuario: UsuarioPublico;
}

@Injectable()
export class AuthService {
  constructor(private readonly arquivoBanco: ArquivoBancoService) {}

  /**
   * Valida e-mail/senha e devolve token + dados públicos do usuário.
   * Se falhar, lança 401 — a tela de login mostra a mensagem.
   */
  async entrar(dados: LoginDto): Promise<RespostaLogin> {
    const usuario = this.arquivoBanco.buscarPorEmail(dados.email);

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senhaHash);

    if (!senhaCorreta) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload: PayloadJwt = {
      sub: usuario.id,
      email: usuario.email,
    };

    const token = jwt.sign(payload, JWT_SEGREDO, { expiresIn: '8h' });

    return { token, usuario: this.paraPublico(usuario) };
  }

  /**
   * Troca a senha do usuário autenticado.
   * Exige a senha atual correta.
   */
  async trocarSenha(
    idUsuario: string,
    dados: TrocarSenhaDto,
  ): Promise<{ mensagem: string }> {
    const usuario = this.arquivoBanco.buscarPorId(idUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const senhaAtualCorreta = await bcrypt.compare(
      dados.senhaAtual,
      usuario.senhaHash,
    );

    if (!senhaAtualCorreta) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    const senhaHash = await bcrypt.hash(dados.senhaNova, 10);
    await this.arquivoBanco.atualizarUsuario(idUsuario, { senhaHash });

    return { mensagem: 'Senha alterada com sucesso.' };
  }

  /** Verifica o token e devolve o payload, ou lança 401. */
  validarToken(token: string): PayloadJwt {
    try {
      return jwt.verify(token, JWT_SEGREDO) as PayloadJwt;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

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
