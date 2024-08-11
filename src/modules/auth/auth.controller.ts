import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDTO: AuthLoginDTO) {
    return await this.authService.login(authLoginDTO);
  }

  @Post('register')
  async register(@Body() authRegisterDTO: AuthRegisterDTO) {
    return await this.authService.register(authRegisterDTO);
  }
}
