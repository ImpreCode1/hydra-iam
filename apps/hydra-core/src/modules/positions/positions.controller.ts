/**
 * Controlador de cargos/posiciones.
 * Endpoints para gestionar cargos del sistema.
 */
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

/**
 *PositionsController - Controlador para endpoints de posiciones/cargos.
 *@description Provee endpoints para listar, obtener y gestionar roles de posiciones.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  /**
   * Lista todos los cargos ativos.
   * @returns Lista de cargos
   */
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  /**
   * Obtiene un cargo por su ID.
   * @param id - ID del cargo
   * @returns El cargo con sus roles
   */
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findById(id);
  }

  /**
   * Asigna un rol a un cargo.
   * @param id - ID del cargo
   * @param roleId - ID del rol
   * @returns La relación criada
   */
  @Roles('ADMIN')
  @Post(':id/roles/:roleId')
  assignRole(@Param('id') positionId: string, @Param('roleId') roleId: string) {
    return this.positionsService.assignRole(positionId, roleId);
  }

  /**
   * Remueve un rol de un cargo.
   * @param id - ID del cargo
   * @param roleId - ID del rol
   */
  @Roles('ADMIN')
  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') positionId: string, @Param('roleId') roleId: string) {
    return this.positionsService.removeRole(positionId, roleId);
  }

  /**
   * Obtiene los roles de un cargo (incluye roles del grupo).
   * @param id - ID del cargo
   * @returns Lista de roles del cargo
   */
  @Roles('ADMIN')
  @Get(':id/roles')
  getRoles(@Param('id') positionId: string) {
    return this.positionsService.getRoles(positionId);
  }
}
