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
import {
  loginSuccess,
  logoutSuccess,
  refreshTokenSuccess,
  registerSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  async userSignup(@Body() authDto: AuthDto) {
    try {
      const data: any = await this.authService.userSignup(authDto);
      return handleSuccess(registerSuccess, data.newUser, data.tokens);
    } catch (error) {
      return handleError(error);
    }
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async userSignin(@Body() loginDto: LoginDto) {
    try {
      const data: any = await this.authService.userSignin(loginDto);
      return handleSuccess(loginSuccess, data.userDetails, data.tokens);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async userLogout(@GetCurrentUserId() userId: string) {
    try {
      await this.authService.userLogout(userId);
      return handleSuccess(logoutSuccess);
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
      const response: any = await this.authService.refreshTokens(
        userId,
        refreshToken,
      );
      return handleSuccess(refreshTokenSuccess, response.user, response.tokens);
    } catch (error) {
      return handleError(error);
    }
  }
}
