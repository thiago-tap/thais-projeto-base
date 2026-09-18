/**
 * Rotas do painel
 * Início = dashboard; formulários usam formularioSujoGuard.
 */

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { formularioSujoGuard } from './guards/formulario-sujo.guard';
import { PainelLayout } from './layout/painel-layout';
import { BuscaUsuarios } from './paginas/busca-usuarios/busca-usuarios';
import { CadastroUsuario } from './paginas/cadastro-usuario/cadastro-usuario';
import { EditarUsuario } from './paginas/editar-usuario/editar-usuario';
import { Inicio } from './paginas/inicio/inicio';
import { Login } from './paginas/login/login';
import { NaoEncontrada } from './paginas/nao-encontrada/nao-encontrada';
import { Perfil } from './paginas/perfil/perfil';
import { Sobre } from './paginas/sobre/sobre';
import { TrocarSenha } from './paginas/trocar-senha/trocar-senha';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'login', component: Login },
  {
    path: '',
    component: PainelLayout,
    canActivate: [authGuard],
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'sobre', component: Sobre },
      { path: 'usuarios', component: BuscaUsuarios },
      {
        path: 'usuarios/cadastro',
        component: CadastroUsuario,
        canDeactivate: [formularioSujoGuard],
      },
      {
        path: 'usuarios/:id/editar',
        component: EditarUsuario,
        canDeactivate: [formularioSujoGuard],
      },
      { path: 'conta/perfil', component: Perfil },
      {
        path: 'conta/senha',
        component: TrocarSenha,
        canDeactivate: [formularioSujoGuard],
      },
    ],
  },
  { path: '**', component: NaoEncontrada },
];
