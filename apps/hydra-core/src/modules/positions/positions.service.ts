/**
 * Servicio de gestión de cargos/posiciones.
 * Maneja operaciones CRUD y asignación de roles a cargos.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 *PositionsService - Servicio para gestionar cargos del sistema.
 *@description Provee métodos para crear, listar, actualizar y eliminar cargos.
 *Maneja sincronización de cargos desde Azure AD.
 */

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca un cargo por nombre o lo crea si no existe.
   * Utilizado para sincronización de cargos desde Azure AD.
   * @param name - Nombre del cargo
   * @returns ID del cargo o null si el nombre no fue proporcionado
   */
  async findOrCreateByName(name?: string | null): Promise<string | null> {
    if (!name) return null;

    const normalized = name.trim();

    let position = await this.prisma.position.findUnique({
      where: { name: normalized },
    });

    if (!position) {
      try {
        position = await this.prisma.position.create({
          data: {
            name: normalized,
            description: 'Cargo sincronizado desde Azure AD',
          },
        });
      } catch {
        position = await this.prisma.position.findUnique({
          where: { name: normalized },
        });
      }
    }

    return position?.id ?? null;
  }

  /**
   * Obtiene todos los cargos activos del sistema.
   * @returns Lista de cargos ordenados alfabéticamente
   */
  async findAll() {
    return this.prisma.position.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca un cargo por su ID incluyendo los roles asociados.
   * @param id - ID del cargo
   * @returns El cargo con sus roles
   */
  async findById(id: string) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  /**
   * Asigna un rol a un cargo.
   * @param positionId - ID del cargo
   * @param roleId - ID del rol a asignar
   * @returns La relación cargo-rol creada
   */
  async assignRole(positionId: string, roleId: string) {
    return this.prisma.positionRole.create({
      data: {
        positionId,
        roleId,
      },
    });
  }

  /**
   * Remueve un rol de un cargo.
   * @param positionId - ID del cargo
   * @param roleId - ID del rol a remover
   * @returns La relación eliminada
   */
  async removeRole(positionId: string, roleId: string) {
    return this.prisma.positionRole.delete({
      where: {
        positionId_roleId: {
          positionId,
          roleId,
        },
      },
    });
  }

  /**
   * Obtiene los roles asociados a un cargo, incluyendo roles del grupo.
   * @param positionId - ID del cargo
   * @returns Lista de roles del cargo (directos + del grupo)
   */
  async getRoles(positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: {
        roles: {
          include: { role: true },
        },
        group: {
          include: {
            roles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!position) {
      return [];
    }

    const directRoles = position.roles.map((pr) => pr.role);
    const groupRoles = position.group?.roles.map((gr) => gr.role) ?? [];

    const allRoles = [...directRoles, ...groupRoles];
    const uniqueRoles = allRoles.filter(
      (role, index, self) => index === self.findIndex((r) => r.id === role.id),
    );

    return uniqueRoles.map((role) => ({
      positionId: position.id,
      roleId: role.id,
      role,
    }));
  }
}
