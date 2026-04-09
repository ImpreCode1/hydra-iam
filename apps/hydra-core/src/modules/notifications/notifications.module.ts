import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UserNotificationsController } from './user-notifications.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.SERVICE_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [NotificationsService],
  controllers: [UserNotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}