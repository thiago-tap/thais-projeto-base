/**
 * Página 404 — rota desconhecida.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-nao-encontrada',
  imports: [RouterLink, NgIcon],
  templateUrl: './nao-encontrada.html',
})
export class NaoEncontrada {}
