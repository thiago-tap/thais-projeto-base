/**
 * DTO de Cadastro — contrato da requisição POST /api/usuarios.
 * A mesma regra de validação aparece no formulário Angular (duas pontas).
 */

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CriarUsuarioDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  nome!: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString({ message: 'A senha deve ser um texto.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha!: string;

  @IsIn(['Administrador', 'Usuário'], {
    message: 'O perfil deve ser Administrador ou Usuário.',
  })
  perfil!: 'Administrador' | 'Usuário';
}
