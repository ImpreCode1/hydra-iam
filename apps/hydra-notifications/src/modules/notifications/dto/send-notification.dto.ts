import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
