import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ServiceJwtGuard extends AuthGuard('service-jwt') {}
