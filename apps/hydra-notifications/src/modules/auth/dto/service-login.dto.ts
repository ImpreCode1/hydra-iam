import { IsString, IsNotEmpty } from 'class-validator';

export class ServiceLoginDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}
