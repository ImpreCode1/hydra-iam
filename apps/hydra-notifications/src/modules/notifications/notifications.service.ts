import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  send(dto: { to: string; subject: string; message: string }) {
    // Simulación
    console.log('Sending notification to:', dto.to);

    return {
      success: true,
      deliveredTo: dto.to,
    };
  }
}
