/**
 * Guarda CanDeactivate — avisa se o formulário tiver alterações não salvas.
 */

import { CanDeactivateFn } from '@angular/router';

export interface PodeSairComFormularioSujo {
  formularioEstaSujo(): boolean;
}

export const formularioSujoGuard: CanDeactivateFn<
  PodeSairComFormularioSujo
> = (componente) => {
  if (!componente.formularioEstaSujo()) {
    return true;
  }

  return window.confirm(
    'Você tem alterações não salvas. Deseja sair desta tela mesmo assim?',
  );
};
