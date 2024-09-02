import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDTO } from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { updateSpreadDTO } from './dto/updateSpreadDTO';

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
          spread: parseFloat('1.00219'),
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

  async updateSpread({ spread, email, isActive }: updateSpreadDTO) {
    const user = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        spread: parseFloat(spread),
        isActive: isActive,
      },
    });
    return user;
  }

  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            spread: true,
          },
        },
      },
    });
  }
}
