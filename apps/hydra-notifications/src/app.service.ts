import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Servicio de Notificaciones de Hydra IAM corriendo!';
  }
}
