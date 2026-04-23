/**
 * Controlador de usuarios.
 * Endpoints para gestionar usuarios del sistema.
 */
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  NotFoundException,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 *UsersController - Controlador para endpoints de usuarios.
 *@description Provee endpoints para listar, obtener, actualizar usuarios y gestionar roles.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Lista todos los usuarios activos del sistema.
   * @returns Lista de usuarios con sus roles y plataformas
   */
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario
   * @returns El usuario con sus relaciones
   */
  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Activa o desactiva un usuario.
   * @param id - ID del usuario
   * @param body - Objeto con isActive (true/false)
   * @returns El usuario actualizado
   */
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.usersService.updateStatus(id, body.isActive);
  }

  /**
   * Obtiene los roles efectivos de un usuario (directos + del cargo + del grupo).
   * @param id - ID del usuario
   * @returns Lista de nombres de roles
   */
  @Get(':id/roles')
  async getRoles(@Param('id') id: string) {
    return this.usersService.resolveEffectiveRoles(id);
  }

  /**
   * Asigna un rol a un usuario.
   * @param id - ID del usuario
   * @param roleId - ID del rol a asignar
   * @returns La relación usuario-rol creada
   */
  @Post(':id/roles/:roleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  assignRole(@Param('id') userId: string, @Param('roleId') roleId: string) {
    return this.usersService.assignRole(userId, roleId);
  }

  /**
   * Remueve un rol de un usuario.
   * @param id - ID del usuario
   * @param roleId - ID del rol a remover
   */
  @Delete(':id/roles/:roleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeRole(@Param('id') userId: string, @Param('roleId') roleId: string) {
    return this.usersService.removeRole(userId, roleId);
  }
}
