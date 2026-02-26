import { Body, Controller, Get, UseGuards } from '@nestjs/common';

import { ServiceJwtGuard } from './guards/service-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(ServiceJwtGuard)
  @Get('secure-test')
  secure() {
    return { ok: true };
  }
}
