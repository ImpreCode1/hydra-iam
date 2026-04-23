/**
 * Controlador de plataformas.
 * Endpoints para gestionar plataformas del sistema.
 */
import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

/**
 *PlatformsController - Controlador para endpoints de plataformas.
 *@description Provee endpoints para crear, listar, actualizar y eliminar plataformas.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('platform')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  /**
   * Crea una nueva plataforma.
   * @param body - Datos de la plataforma
   * @returns La plataforma creada con credenciales
   */
  @Post()
  create(@Body() body: CreatePlatformDto) {
    return this.platformsService.create(body);
  }

  /**
   * Lista todas las plataformas activas.
   * @returns Lista de plataformas
   */
  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  /**
   * Obtiene una plataforma por su ID.
   * @param id - ID de la plataforma
   * @returns La plataforma con sus roles
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformsService.findById(id);
  }

  /**
   * Actualiza una plataforma.
   * @param id - ID de la plataforma
   * @param body - Datos a actualizar
   * @returns La plataforma actualizada
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.platformsService.update(id, body);
  }

  /**
   * Elimina una plataforma (soft delete).
   * @param id - ID de la plataforma
   * @returns La plataforma con deletedAt establecido
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformsService.softDelete(id);
  }

  /**
   * Asigna un rol a una plataforma.
   * @param id - ID de la plataforma
   * @param roleId - ID del rol
   * @returns La relación creada
   */
  @Post(':id/roles/:roleId')
  assignRole(@Param('id') platformId: string, @Param('roleId') roleId: string) {
    return this.platformsService.assignRole(platformId, roleId);
  }

  /**
   * Remueve un rol de una plataforma.
   * @param id - ID de la plataforma
   * @param roleId - ID del rol
   */
  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') platformId: string, @Param('roleId') roleId: string) {
    return this.platformsService.removeRole(platformId, roleId);
  }

  /**
   * Obtiene los roles de una plataforma.
   * @param id - ID de la plataforma
   * @returns Lista de roles asociados
   */
  @Get(':id/roles')
  getRoles(@Param('id') platformId: string) {
    return this.platformsService.getRoles(platformId);
  }
}
