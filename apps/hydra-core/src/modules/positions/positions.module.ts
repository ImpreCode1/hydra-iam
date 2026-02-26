import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, PrismaService],
  exports: [PositionsService],
})
export class PositionsModule {}
