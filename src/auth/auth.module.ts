import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { refreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mailer/mail.service';

@Module({
  imports: [forwardRef(() => PrismaModule), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    refreshTokenStrategy,
    UsersService,
    MailService,
  ],
})
export class AuthModule {}
