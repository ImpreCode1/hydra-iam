import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ExternalSitesService } from './external-sites.service';
import { CreateExternalSiteDto } from './dto/create-external-site.dto';
import { UpdateExternalSiteDto } from './dto/update-external-site.dto';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

/**
 * ExternalSitesController
 * @description Gestión de sitios externos (links, accesos, etc.)
 * Requiere autenticación JWT y rol ADMIN para todos los endpoints
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('external-sites')
export class ExternalSitesController {
  constructor(private readonly externalSitesService: ExternalSitesService) {}

  /**
   * Lista todos los sitios activos
   */
  @Roles('ADMIN')
  @Get('active')
  async findAllActive() {
    return this.externalSitesService.findAllActive();
  }

  /**
   * Crea un nuevo sitio externo
   */
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: CreateExternalSiteDto) {
    return this.externalSitesService.create(body);
  }

  /**
   * Lista todos los sitios (incluyendo inactivos)
   */
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.externalSitesService.findAll();
  }

  /**
   * Obtiene un sitio por ID
   */
  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.externalSitesService.findById(id);
  }

  /**
   * Actualiza un sitio
   */
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExternalSiteDto,
  ) {
    return this.externalSitesService.update(id, body);
  }

  /**
   * Eliminación lógica (soft delete)
   */
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.externalSitesService.softDelete(id);
  }
}