import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PositionGroupsService } from './position-groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('position-groups')
export class PositionGroupsController {
  constructor(private readonly service: PositionGroupsService) {}

  // 🔹 Crear grupo
  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto.name, dto.description);
  }

  // 🔹 Listar grupos
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔹 Obtener uno
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // 🔹 Asignar rol
  @Post(':id/roles')
  assignRole(@Param('id') groupId: string, @Body() dto: AssignRoleDto) {
    return this.service.assignRole(groupId, dto.roleId);
  }

  // 🔹 Quitar rol
  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') groupId: string, @Param('roleId') roleId: string) {
    return this.service.removeRole(groupId, roleId);
  }

  // 🔹 Asignar cargo al grupo
  @Patch(':id/positions/:positionId')
  assignPosition(
    @Param('id') groupId: string,
    @Param('positionId') positionId: string,
  ) {
    return this.service.assignPosition(groupId, positionId);
  }

  // 🔹 Quitar cargo del grupo
  @Delete('positions/:positionId')
  removePosition(@Param('positionId') positionId: string) {
    return this.service.removePosition(positionId);
  }
}
