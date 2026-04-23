/**
 * Controlador de grupos de cargos.
 * Endpoints para gestionar grupos de cargos del sistema.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PositionGroupsService } from './position-groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

/**
 *PositionGroupsController - Controlador para endpoints de grupos de posiciones.
 *@description Provee endpoints para crear, listar y gestionar grupos de cargos.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('position-groups')
export class PositionGroupsController {
  constructor(private readonly service: PositionGroupsService) {}

  /**
   * Crea un nuevo grupo de cargos.
   * @param dto - Datos del grupo (name, description)
   * @returns El grupo criado
   */
  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto.name, dto.description);
  }

  /**
   * Lista todos los grupos de cargos.
   * @returns Lista de grupos con roles y posiciones
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * Obtiene un grupo de cargos por su ID.
   * @param id - ID del grupo
   * @returns El grupo con sus roles y posiciones
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  /**
   * Asigna un rol a un grupo de cargos.
   * @param id - ID del grupo
   * @param dto - Datos con roleId
   * @returns La relación criada
   */
  @Post(':id/roles')
  assignRole(@Param('id') groupId: string, @Body() dto: AssignRoleDto) {
    return this.service.assignRole(groupId, dto.roleId);
  }

  /**
   * Remueve un rol de un grupo de cargos.
   * @param id - ID del grupo
   * @param roleId - ID del rol
   */
  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') groupId: string, @Param('roleId') roleId: string) {
    return this.service.removeRole(groupId, roleId);
  }

  /**
   * Asigna un cargo a un grupo de cargos.
   * @param id - ID del grupo
   * @param positionId - ID del cargo
   * @returns El cargo actualizado
   */
  @Patch(':id/positions/:positionId')
  assignPosition(
    @Param('id') groupId: string,
    @Param('positionId') positionId: string,
  ) {
    return this.service.assignPosition(groupId, positionId);
  }

  /**
   * Remueve un cargo de su grupo.
   * @param positionId - ID del cargo
   * @returns El cargo actualizado (sin grupo)
   */
  @Delete('positions/:positionId')
  removePosition(@Param('positionId') positionId: string) {
    return this.service.removePosition(positionId);
  }
}
