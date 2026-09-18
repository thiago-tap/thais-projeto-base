/**
 * Componente raiz — router-outlet + toasts globais.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './comum/toast-container';

@Component({
  imports: [RouterOutlet, ToastContainer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
