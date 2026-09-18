/**
 * Tela 1 — Login
 * Rota pública. Mostra mensagem de sessão expirada se o interceptor redirecionou.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { extrairMensagemHttp } from '../../comum/extrair-mensagem-http';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly carregando = signal(false);
  readonly mensagemErro = signal('');
  readonly mensagemInfo = signal('');

  readonly formulario = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const msg = this.authService.mensagemLogin();
    if (msg) {
      this.mensagemInfo.set(msg);
      this.authService.mensagemLogin.set('');
    }
  }

  enviar(): void {
    this.mensagemErro.set('');
    this.mensagemInfo.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemErro.set('Preencha e-mail e senha corretamente.');
      return;
    }

    this.carregando.set(true);

    this.authService.entrar(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.carregando.set(false);
        void this.router.navigate(['/inicio']);
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Não foi possível entrar. Tente novamente.'),
        );
      },
    });
  }
}
