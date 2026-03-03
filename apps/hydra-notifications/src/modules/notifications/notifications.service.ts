import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(dto: { to: string; subject: string; message: string }) {
    // 1️⃣ Crear registro en estado PENDING
    const notification = await this.prisma.notification.create({
      data: {
        to: dto.to,
        subject: dto.subject,
        message: dto.message,
        status: 'PENDING',
      },
    });

    try {
      // 2️⃣ Simular envío (aquí iría email provider real)
      this.logger.log(`Sending notification to ${dto.to}`);

      // Simulación exitosa
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return {
        id: notification.id,
        status: 'SENT',
      };
    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }
}
