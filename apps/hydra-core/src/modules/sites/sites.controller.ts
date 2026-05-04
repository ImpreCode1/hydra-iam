import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { SitesService } from './sites.service';

/**
 * SitesController
 * @description Gestión de sitios externos
 * Requiere autenticación JWT y rol ADMIN
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  /**
   * Lista todos los sitios
   */
  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  /**
   * Obtener sitio por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitesService.findById(id);
  }

  /**
   * Crear sitio
   */
  @Post()
  create(
    @Body()
    body: {
      name: string;
      url: string;
      logoUrl?: string;
      description?: string;
      sortOrder?: number;
    },
  ) {
    return this.sitesService.create(body);
  }

  /**
   * Actualizar sitio
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      url: string;
      logoUrl: string;
      description: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    return this.sitesService.update(id, body);
  }

  /**
   * Eliminación lógica
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitesService.softDelete(id);
  }

  /**
   * Toggle estado activo/inactivo
   */
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.sitesService.toggleStatus(id);
  }
}
