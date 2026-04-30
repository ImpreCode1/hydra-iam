import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ExternalSitesService } from './external-sites.service';
import { CreateExternalSiteDto } from './dto/create-external-site.dto';
import { UpdateExternalSiteDto } from './dto/update-external-site.dto';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('external-sites')
export class ExternalSitesController {
  constructor(private readonly externalSitesService: ExternalSitesService) {}

  @Get('active')
  findAllActive() {
    return this.externalSitesService.findAllActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: CreateExternalSiteDto) {
    return this.externalSitesService.create(body);
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateExternalSiteDto) {
    return this.externalSitesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalSitesService.softDelete(id);
  }
}