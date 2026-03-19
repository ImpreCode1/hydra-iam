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
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RolesModule } from './modules/roles/roles.module';
import { PlatformsModule } from './modules/platforms/platforms.module';
import { MediaModule } from './modules/media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PositionsModule,
    RolesModule,
    PlatformsModule,
    MediaModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // siempre apunta a la raíz del proyecto
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
