import { IsEmail, IsString } from 'class-validator';

export class AuthChangePasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}
