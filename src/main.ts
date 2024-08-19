import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CORS_DOMAIN, 'http://localhost:5173'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
