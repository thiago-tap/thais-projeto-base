/**
 * DTO — troca de senha do usuário logado.
 */

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TrocarSenhaDto {
  @IsString({ message: 'A senha atual deve ser um texto.' })
  @IsNotEmpty({ message: 'A senha atual é obrigatória.' })
  @MinLength(6, { message: 'A senha atual deve ter pelo menos 6 caracteres.' })
  senhaAtual!: string;

  @IsString({ message: 'A nova senha deve ser um texto.' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
  senhaNova!: string;
}
