/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Public()
  @Post('local/signup')
  async userSignup(@Body() authDto: AuthDto) {
    try {
      const data: any = await this.AuthService.userSignup(authDto);
      return handleSuccess(data.newUser, data.tokens);
    } catch (error) {
      return handleError(error);
    }
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async userSignin(@Body() loginDto: LoginDto) {
    try {
      const data = await this.AuthService.userSignin(loginDto);
      return handleSuccess(data);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async userLogout(@GetCurrentUserId() userId: string) {
    try {
      const response = await this.AuthService.userLogout(userId);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    try {
      const response: any = await this.AuthService.refreshTokens(
        userId,
        refreshToken,
      );
      return handleSuccess(response.user, response.tokens);
    } catch (error) {
      return handleError(error);
    }
  }
}
