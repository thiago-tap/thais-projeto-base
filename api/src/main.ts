/**
 * Camada de entrada da API NestJS
 * - Prefixo global /api (o proxy do Angular encaminha /api → esta porta)
 * - ValidationPipe: aplica class-validator em todos os DTOs
 * - CORS ligado para facilitar testes diretos no navegador
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('API do Painel de Usuários em http://localhost:3000/api');
}

await bootstrap();
