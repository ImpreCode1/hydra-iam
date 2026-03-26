import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService], // 🔥 útil si luego lo usas en platforms u otros módulos
})
export class MediaModule {}
