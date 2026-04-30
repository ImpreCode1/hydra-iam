import { Controller, Get } from '@nestjs/common';
import { SitesService } from './sites.service';

/**
 * PublicSitesController
 * @description Endpoints públicos de sitios (sin autenticación)
 */
@Controller('public/sites')
export class PublicSitesController {
  constructor(private readonly sitesService: SitesService) {}

  /**
   * Lista sitios activos (público)
   */
  @Get('active')
  findAllActive() {
    return this.sitesService.findAllActive();
  }
}
