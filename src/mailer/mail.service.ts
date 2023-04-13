import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  invalidEmailError,
  invalidOtpError,
  invalidUserIdError,
  otpExpiredError,
} from 'src/constants/responseMessages';
import {
  emailSubjectResetPass,
  getEmailTemplate,
} from 'src/helpers/email-template';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prismaService: PrismaService,
    private mailerService: MailerService,
    private userService: UsersService,
  ) {}
  sendOtpInMail = (email: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.userService.getUserByEmail(email);

        if (!user) {
          throw new Error(invalidEmailError);
        }

        const otp: string = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();

        const mailData = {
          to: email,
          from: process.env.SMTP_FROM_EMAIL,
          subject: emailSubjectResetPass,
          html: getEmailTemplate(otp),
        };

        await this.mailerService.sendMail(mailData);

        const updatedUser = await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            otp,
            otpExpiresAt: new Date(new Date().getTime() + 5 * 60000),
          },
        });

        const responseToClient = {
          userId: updatedUser.id,
          otpExpiresAt: updatedUser.otpExpiresAt,
        };
        resolve(responseToClient);
      } catch (error) {
        reject(error);
      }
    });
  };

  verifyOtpAndResetPassword = (userId, otp, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) throw new Error(invalidUserIdError);

        if (new Date() > user.otpExpiresAt) {
          throw new Error(otpExpiredError);
        }

        if (user.otp !== otp) {
          throw new Error(invalidOtpError);
        }

        const hashedPassword = await this.authService.hashData(password);

        const updatedUser = await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            hashedPassword,
            otp: null,
            otpExpiresAt: null,
          },
        });

        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  };
}
