import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { PlatformsAccessController } from './plattforms-access.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { issuer: 'hydra-iam' },
    }),
  ],
  providers: [PlatformsService, PrismaService],
  controllers: [PlatformsController, PlatformsAccessController],
  exports: [PlatformsService],
})
export class PlatformsModule {}
