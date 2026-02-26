import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ServiceJwtGuard } from '../auth/guards/service-jwt.guard';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(ServiceJwtGuard)
  @Post()
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Get(':id')
  @UseGuards(ServiceJwtGuard)
  async getById(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }
}
