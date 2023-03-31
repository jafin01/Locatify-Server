import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  fetchUsersSuccess,
  fetchUserSuccess,
  mobileUpdateSuccess,
  updateLastSeenSuccess,
  updatePasswordSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('get-users')
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return handleSuccess(fetchUsersSuccess, users);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-user/:userId')
  async getUserById(@Param() params) {
    const { userId } = params;
    try {
      const user = await this.userService.getUserById(userId);
      return handleSuccess(fetchUserSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update-mobile-number')
  async updateMobileNumber(
    @Body() userDto: UserDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const user = await this.userService.updateMobileNumber(userId, userDto);
      return handleSuccess(mobileUpdateSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update-password')
  async updatePassword(
    @Body() userDto: UpdateUserDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const user = await this.userService.updatePassword(userId, userDto);
      return handleSuccess(updatePasswordSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update-last-seen/:userId')
  async updateLastSeen(@Param() params) {
    const { userId } = params;
    try {
      const user = await this.userService.updateLastSeen(userId);
      return handleSuccess(updateLastSeenSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }
}
