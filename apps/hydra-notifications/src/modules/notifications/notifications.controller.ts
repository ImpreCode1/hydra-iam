/**
 * Controlador de notificaciones de hydra-notifications.
 * Endpoints para gestionar notificaciones.
 */
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ServiceJwtGuard } from '../auth/guards/service-jwt.guard';
import { SendNotificationDto } from './dto/send-notification.dto';

/**
 *NotificationsController - Controlador para endpoints de notificaciones.
 *@description Provee endpoints para enviar y gestionar notificaciones.
 *Requiere autenticación de servicio.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Envía una notificación por email.
   * @param dto - Datos de la notificación
   */
  @UseGuards(ServiceJwtGuard)
  @Post()
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  /**
   * Obtiene una notificación por su ID.
   * @param id - ID de la notificación
   */
  @Get(':id')
  @UseGuards(ServiceJwtGuard)
  async getById(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }

  /**
   * Obtiene las notificaciones de un usuario.
   * @param userId - ID del usuario
   * @param limit - Límite (default 20)
   * @param offset - Offset (default 0)
   */
  @Get('user/:userId')
  @UseGuards(ServiceJwtGuard)
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      userId,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  /**
   * Obtiene el conteo de notificaciones no leídas.
   * @param userId - ID del usuario
   */
  @Get('user/:userId/unread-count')
  @UseGuards(ServiceJwtGuard)
  async getUnreadCount(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * Marca una notificación como leída.
   * @param id - ID de la notificación
   */
  @Put(':id/read')
  @UseGuards(ServiceJwtGuard)
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  /**
   * Marca todas las notificaciones como leídas.
   * @param userId - ID del usuario
   */
  @Put('user/:userId/read-all')
  @UseGuards(ServiceJwtGuard)
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * Crea una notificación para un usuario.
   * @param dto - Datos de la notificación
   */
  @Post('user-notification')
  @UseGuards(ServiceJwtGuard)
  async createUserNotification(
    @Body() dto: { userId: string; type: string; title: string; message: string },
  ) {
    return this.notificationsService.createUserNotification(dto);
  }
}
