import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { PrismaModule } from './prisma/prisma.module';
import { CircleModule } from './circle/circle.module';
import { PlacesModule } from './places/places.module';
import { LocationsModule } from './locations/locations.module';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { SessiontimeModule } from './sessiontime/sessiontime.module';
import { MailModule } from './mailer/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CircleModule,
    PlacesModule,
    LocationsModule,
    DevicesModule,
    UsersModule,
    SessiontimeModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
