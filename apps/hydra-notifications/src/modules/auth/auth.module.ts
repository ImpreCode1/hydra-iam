import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { ServiceJwtStrategy } from './strategies/service-jwt.strategy';

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [ServiceJwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
