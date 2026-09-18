/**
 * Camada 0 — Modelo de Usuário
 * Define o formato de cada registro gravado no arquivo banco.json.
 * O perfil é apenas visual: não muda permissões neste projeto didático.
 * criadoEm / atualizadoEm = auditoria leve (ISO string).
 */

export type PerfilUsuario = 'Administrador' | 'Usuário';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  /** Hash bcrypt — nunca devolvemos este campo nas respostas da API. */
  senhaHash: string;
  perfil: PerfilUsuario;
  /** Data/hora de criação (ISO 8601). */
  criadoEm: string;
  /** Data/hora da última alteração (ISO 8601). */
  atualizadoEm: string;
}

/** Versão segura do usuário, sem a senha. */
export type UsuarioPublico = Omit<Usuario, 'senhaHash'>;

export interface BancoDados {
  usuarios: Usuario[];
}
