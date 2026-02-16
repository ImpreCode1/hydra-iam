/**
 * Módulo raíz de la aplicación Hydra IAM.
 *
 * Configura:
 * - ConfigModule: variables de entorno (.env)
 * - PrismaModule: conexión a PostgreSQL
 * - AuthModule: autenticación (Microsoft SSO + JWT)
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PositionsModule } from './modules/positions/positions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PositionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
