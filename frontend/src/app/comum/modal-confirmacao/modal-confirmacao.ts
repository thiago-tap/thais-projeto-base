/**
 * Camada UI — ModalConfirmacao
 * Modal reutilizável para exclusão e outras confirmações destrutivas.
 * A tela só controla aberto/fechado e reage aos eventos.
 */

import { Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

export type TomModal = 'perigo' | 'padrao';

@Component({
  selector: 'app-modal-confirmacao',
  imports: [NgIcon],
  templateUrl: './modal-confirmacao.html',
})
export class ModalConfirmacao {
  readonly aberto = input(false);
  readonly titulo = input.required<string>();
  readonly mensagem = input.required<string>();
  readonly rotuloConfirmar = input('Confirmar');
  readonly rotuloCancelar = input('Cancelar');
  readonly carregando = input(false);
  readonly tom = input<TomModal>('perigo');
  readonly icone = input('lucideTrash2');

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  aoConfirmar(): void {
    if (!this.carregando()) {
      this.confirmar.emit();
    }
  }

  aoCancelar(): void {
    if (!this.carregando()) {
      this.cancelar.emit();
    }
  }

  /** Clique no fundo escuro = cancelar. */
  aoClicarFundo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.aoCancelar();
    }
  }
}
