import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  savePlatformLogo(file: Express.Multer.File) {
    const filePath = `/uploads/platforms/${file.filename}`;

    return {
      filename: file.filename,
      path: filePath,
      url: `http://localhost:3000${filePath}`, // 🔥 importante
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
