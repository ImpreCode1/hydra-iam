import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Listar usuarios
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // 🔹 Obtener usuario por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // 🔹 Activar / Desactivar usuario
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.usersService.updateStatus(id, body.isActive);
  }

  // 🔹 Ver roles efectivos del usuario
  @Get(':id/roles')
  async getRoles(@Param('id') id: string) {
    return this.usersService.resolveEffectiveRoles(id);
  }
}
