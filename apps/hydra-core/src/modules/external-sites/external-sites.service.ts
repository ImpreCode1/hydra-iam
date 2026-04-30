import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalSiteDto } from './dto/create-external-site.dto';
import { UpdateExternalSiteDto } from './dto/update-external-site.dto';

@Injectable()
export class ExternalSitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExternalSiteDto) {
    return this.prisma.externalSite.create({
      data: {
        name: data.name,
        url: data.url,
        logoUrl: data.logoUrl,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.externalSite.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findAllActive() {
    return this.prisma.externalSite.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        url: true,
        logoUrl: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.externalSite.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateExternalSiteDto) {
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
}