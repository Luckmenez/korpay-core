import { Module } from '@nestjs/common';
import { QuotationService } from './quotations.service';
import { QuotationsGateway } from './quotations.gateway';
import { WsAuthGuard } from './quotations.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { QuotationsController } from './quotations.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [QuotationService, QuotationsGateway, WsAuthGuard, PrismaService],
  controllers: [QuotationsController],
})
export class QuotationsModule {}
