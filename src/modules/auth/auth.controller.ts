import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset.dto';
import { AuthChangePasswordDTO } from './dto/auth-change.dto';

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

  @Post('reset-password')
  async resetPassword(@Body() body: AuthResetPasswordDTO) {
    return await this.authService.resetPassword(body.email);
  }

  @Post('change-password')
  async changePassword(@Body() body: AuthChangePasswordDTO) {
    return await this.authService.changePassword({
      email: body.email,
      password: body.password,
      newPassword: body.newPassword,
    });
  }
}
