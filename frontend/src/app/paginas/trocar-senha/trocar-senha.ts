/**
 * Tela — Trocar senha da conta logada
 */

import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { extrairMensagemHttp } from '../../comum/extrair-mensagem-http';
import { Migalha, type ItemMigalha } from '../../comum/migalha';
import type { PodeSairComFormularioSujo } from '../../guards/formulario-sujo.guard';
import { AuthService } from '../../servicos/auth.service';
import { ToastService } from '../../servicos/toast.service';

@Component({
  selector: 'app-trocar-senha',
  imports: [ReactiveFormsModule, Migalha, NgIcon],
  templateUrl: './trocar-senha.html',
})
export class TrocarSenha implements PodeSairComFormularioSujo {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly salvando = signal(false);
  readonly mensagemErro = signal('');
  private salvouComSucesso = false;

  readonly itensMigalha: ItemMigalha[] = [
    { rotulo: 'Buscar', rota: '/usuarios' },
    { rotulo: 'Trocar senha' },
  ];

  readonly formulario = this.formBuilder.nonNullable.group({
    senhaAtual: ['', [Validators.required, Validators.minLength(6)]],
    senhaNova: ['', [Validators.required, Validators.minLength(6)]],
  });

  formularioEstaSujo(): boolean {
    return this.formulario.dirty && !this.salvouComSucesso;
  }

  enviar(): void {
    this.mensagemErro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemErro.set('Preencha as duas senhas (mínimo 6 caracteres).');
      return;
    }

    this.salvando.set(true);
    this.authService.trocarSenha(this.formulario.getRawValue()).subscribe({
      next: (resposta) => {
        this.salvando.set(false);
        this.salvouComSucesso = true;
        this.formulario.markAsPristine();
        this.toastService.sucesso(resposta.mensagem);
        this.formulario.reset();
        void this.router.navigate(['/usuarios']);
      },
      error: (erro: unknown) => {
        this.salvando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Não foi possível alterar a senha.'),
        );
      },
    });
  }
}
