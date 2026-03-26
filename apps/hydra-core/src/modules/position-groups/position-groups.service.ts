/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, description?: string) {
    const prisma = this.prisma as any;

    return await prisma.positionGroup.create({
      data: {
        name: name.trim(),
        description,
      },
    });
  }

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

  async assignRole(groupId: string, roleId: string) {
    const prisma = this.prisma as any;

    return await prisma.positionGroupRole.create({
      data: {
        groupId,
        roleId,
      },
    });
  }

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

  async assignPosition(groupId: string, positionId: string) {
    const prisma = this.prisma as any;

    return await prisma.position.update({
      where: { id: positionId },
      data: { groupId },
    });
  }

  async removePosition(positionId: string) {
    const prisma = this.prisma as any;

    return await prisma.position.update({
      where: { id: positionId },
      data: { groupId: null },
    });
  }
}
