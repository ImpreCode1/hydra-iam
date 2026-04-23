/**
 * Servicio de notificaciones de hydra-notifications.
 * Maneja el envío y gestión de notificaciones a usuarios.
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 *NotificationsService - Servicio principal de notificaciones.
 *@description Provee métodos para crear, obtener y marcar notificaciones como leídas.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Envía una notificación por email.
   * @param dto - Datos de la notificación (to, subject, message)
   * @returns Notificación creada con estado
   */
  async send(dto: { to: string; subject: string; message: string }) {
    const notification = await this.prisma.notification.create({
      data: {
        to: dto.to,
        subject: dto.subject,
        message: dto.message,
        status: 'PENDING',
      },
    });

    try {
      this.logger.log(`Sending notification to ${dto.to}`);
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { id: notification.id, status: 'SENT' };
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

  /**
   * Busca una notificación por su ID.
   * @param id - ID de la notificación
   * @returns La notificación o null
   */
  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Crea una notificación para un usuario.
   * @param dto - Datos de la notificación (userId, type, title, message)
   * @returns Notificación creada
   */
  async createUserNotification(dto: {
    userId: string;
    type: string;
    title: string;
    message: string;
  }) {
    return this.prisma.userNotification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        isRead: false,
      },
    });
  }

  /**
   * Obtiene las notificaciones de un usuario con paginación.
   * @param userId - ID del usuario
   * @param limit - Límite de resultados
   * @param offset - Offset para paginación
   * @returns Lista de notificaciones
   */
  async getUserNotifications(userId: string, limit: number, offset: number) {
    return this.prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Obtiene el conteo de notificaciones no leídas.
   * @param userId - ID del usuario
   * @returns Objeto con el conteo
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.userNotification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  /**
   * Marca una notificación como leída.
   * @param id - ID de la notificación
   * @returns Notificación actualizada
   */
  async markAsRead(id: string) {
    return this.prisma.userNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas.
   * @param userId - ID del usuario
   * @returns Notificaciones actualizadas
   */
  async markAllAsRead(userId: string) {
    return this.prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
