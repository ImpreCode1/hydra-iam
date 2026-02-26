import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findById(id);
  }

  @Roles('ADMIN')
  @Post(':id/roles/:roleId')
  assignRole(@Param('id') positionId: string, @Param('roleId') roleId: string) {
    return this.positionsService.assignRole(positionId, roleId);
  }

  @Roles('ADMIN')
  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') positionId: string, @Param('roleId') roleId: string) {
    return this.positionsService.removeRole(positionId, roleId);
  }

  @Roles('ADMIN')
  @Get(':id/roles')
  getRoles(@Param('id') positionId: string) {
    return this.positionsService.getRoles(positionId);
  }
}
