/**
 * Tela — Editar Usuário
 * Layout centralizado + migalha + confirmação se sair com formulário sujo.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { extrairMensagemHttp } from '../../comum/extrair-mensagem-http';
import { formatarDataHora } from '../../comum/formatar-data';
import { Migalha, type ItemMigalha } from '../../comum/migalha';
import type { PodeSairComFormularioSujo } from '../../guards/formulario-sujo.guard';
import { DestaqueService } from '../../servicos/destaque.service';
import { ToastService } from '../../servicos/toast.service';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  imports: [ReactiveFormsModule, RouterLink, Migalha, NgIcon],
  templateUrl: './editar-usuario.html',
})
export class EditarUsuario implements OnInit, PodeSairComFormularioSujo {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly destaqueService = inject(DestaqueService);

  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly mensagemErro = signal('');
  readonly criadoEm = signal('');
  readonly atualizadoEm = signal('');
  readonly nomeUsuario = signal('…');
  readonly formatarDataHora = formatarDataHora;

  private idUsuario = '';
  private salvouComSucesso = false;

  readonly formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    perfil: this.formBuilder.nonNullable.control<'Administrador' | 'Usuário'>(
      'Usuário',
      Validators.required,
    ),
  });

  get itensMigalha(): ItemMigalha[] {
    return [
      { rotulo: 'Buscar', rota: '/usuarios' },
      { rotulo: `Editar ${this.nomeUsuario()}` },
    ];
  }

  formularioEstaSujo(): boolean {
    return this.formulario.dirty && !this.salvouComSucesso;
  }

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.idUsuario) {
      void this.router.navigate(['/usuarios']);
      return;
    }

    this.usuarioService.buscarPorId(this.idUsuario).subscribe({
      next: (usuario) => {
        this.formulario.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
          senha: '',
        });
        this.formulario.markAsPristine();
        this.nomeUsuario.set(usuario.nome);
        this.criadoEm.set(usuario.criadoEm);
        this.atualizadoEm.set(usuario.atualizadoEm);
        this.carregando.set(false);
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Usuário não encontrado.'),
        );
      },
    });
  }

  enviar(): void {
    this.mensagemErro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemErro.set('Revise os campos antes de salvar.');
      return;
    }

    const bruto = this.formulario.getRawValue();
    const dados = {
      nome: bruto.nome,
      email: bruto.email,
      perfil: bruto.perfil,
      ...(bruto.senha.trim() ? { senha: bruto.senha.trim() } : {}),
    };

    this.salvando.set(true);
    this.usuarioService.atualizarUsuario(this.idUsuario, dados).subscribe({
      next: (usuario) => {
        this.salvando.set(false);
        this.salvouComSucesso = true;
        this.formulario.markAsPristine();
        this.destaqueService.destacar(usuario.id);
        this.toastService.sucesso(`Usuário "${usuario.nome}" atualizado.`);
        void this.router.navigate(['/usuarios']);
      },
      error: (erro: unknown) => {
        this.salvando.set(false);
        this.mensagemErro.set(
          extrairMensagemHttp(erro, 'Não foi possível salvar.'),
        );
      },
    });
  }

  campoInvalido(nome: 'nome' | 'email' | 'senha' | 'perfil'): boolean {
    const campo = this.formulario.controls[nome];
    return campo.invalid && campo.touched;
  }
}
