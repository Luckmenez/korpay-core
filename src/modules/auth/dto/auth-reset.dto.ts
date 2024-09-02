import { IsEmail } from 'class-validator';

export class AuthResetPasswordDTO {
  @IsEmail()
  email: string;
}
