/**
 * Tela — Início (dashboard didático)
 * Resumo do sistema: totais, atalhos e últimas pessoas da lista.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { extrairMensagemHttp } from '../../comum/extrair-mensagem-http';
import { formatarDataHora } from '../../comum/formatar-data';
import type { Usuario } from '../../modelos/usuario.modelo';
import { AuthService } from '../../servicos/auth.service';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, NgIcon],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);

  readonly carregando = signal(true);
  readonly mensagemErro = signal('');
  readonly total = signal(0);
  readonly totalAdmins = signal(0);
  readonly totalUsuariosComuns = signal(0);
  readonly recentes = signal<Usuario[]>([]);
  readonly usuarioAtual = this.authService.usuarioAtual;
  readonly formatarDataHora = formatarDataHora;

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.usuarioService.buscarUsuarios({ ordenar: 'nome' }).subscribe({
      next: (lista) => {
        this.total.set(lista.length);
        this.totalAdmins.set(
          lista.filter((u) => u.perfil === 'Administrador').length,
        );
        this.totalUsuariosComuns.set(
          lista.filter((u) => u.perfil === 'Usuário').length,
        );
        const ordenadosPorData = [...lista].sort(
          (a, b) =>
            new Date(b.atualizadoEm).getTime() -
            new Date(a.atualizadoEm).getTime(),
        );
        this.recentes.set(ordenadosPorData.slice(0, 5));
        this.carregando.set(false);
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Não foi possível carregar o resumo.'),
        );
      },
    });
  }
}
