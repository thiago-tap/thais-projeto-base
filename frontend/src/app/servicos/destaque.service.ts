/**
 * Camada UX — Destaque na lista
 * Depois de cadastrar/editar, a busca destaca a linha por alguns segundos.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DestaqueService {
  readonly idDestacado = signal<string | null>(null);

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  destacar(id: string, milissegundos = 5000): void {
    this.idDestacado.set(id);

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.temporizador = setTimeout(() => {
      this.idDestacado.set(null);
      this.temporizador = null;
    }, milissegundos);
  }

  limpar(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
    this.idDestacado.set(null);
  }
}
