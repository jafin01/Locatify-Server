import { Body, Controller, Param, Post } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import {
  OTPSentSuccess,
  passwordResetSuccess,
} from 'src/constants/responseMessages';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { MailService } from './mail.service';

@Controller('api/password/')
export class MailerController {
  constructor(private mailService: MailService) {}

  @Public()
  @Post('forget')
  async forgetPassword(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      const { email } = verifyEmailDto;
      const data: any = await this.mailService.sendOtpInMail(email);

      return handleSuccess(OTPSentSuccess, data);
    } catch (error) {
      return handleError(error);
    }
  }

  @Public()
  @Post('reset/:userId')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('userId') userId: string,
  ) {
    const { otp, password } = resetPasswordDto;
    try {
      const data: any = await this.mailService.verifyOtpAndResetPassword(
        userId,
        otp,
        password,
      );
      return handleSuccess(passwordResetSuccess, data);
    } catch (error) {
      return handleError(error);
    }
  }
}
