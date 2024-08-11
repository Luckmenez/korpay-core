import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'prisma/prisma.service';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService, PrismaService, AuthGuard, RoleGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, RoleGuard],
})
export class AuthModule {}
