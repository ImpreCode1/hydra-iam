/**
 * Controlador de medios/archivos.
 * Endpoints para gestionar subida de archivos.
 */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 *MediaController - Controlador para endpoints de archivos.
 *@description Provee endpoint para subir logos de plataformas.
 *Requiere autenticación JWT y rol de ADMIN.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Sube un logo de plataforma.
   * Solo acepta archivos PNG de máximo 2MB.
   * @param file - Archivo subido
   * @returns Metadata del archivo guardado
   */
  @Post('platform-logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/platforms',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;

          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png') {
          return cb(
            new BadRequestException('Solo archivos PNG permitidos'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  uploadPlatformLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    return this.mediaService.savePlatformLogo(file);
  }
}
