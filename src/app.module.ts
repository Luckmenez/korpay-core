import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { PrismaService } from 'prisma/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS.toString(),
        },
      },
      defaults: {
        from: '"no_reply" <naoresponda@korpay.com.br>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UsersModule,
    QuotationsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
