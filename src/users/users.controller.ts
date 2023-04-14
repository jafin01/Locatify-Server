import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
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
  userDeletedSuccess,
} from 'src/constants/responseMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('upload-profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @GetCurrentUserId() userId: string) {
    try {
      const imageUrl: any = await this.userService.uploadProfilePicture(
        userId,
        file,
      );
      return handleSuccess(imageUrl);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('delete-profile-picture')
  async deleteProfilePicture(@GetCurrentUserId() userId: string) {
    try {
      const imageUrl: any = await this.userService.deleteProfilePicture(userId);
      return handleSuccess(uploadedProfilePicSuccess, imageUrl);
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

  @Delete('delete-account')
  async deleteAccount(@GetCurrentUserId() userId: string) {
    try {
      const user = await this.userService.deleteUserAccount(userId);
      return handleSuccess(userDeletedSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }
}
