import { Module } from '@nestjs/common';
import { ExternalSitesController } from './external-sites.controller';
import { ExternalSitesService } from './external-sites.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExternalSitesController],
  providers: [ExternalSitesService],
  exports: [ExternalSitesService],
})
export class ExternalSitesModule {}