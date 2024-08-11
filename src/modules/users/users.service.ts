import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDTO } from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getUsers() {
    const userList = await this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
    });
    return userList;
  }

  async createUser(user: CreateUserDTO) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...user,
          password: await bcrypt.hash(user.password, 8),
          spread: parseFloat('1.0075'),
        },
      });
      return newUser;
    } catch (e) {
      throw new ConflictException('Email já cadastrado');
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getfxRateSpread(userId: number) {
    return (await this.getUserById(userId)).spread;
  }

  async updateSpread({ spread, email }) {
    const user = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        spread: parseFloat(spread),
      },
    });
    return user;
  }
}
