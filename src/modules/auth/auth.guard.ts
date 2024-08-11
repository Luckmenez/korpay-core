import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException(`Token não informado`);
    }

    const isValidToken = await this.authService.checkToken(token);

    if (!isValidToken) {
      throw new UnauthorizedException(`Token inválido`);
    }

    request.user = await this.authService.decodeToken(token).then((user) => {
      return user.user;
    });

    return isValidToken;
  }
}
