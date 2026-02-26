/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface ServiceJwtPayload {
  sub: string;
  client_id: string;
  type: 'service';
  iat?: number;
  exp?: number;
}

@Injectable()
export class ServiceJwtStrategy extends PassportStrategy(
  Strategy,
  'service-jwt',
) {
  constructor(private readonly config: ConfigService) {
    const secret = config.get<string>('SERVICE_JWT_SECRET');

    if (!secret) {
      throw new Error('SERVICE_JWT_SECRET no definido');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    };

    super(options);
  }

  validate(payload: ServiceJwtPayload): ServiceJwtPayload {
    if (payload.type !== 'service') {
      throw new UnauthorizedException('Token inválido para servicio');
    }

    return payload;
  }
}
