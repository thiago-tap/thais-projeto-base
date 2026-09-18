/**
 * Camada 2 — AuthService
 * Guarda o token JWT no localStorage e sabe se a pessoa está logada.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import type {
  DadosLogin,
  DadosTrocarSenha,
  RespostaLogin,
  Usuario,
} from '../modelos/usuario.modelo';

const CHAVE_TOKEN = 'painel_token';
const CHAVE_USUARIO = 'painel_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /** Signal com o usuário logado (ou null). Bom para a barra do menu. */
  readonly usuarioAtual = signal<Usuario | null>(this.lerUsuarioSalvo());

  /** Mensagem opcional na tela de login (ex.: sessão expirada). */
  readonly mensagemLogin = signal('');

  /** Envia e-mail/senha para a API e guarda o token se der certo. */
  entrar(dados: DadosLogin): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>('/api/auth/login', dados).pipe(
      tap((resposta) => {
        localStorage.setItem(CHAVE_TOKEN, resposta.token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
        this.usuarioAtual.set(resposta.usuario);
        this.mensagemLogin.set('');
      }),
    );
  }

  /** Troca a senha do usuário autenticado. */
  trocarSenha(dados: DadosTrocarSenha): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>('/api/auth/trocar-senha', dados);
  }

  /** Limpa o token e manda a pessoa de volta para o login. */
  sair(mensagem = ''): void {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    this.usuarioAtual.set(null);
    this.mensagemLogin.set(mensagem);
    void this.router.navigate(['/login']);
  }

  /** Usado pelo AuthGuard e pelo interceptor. */
  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  /** Devolve o JWT salvo (ou null). */
  obterToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  private lerUsuarioSalvo(): Usuario | null {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    if (!bruto) {
      return null;
    }
    try {
      return JSON.parse(bruto) as Usuario;
    } catch {
      return null;
    }
  }
}
