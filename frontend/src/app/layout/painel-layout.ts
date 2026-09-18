/**
 * Layout do painel — só monta as peças:
 * Cabecalho + conteúdo (router-outlet) + Rodape
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './cabecalho/cabecalho';
import { Rodape } from './rodape/rodape';

@Component({
  selector: 'app-painel-layout',
  imports: [RouterOutlet, Cabecalho, Rodape],
  templateUrl: './painel-layout.html',
})
export class PainelLayout {}
