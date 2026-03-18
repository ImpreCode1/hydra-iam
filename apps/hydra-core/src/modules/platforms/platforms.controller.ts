import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Body,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Post()
  create(@Body() body: CreatePlatformDto) {
    return this.platformsService.create(body);
  }

  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.platformsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformsService.softDelete(id);
  }

  @Post(':id/roles/:roleId')
  assignRole(@Param('id') platformId: string, @Param('roleId') roleId: string) {
    return this.platformsService.assignRole(platformId, roleId);
  }

  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') platformId: string, @Param('roleId') roleId: string) {
    return this.platformsService.removeRole(platformId, roleId);
  }

  @Get(':id/roles')
  getRoles(@Param('id') platformId: string) {
    return this.platformsService.getRoles(platformId);
  }

  @Post('upload-logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/platforms',
        filename: (
          req: unknown,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;

          cb(null, uniqueName);
        },
      }),
      fileFilter: (
        req: unknown,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (file.mimetype !== 'image/png') {
          return cb(new BadRequestException('Solo PNG permitido'), false);
        }

        cb(null, true);
      },
    }),
  )
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    console.log('FILE ===>', file);

    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    return this.platformsService.saveLogo(file);
  }
}
