/**
 * Tela — Sobre / roteiro da aula
 * Explica as camadas do projeto para apresentar aos colegas.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Migalha, type ItemMigalha } from '../../comum/migalha';

@Component({
  selector: 'app-sobre',
  imports: [RouterLink, NgIcon, Migalha],
  templateUrl: './sobre.html',
})
export class Sobre {
  readonly itensMigalha: ItemMigalha[] = [
    { rotulo: 'Início', rota: '/inicio' },
    { rotulo: 'Sobre' },
  ];

  readonly camadas = [
    {
      titulo: 'Camada 0 — Modelo',
      texto: 'Contrato do usuário (front e API), incluindo auditoria criadoEm/atualizadoEm.',
    },
    {
      titulo: 'Camada 1 — Arquivo JSON',
      texto: 'ArquivoBancoService lê e grava dados/banco.json no lugar de um banco SQL.',
    },
    {
      titulo: 'Camada 2 — Auth + JWT',
      texto: 'Login, troca de senha e JwtAuthGuard sem Passport.',
    },
    {
      titulo: 'Camada 3 — CRUD',
      texto: 'Busca, cadastro, edição e exclusão com validação nas duas pontas.',
    },
    {
      titulo: 'Camada 4 — Interceptor',
      texto: 'Anexa Bearer e redireciona para login quando a sessão expira (401).',
    },
    {
      titulo: 'Camada 5 — Guardas',
      texto: 'authGuard nas rotas privadas e aviso ao sair de formulário sujo.',
    },
  ];
}
