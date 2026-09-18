/**
 * Camada UI — Rodape
 * Componente separado: créditos da aula + links rápidos.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-rodape',
  imports: [RouterLink, NgIcon],
  templateUrl: './rodape.html',
})
export class Rodape {
  readonly anoAtual = new Date().getFullYear();
}
