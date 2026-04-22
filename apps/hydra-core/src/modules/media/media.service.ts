import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

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
