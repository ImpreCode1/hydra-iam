/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard.guard';
import { PlatformsService } from './platforms.service';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('platforms')
export class PlatformsAccessController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get('me/access')
  getMyPlatforms(@Request() req: any) {
    return this.platformsService.getAccessiblePlatforms(req.user.id);
  }

  @Get('access/:code')
  async accessPlatform(
    @Param('code') platformCode: string,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { redirectUrl } =
      await this.platformsService.generatePlatformAccessToken(
        req.user.id,
        platformCode,
      );
    res.redirect(redirectUrl);
  }

  @Get('access-url/:code')
  async getAccessUrl(@Param('code') platformCode: string, @Request() req: any) {
    const { redirectUrl } =
      await this.platformsService.generatePlatformAccessToken(
        req.user.id,
        platformCode,
      );
    return { redirectUrl };
  }
}
