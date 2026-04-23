/**
 * Servicio de notificaciones.
 * Maneja la comunicación con el servicio de notificaciones.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

/**
 *NotificationsService - Servicio para gestionar notificaciones del sistema.
 *@description Provee métodos para crear, obtener y marcar notificaciones como leídas.
 *Se comunica con el servicio externo de notificaciones (hydra-notifications).
 */

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

  /**
   * Genera los headers de autenticación para el servicio de notificaciones.
   * @returns Headers con token JWT de servicio
   */
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

  /**
   * Crea una nueva notificación para un usuario.
   * @param dto - Datos de la notificación (userId, type, title, message)
   * @returns La notificación creada
   */
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

  /**
   * Notifica al usuario cuando accede a una plataforma.
   * @param userId - ID del usuario
   * @param platformName - Nombre de la plataforma
   */
  async notifyPlatformAccess(userId: string, platformName: string) {
    return this.createNotification({
      userId,
      type: 'PLATFORM_ACCESS',
      title: 'Acceso a plataforma',
      message: `Has accedido a la plataforma ${platformName}`,
    });
  }

  /**
   * Notifica al usuario cuando tiene acceso a una nueva plataforma.
   * @param userId - ID del usuario
   * @param platformName - Nombre de la nueva plataforma
   */
  async notifyNewPlatform(userId: string, platformName: string) {
    return this.createNotification({
      userId,
      type: 'NEW_PLATFORM',
      title: 'Nueva plataforma disponible',
      message: `Tienes acceso a la nueva plataforma: ${platformName}`,
    });
  }

  /**
   * Notifica al usuario cuando se le asigna un nuevo rol.
   * @param userId - ID del usuario
   * @param roleName - Nombre del rol asignado
   */
  async notifyRoleAssigned(userId: string, roleName: string) {
    return this.createNotification({
      userId,
      type: 'ROLE_ASSIGNED',
      title: 'Rol asignado',
      message: `Se te ha asignado el rol: ${roleName}`,
    });
  }

  /**
   * Notifica al administrador cuando se crea una nueva plataforma.
   * @param userId - ID del administrador
   * @param platformName - Nombre de la plataforma creada
   * @param clientId - Client ID del servicio
   */
  async notifyNewPlatformCreated(
    userId: string,
    platformName: string,
    clientId: string,
  ) {
    return this.createNotification({
      userId,
      type: 'NEW_PLATFORM_CREATED',
      title: 'Nueva plataforma creada',
      message: `Se ha creado la plataforma "${platformName}". Client ID: ${clientId}`,
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

  /**
   * Obtiene el conteo de notificaciones no leídas de un usuario.
   * @param userId - ID del usuario
   * @returns Objeto con el conteo
   */
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

  /**
   * Marca una notificación como leída por un usuario.
   * @param notificationId - ID de la notificación
   * @param userId - ID del usuario
   * @returns La notificación actualizada
   */
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

  /**
   * Marca todas las notificaciones de un usuario como leídas.
   * @param userId - ID del usuario
   */
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