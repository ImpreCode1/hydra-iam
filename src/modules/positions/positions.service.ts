import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.position.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

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
}
