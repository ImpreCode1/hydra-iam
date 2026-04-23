/**
 * Servicio de gestión de roles.
 * Maneja operaciones CRUD y asignación de roles a posiciones y plataformas.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 *RolesService - Servicio para gestionar roles del sistema.
 *@description Provee métodos para crear, listar, actualizar y eliminar roles.
 *También maneja la asignación de roles a posiciones y plataformas.
 */

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo rol en el sistema.
   * @param name - Nombre único del rol
   * @param description - Descripción opcional del rol
   * @returns El rol creado
   */
  async create(name: string, description?: string) {
    return this.prisma.role.create({
      data: {
        name: name.trim(),
        description,
      },
    });
  }

  /**
   * Obtiene todos los roles activos del sistema.
   * @returns Lista de roles ordenados alfabéticamente
   */
  async findAll() {
    return this.prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca un rol por su ID incluyendo posiciones y plataformas asociadas.
   * @param id - ID del rol
   * @returns El rol con sus relaciones
   * @throws NotFoundException si el rol no existe
   */
  async findById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        positions: {
          include: { position: true },
        },
        platforms: {
          include: { platform: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  /**
   * Actualiza los datos de un rol.
   * @param id - ID del rol a actualizar
   * @param data - Datos a actualizar (name, description)
   * @returns El rol actualizado
   */
  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  /**
   * Elimina un rol de forma lógica (soft delete).
   * @param id - ID del rol a eliminar
   * @returns El rol con deletedAt establecido
   */
  async softDelete(id: string) {
    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
