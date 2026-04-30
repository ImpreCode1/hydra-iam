import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.externalSite.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllActive() {
    return this.prisma.externalSite.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.externalSite.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    url: string;
    logoUrl?: string;
    description?: string;
    sortOrder?: number;
  }) {
    return this.prisma.externalSite.create({
      data: {
        name: data.name,
        url: data.url,
        logoUrl: data.logoUrl,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    url: string;
    logoUrl: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
  }>) {
    return this.prisma.externalSite.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.externalSite.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async toggleStatus(id: string) {
    const site = await this.prisma.externalSite.findUnique({ where: { id } });
    if (!site) {
      throw new Error('Site not found');
    }
    return this.prisma.externalSite.update({
      where: { id },
      data: { isActive: !site.isActive },
    });
  }
}