import { IsEmail, IsString } from 'class-validator';

export class AuthRegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
