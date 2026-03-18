import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

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
}
