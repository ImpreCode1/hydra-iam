import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicSitesController } from './public-sites.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SitesController, PublicSitesController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
