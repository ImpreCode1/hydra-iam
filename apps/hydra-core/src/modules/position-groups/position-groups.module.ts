import { Module } from '@nestjs/common';
import { PositionGroupsService } from './position-groups.service';
import { PositionGroupsController } from './position-groups.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PositionGroupsController],
  providers: [PositionGroupsService, PrismaService],
})
export class PositionGroupsModule {}
