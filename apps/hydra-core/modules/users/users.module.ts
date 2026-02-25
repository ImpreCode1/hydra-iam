/**
 * Módulo de usuarios.
 *
 * Proporciona UsersService para gestión de usuarios.
 * Usado por AuthModule (findOrCreateFromMicrosoft).
 * PrismaService disponible vía PrismaModule global.
 */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PositionsModule } from '../positions/positions.module';

@Module({
  imports: [PositionsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
