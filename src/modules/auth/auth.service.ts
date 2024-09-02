import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

interface JwtPayload {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async createToken(user: User) {
    return {
      auth_token: this.jwtService.sign(
        {
          user: user,
        },
        {
          expiresIn: '1h', // esta 1s para testes, o ideal é 1h
          subject: user.email,
          issuer: 'Korpay Solutions',
        },
      ),
    };
  }

  async checkToken(token: string) {
    try {
      token = token.replace('Bearer ', '');
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou Senha Incorreto');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou Senha Incorreto');
    }

    const token = await this.createToken(user);
    return token;
  }

  async register(authRegisterDTO: AuthRegisterDTO) {
    const user = await this.usersService.createUser(authRegisterDTO);
    return this.createToken(user);
  }

  async decodeToken(token: string): Promise<JwtPayload> {
    token = token.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token);
    return decoded;
  }

  async resetPassword(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Email não encontrado');
      }

      const newPassword = Math.random().toString(36).slice(-6);
      const hashedPassword = await bcrypt.hash(newPassword, 8);

      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });

      this.mailerService.sendMail({
        subject: 'Recuperação de Senha',
        to: email,
        template: './forget',
        context: {
          name: user.name,
          password_reset: newPassword,
        },
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async changePassword({ email, password, newPassword }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException(
          'As credenciais enviadas estão inválidas',
        );
      }

      console.log('Password:', password);
      console.log('User Password:', user.password);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'As credenciais enviadas estão inválidas 2',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 8);

      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
