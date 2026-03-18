/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('uploads');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL, // frontend Next.js
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
