import { Module } from '@nestjs/common';
import { ExternalSitesService } from './external-sites.service';
import { ExternalSitesController } from './external-sites.controller';

@Module({
  controllers: [ExternalSitesController],
  providers: [ExternalSitesService],
  exports: [ExternalSitesService],
})
export class ExternalSitesModule {}