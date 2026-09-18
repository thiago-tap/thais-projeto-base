/**
 * Camada UI — Cabecalho
 * Componente separado do layout: marca, avatar, menu e sair.
 */

import { Component, OnInit, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { obterIniciais } from '../../comum/obter-iniciais';
import { AuthService } from '../../servicos/auth.service';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './cabecalho.html',
})
export class Cabecalho implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);

  /** O layout escuta este evento se quiser reação extra; o próprio cabeçalho já chama sair(). */
  readonly aoSair = output<void>();

  readonly usuarioAtual = this.authService.usuarioAtual;
  readonly totalUsuarios = this.usuarioService.totalUsuarios;

  get iniciais(): string {
    return obterIniciais(this.usuarioAtual()?.nome);
  }

  ngOnInit(): void {
    if (this.totalUsuarios() === 0) {
      this.usuarioService.buscarUsuarios().subscribe();
    }
  }

  sair(): void {
    this.aoSair.emit();
    this.authService.sair();
  }
}
