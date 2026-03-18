import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  savePlatformLogo(file: Express.Multer.File) {
    // Ruta relativa guardada en BD (recomendado)
    const filePath = `/uploads/platforms/${file.filename}`;

    return {
      filename: file.filename,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
