import { Controller, Get, Param } from '@nestjs/common';
import { fetchUsersSuccess } from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
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
      return handleSuccess(fetchUsersSuccess, user);
    } catch (error) {
      return handleError(error);
    }
  }
}
