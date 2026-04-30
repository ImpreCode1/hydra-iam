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
import { ExternalSitesService } from './external-sites.service';

@Controller('external-sites')
export class ExternalSitesController {
  constructor(private readonly externalSitesService: ExternalSitesService) {}

  @Get('active')
  findAllActive() {
    return this.externalSitesService.findAllActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.externalSitesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalSitesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: {
    name: string;
    url: string;
    logoUrl?: string;
    description?: string;
    sortOrder?: number;
  }) {
    return this.externalSitesService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.externalSitesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalSitesService.softDelete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.externalSitesService.toggleStatus(id);
  }
}