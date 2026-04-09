import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly notificationsUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.notificationsUrl = this.config.get<string>('NOTIFICATIONS_SERVICE_URL') ?? 'http://localhost:3001';
  }

  private getHeaders() {
    const token = this.jwtService.sign(
      { sub: 'hydra-core', client_id: 'hydra-core', type: 'service' },
      { secret: this.config.get<string>('SERVICE_JWT_SECRET') ?? '123456', expiresIn: '1h' }
    );
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createNotification(dto: {
    userId: string;
    type: string;
    title: string;
    message: string;
  }) {
    try {
      const response = await axios.post(
        `${this.notificationsUrl}/notifications/user-notification`,
        dto,
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating notification', error);
      throw error;
    }
  }

  async notifyPlatformAccess(userId: string, platformName: string) {
    return this.createNotification({
      userId,
      type: 'PLATFORM_ACCESS',
      title: 'Acceso a plataforma',
      message: `Has accedido a la plataforma ${platformName}`,
    });
  }

  async notifyNewPlatform(userId: string, platformName: string) {
    return this.createNotification({
      userId,
      type: 'NEW_PLATFORM',
      title: 'Nueva plataforma disponible',
      message: `Tienes acceso a la nueva plataforma: ${platformName}`,
    });
  }

  async notifyRoleAssigned(userId: string, roleName: string) {
    return this.createNotification({
      userId,
      type: 'ROLE_ASSIGNED',
      title: 'Rol asignado',
      message: `Se te ha asignado el rol: ${roleName}`,
    });
  }

  async getUserNotifications(userId: string, limit: number, offset: number) {
    try {
      const response = await axios.get(
        `${this.notificationsUrl}/notifications/user/${userId}?limit=${limit}&offset=${offset}`,
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching notifications', error);
      return [];
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const response = await axios.get(
        `${this.notificationsUrl}/notifications/user/${userId}/unread-count`,
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching unread count', error);
      return { count: 0 };
    }
  }

  async markAsReadByUser(notificationId: string, userId: string) {
    try {
      const response = await axios.put(
        `${this.notificationsUrl}/notifications/${notificationId}/read`,
        {},
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error marking notification as read', error);
      throw error;
    }
  }

  async markAllAsReadByUser(userId: string) {
    try {
      const response = await axios.put(
        `${this.notificationsUrl}/notifications/user/${userId}/read-all`,
        {},
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error marking all notifications as read', error);
      throw error;
    }
  }
}