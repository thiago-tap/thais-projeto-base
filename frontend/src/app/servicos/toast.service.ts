/**
 * Camada UX — ToastService
 * Mostra mensagens rápidas de sucesso/erro sem libs externas.
 */

import { Injectable, signal } from '@angular/core';

export type TipoToast = 'sucesso' | 'erro' | 'info';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: TipoToast;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private proximoId = 1;

  readonly toasts = signal<Toast[]>([]);

  mostrar(mensagem: string, tipo: TipoToast = 'info'): void {
    const id = this.proximoId++;
    this.toasts.update((lista) => [...lista, { id, mensagem, tipo }]);

    setTimeout(() => this.fechar(id), 4000);
  }

  sucesso(mensagem: string): void {
    this.mostrar(mensagem, 'sucesso');
  }

  erro(mensagem: string): void {
    this.mostrar(mensagem, 'erro');
  }

  fechar(id: number): void {
    this.toasts.update((lista) => lista.filter((toast) => toast.id !== id));
  }
}
