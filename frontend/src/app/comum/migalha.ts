/**
 * Camada UX — Migalha (breadcrumb)
 * Ex.: Buscar / Cadastrar — ajuda na orientação durante a aula.
 */

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ItemMigalha {
  rotulo: string;
  rota?: string | string[];
}

@Component({
  selector: 'app-migalha',
  imports: [RouterLink],
  templateUrl: './migalha.html',
})
export class Migalha {
  readonly itens = input.required<ItemMigalha[]>();
}
