import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API de Hydra IAM corriendo correctamente!';
  }
}
