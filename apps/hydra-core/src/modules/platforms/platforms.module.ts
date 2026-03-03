import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { PlatformsAccessController } from './plattforms-access.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PlatformsService, PrismaService],
  controllers: [PlatformsController, PlatformsAccessController],
  exports: [PlatformsService],
})
export class PlatformsModule {}
