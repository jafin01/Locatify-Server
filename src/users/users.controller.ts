import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  fetchUserSuccess,
  allActiceUsersSuccess,
  fetchUsersSuccess,
  mobileUpdateSuccess,
  updateLastSeenSuccess,
  updatePasswordSuccess,
  updateEmailSuccess,
  uploadedProfilePicSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('api/user')
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

  @Post('update-email')
  async updateEmail(
    @Body() userDto: UserDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const user = await this.userService.updateEmail(userId, userDto);
      return handleSuccess(updateEmailSuccess, user);
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

  @Post('update-profile-picture')
  async updateProfilePicture(
    @GetCurrentUserId() userId: string,
    @Body() userDto: UserDto,
  ) {
    try {
      const user = await this.userService.uploadProfilePicture(userId, userDto);
      return handleSuccess(uploadedProfilePicSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update-last-seen')
  async updateLastSeen(@GetCurrentUserId() userId: string) {
    try {
      const user = await this.userService.updateLastSeen(userId);
      return handleSuccess(updateLastSeenSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-active-users')
  async getAllActiveUsers() {
    try {
      const activeUsers = await this.userService.getAllActiveUsers();
      return handleSuccess(allActiceUsersSuccess, activeUsers);
    } catch (error) {
      return handleError(error);
    }
  }

  // @Get('count')
  // async countActiveUsers() {
  //   try {
  //     const activeUsersCount = await this.userService.countActiveUsers();
  //     return handleSuccess(activeUsersCountSuccess, activeUsersCount);
  //   } catch (error) {
  //     return handleError(error);
  //   }
  // }
}
