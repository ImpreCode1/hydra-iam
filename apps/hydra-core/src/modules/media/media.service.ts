/**
 * Servicio de gestión de archivos/media.
 * Maneja almacenamiento de logos y archivos subidos.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 *MediaService - Servicio para gestionar archivos del sistema.
 *@description Provee métodos para guardar archivos subidos como logos de plataformas.
 */
@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Guarda el logo de una plataforma.
   * @param file - Archivo subido via Multer
   * @returns Objeto con metadata del archivo guardado
   */
  savePlatformLogo(file: Express.Multer.File) {
    const filePath = `/uploads/platforms/${file.filename}`;
    const appUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    return {
      filename: file.filename,
      path: filePath,
      url: `${appUrl}${filePath}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
