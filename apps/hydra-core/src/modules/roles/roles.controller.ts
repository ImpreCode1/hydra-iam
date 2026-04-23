/**
 * Controlador de roles.
 * Endpoints para gestionar roles del sistema.
 */
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

import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

/**
 *RolesController - Controlador para endpoints de roles.
 *@description Provee endpoints para crear, listar, actualizar y eliminar roles.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Crea un nuevo rol.
   * @param body - Datos del rol (name, description)
   * @returns El rol creado
   */
  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.rolesService.create(body.name, body.description);
  }

  /**
   * Lista todos los roles ativos.
   * @returns Lista de roles
   */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Obtiene un rol por su ID.
   * @param id - ID del rol
   * @returns El rol con posiciones y plataformas
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  /**
   * Actualiza un rol.
   * @param id - ID del rol
   * @param body - Datos a actualizar (name, description)
   * @returns El rol actualizado
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.rolesService.update(id, body);
  }

  /**
   * Elimina un rol (soft delete).
   * @param id - ID del rol
   * @returns El rol con deletedAt establecido
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.softDelete(id);
  }
}
