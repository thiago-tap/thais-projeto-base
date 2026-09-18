/**
 * Tela 3 — Cadastro de Usuário
 * Layout centralizado (padrão pagina-formulario) + migalha + ícones.
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
import { DestaqueService } from '../../servicos/destaque.service';
import { ToastService } from '../../servicos/toast.service';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule, Migalha, NgIcon],
  templateUrl: './cadastro-usuario.html',
})
export class CadastroUsuario implements PodeSairComFormularioSujo {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly toastService = inject(ToastService);
  private readonly destaqueService = inject(DestaqueService);
  private readonly router = inject(Router);

  readonly carregando = signal(false);
  readonly mensagemErro = signal('');
  /** Evita o alerta de “formulário sujo” após salvar com sucesso. */
  private salvouComSucesso = false;

  readonly itensMigalha: ItemMigalha[] = [
    { rotulo: 'Buscar', rota: '/usuarios' },
    { rotulo: 'Cadastrar' },
  ];

  readonly formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: this.formBuilder.nonNullable.control<'Administrador' | 'Usuário'>(
      'Usuário',
      Validators.required,
    ),
  });

  formularioEstaSujo(): boolean {
    return this.formulario.dirty && !this.salvouComSucesso;
  }

  enviar(): void {
    this.mensagemErro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemErro.set('Revise os campos destacados antes de salvar.');
      return;
    }

    this.carregando.set(true);

    this.usuarioService.cadastrarUsuario(this.formulario.getRawValue()).subscribe({
      next: (usuario) => {
        this.carregando.set(false);
        this.salvouComSucesso = true;
        this.formulario.markAsPristine();
        this.destaqueService.destacar(usuario.id);
        this.toastService.sucesso(`Usuário "${usuario.nome}" cadastrado.`);
        void this.router.navigate(['/usuarios']);
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Não foi possível cadastrar o usuário.'),
        );
      },
    });
  }

  campoInvalido(nome: 'nome' | 'email' | 'senha' | 'perfil'): boolean {
    const campo = this.formulario.controls[nome];
    return campo.invalid && campo.touched;
  }
}
