import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => PrismaModule),
    JwtModule.register({}),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_GMAIL_USER,
          pass: process.env.SMTP_GMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM_EMAIL,
      },
    }),
  ],
  controllers: [],
  providers: [AuthService, MailService, UsersService],
})
export class MailModule {}
