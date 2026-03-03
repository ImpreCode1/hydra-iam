/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class ServiceTokenDto {
  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;
}
