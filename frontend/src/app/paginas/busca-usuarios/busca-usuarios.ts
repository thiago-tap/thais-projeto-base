/**
 * Tela 2 — Busca de Usuários
 * Filtros, destaque pós-salvar, empty state rico e ícones nas ações.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { extrairMensagemHttp } from '../../comum/extrair-mensagem-http';
import { formatarDataHora } from '../../comum/formatar-data';
import { ModalConfirmacao } from '../../comum/modal-confirmacao/modal-confirmacao';
import type {
  OrdenacaoUsuarios,
  PerfilUsuario,
  Usuario,
} from '../../modelos/usuario.modelo';
import { AuthService } from '../../servicos/auth.service';
import { DestaqueService } from '../../servicos/destaque.service';
import { ToastService } from '../../servicos/toast.service';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-busca-usuarios',
  imports: [FormsModule, RouterLink, NgIcon, ModalConfirmacao],
  templateUrl: './busca-usuarios.html',
})
export class BuscaUsuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly destaqueService = inject(DestaqueService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly termoBusca = signal('');
  readonly filtroPerfil = signal<PerfilUsuario | ''>('');
  readonly ordenar = signal<OrdenacaoUsuarios>('nome');
  readonly carregando = signal(false);
  readonly mensagemErro = signal('');
  readonly jaCarregou = signal(false);
  readonly idDestacado = this.destaqueService.idDestacado;

  readonly usuarioParaExcluir = signal<Usuario | null>(null);
  readonly excluindo = signal(false);

  readonly formatarDataHora = formatarDataHora;

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  /** Empty state “sem filtros” vs “filtros sem resultado”. */
  get temFiltrosAtivos(): boolean {
    return !!this.termoBusca().trim() || !!this.filtroPerfil();
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  aoDigitarBusca(valor: string): void {
    this.termoBusca.set(valor);
    this.agendarRecarga();
  }

  aoMudarPerfil(valor: string): void {
    this.filtroPerfil.set(valor as PerfilUsuario | '');
    this.carregarUsuarios();
  }

  aoMudarOrdenacao(valor: string): void {
    this.ordenar.set(valor as OrdenacaoUsuarios);
    this.carregarUsuarios();
  }

  limparFiltros(): void {
    this.termoBusca.set('');
    this.filtroPerfil.set('');
    this.ordenar.set('nome');
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.usuarioService
      .buscarUsuarios({
        busca: this.termoBusca(),
        perfil: this.filtroPerfil(),
        ordenar: this.ordenar(),
      })
      .subscribe({
        next: (lista) => {
          this.usuarios.set(lista);
          this.carregando.set(false);
          this.jaCarregou.set(true);
        },
        error: (erro: unknown) => {
          this.carregando.set(false);
          this.jaCarregou.set(true);
          this.mensagemErro.set(
            extrairMensagemHttp(erro, 'Erro ao buscar usuários.'),
          );
        },
      });
  }

  pedirExclusao(usuario: Usuario): void {
    this.usuarioParaExcluir.set(usuario);
  }

  cancelarExclusao(): void {
    this.usuarioParaExcluir.set(null);
  }

  confirmarExclusao(): void {
    const usuario = this.usuarioParaExcluir();
    if (!usuario) {
      return;
    }

    this.excluindo.set(true);
    this.usuarioService.excluirUsuario(usuario.id).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.usuarioParaExcluir.set(null);
        if (this.idDestacado() === usuario.id) {
          this.destaqueService.limpar();
        }
        this.toastService.sucesso(`Usuário "${usuario.nome}" excluído.`);
        this.carregarUsuarios();
      },
      error: (erro: unknown) => {
        this.excluindo.set(false);
        this.toastService.erro(
          extrairMensagemHttp(erro, 'Não foi possível excluir.'),
        );
      },
    });
  }

  ehUsuarioLogado(usuario: Usuario): boolean {
    return this.authService.usuarioAtual()?.id === usuario.id;
  }

  estaDestacado(usuario: Usuario): boolean {
    return this.idDestacado() === usuario.id;
  }

  /** Texto dinâmico do modal reutilizável. */
  get mensagemExclusao(): string {
    const alvo = this.usuarioParaExcluir();
    if (!alvo) {
      return '';
    }
    return `Isso remove "${alvo.nome}" (${alvo.email}) do arquivo JSON. Não dá para desfazer nesta demo.`;
  }

  private agendarRecarga(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
    this.temporizador = setTimeout(() => this.carregarUsuarios(), 300);
  }
}
