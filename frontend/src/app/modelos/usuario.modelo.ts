/**
 * Camada 0 — Modelo de Usuário (frontend)
 * Espelha o que a API devolve (sem senhaHash).
 */

export type PerfilUsuario = 'Administrador' | 'Usuário';

export type OrdenacaoUsuarios = 'nome' | 'nome-desc';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  criadoEm: string;
  atualizadoEm: string;
}

export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
}

export interface DadosAtualizacao {
  nome: string;
  email: string;
  senha?: string;
  perfil: PerfilUsuario;
}

export interface FiltrosBuscaUsuarios {
  busca?: string;
  perfil?: PerfilUsuario | '';
  ordenar?: OrdenacaoUsuarios;
}

export interface DadosTrocarSenha {
  senhaAtual: string;
  senhaNova: string;
}
