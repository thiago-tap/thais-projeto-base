/**
 * Tela — Perfil da conta logada
 * Mostra dados públicos do usuário atual + atalho para trocar senha.
 */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { formatarDataHora } from '../../comum/formatar-data';
import { Migalha, type ItemMigalha } from '../../comum/migalha';
import { obterIniciais } from '../../comum/obter-iniciais';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, NgIcon, Migalha],
  templateUrl: './perfil.html',
})
export class Perfil {
  private readonly authService = inject(AuthService);

  readonly usuarioAtual = this.authService.usuarioAtual;
  readonly formatarDataHora = formatarDataHora;

  readonly itensMigalha: ItemMigalha[] = [
    { rotulo: 'Início', rota: '/inicio' },
    { rotulo: 'Perfil' },
  ];

  get iniciais(): string {
    return obterIniciais(this.usuarioAtual()?.nome);
  }
}
