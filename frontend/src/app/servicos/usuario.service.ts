/**
 * Camada 3 — UsuarioService
 * Único ponto que fala com a API de usuários (CRUD completo).
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type {
  DadosAtualizacao,
  DadosCadastro,
  FiltrosBuscaUsuarios,
  Usuario,
} from '../modelos/usuario.modelo';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  /** Contagem da última lista carregada — usada no badge do menu. */
  readonly totalUsuarios = signal(0);

  /** Lista com filtros de texto, perfil e ordenação. */
  buscarUsuarios(filtros: FiltrosBuscaUsuarios = {}): Observable<Usuario[]> {
    let params = new HttpParams();
    if (filtros.busca?.trim()) {
      params = params.set('busca', filtros.busca.trim());
    }
    if (filtros.perfil) {
      params = params.set('perfil', filtros.perfil);
    }
    if (filtros.ordenar) {
      params = params.set('ordenar', filtros.ordenar);
    }
    return this.http.get<Usuario[]>('/api/usuarios', { params }).pipe(
      tap((lista) => this.totalUsuarios.set(lista.length)),
    );
  }

  /** Detalhe para a tela de edição. */
  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`/api/usuarios/${id}`);
  }

  /** Cadastra um novo usuário. */
  cadastrarUsuario(dados: DadosCadastro): Observable<Usuario> {
    return this.http.post<Usuario>('/api/usuarios', dados);
  }

  /** Atualiza um usuário existente. */
  atualizarUsuario(id: string, dados: DadosAtualizacao): Observable<Usuario> {
    return this.http.put<Usuario>(`/api/usuarios/${id}`, dados);
  }

  /** Exclui um usuário (a API bloqueia autoexclusão). */
  excluirUsuario(id: string): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(`/api/usuarios/${id}`);
  }
}
