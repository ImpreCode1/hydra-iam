/**
 * Servicio de gestión de grupos de cargos.
 * Maneja operaciones CRUD y asignación de roles y cargos a grupos.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 *PositionGroupsService - Servicio para gestionar grupos de cargos del sistema.
 *@description Provee métodos para crear, listar y eliminar grupos de cargos.
 *Maneja asignación de roles y posiciones a grupos.
 */

@Injectable()
export class PositionGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo grupo de cargos.
   * @param name - Nombre único del grupo
   * @param description - Descripción opcional del grupo
   * @returns El grupo creado
   */
  async create(name: string, description?: string) {
    const prisma = this.prisma as any;

    return await prisma.positionGroup.create({
      data: {
        name: name.trim(),
        description,
      },
    });
  }

  /**
   * Obtiene todos los grupos de cargos del sistema.
   * @returns Lista de grupos con sus roles y posiciones
   */
  async findAll() {
    const prisma = this.prisma as any;

    return await prisma.positionGroup.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        positions: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca un grupo de cargos por su ID.
   * @param id - ID del grupo
   * @returns El grupo con sus roles y posiciones
   * @throws NotFoundException si el grupo no existe
   */
  async findById(id: string) {
    const prisma = this.prisma as any;

    const group = await prisma.positionGroup.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        positions: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return group;
  }

  /**
   * Asigna un rol a un grupo de cargos.
   * @param groupId - ID del grupo
   * @param roleId - ID del rol a asignar
   * @returns La relación grupo-rol creada
   */
  async assignRole(groupId: string, roleId: string) {
    const prisma = this.prisma as any;

    return await prisma.positionGroupRole.create({
      data: {
        groupId,
        roleId,
      },
    });
  }

  /**
   * Remueve un rol de un grupo de cargos.
   * @param groupId - ID del grupo
   * @param roleId - ID del rol a remover
   * @returns La relación eliminada
   */
  async removeRole(groupId: string, roleId: string) {
    const prisma = this.prisma as any;

    return await prisma.positionGroupRole.delete({
      where: {
        groupId_roleId: {
          groupId,
          roleId,
        },
      },
    });
  }

  /**
   * Asigna un cargo a un grupo de cargos.
   * @param groupId - ID del grupo
   * @param positionId - ID del cargo a asignar
   * @returns El cargo actualizado
   */
  async assignPosition(groupId: string, positionId: string) {
    const prisma = this.prisma as any;

    return await prisma.position.update({
      where: { id: positionId },
      data: { groupId },
    });
  }

  /**
   * Remueve un cargo de su grupo de cargos.
   * @param positionId - ID del cargo a remover
   * @returns El cargo actualizado (sin grupo)
   */
  async removePosition(positionId: string) {
    const prisma = this.prisma as any;

    return await prisma.position.update({
      where: { id: positionId },
      data: { groupId: null },
    });
  }
}
