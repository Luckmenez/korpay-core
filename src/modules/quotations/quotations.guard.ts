import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class WsAuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: Socket): Promise<string> {
    const token = context.request.headers.authorization;

    if (!token) {
      throw new WsException('Nenhum token fornecido');
    }

    const isValid = await this.authService.checkToken(token);

    if (!isValid) {
      throw new WsException('Token inválido ou expirado');
    }

    const { user } = await this.authService.decodeToken(token);

    return user.email;
  }
}
