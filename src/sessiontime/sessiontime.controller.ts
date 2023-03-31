import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  createSessionTimeSuccess,
  endSessionTimeSuccess,
  getTotalSessionTimeSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { SessionTimeDto } from './dto/sessionTime.dto';
import { SessiontimeService } from './sessiontime.service';

@Controller('api/session-time')
export class SessiontimeController {
  constructor(private sessionTimeServices: SessiontimeService) {}

  @Post('create')
  async createSessionTime(
    @Body() sessionTimeDto: SessionTimeDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const sessionTime = await this.sessionTimeServices.createSessionTime(
        sessionTimeDto,
        userId,
      );
      return handleSuccess(createSessionTimeSuccess, sessionTime);
    } catch (error) {
      return handleError(error);
    }
  }

  @Put('update/end-time')
  async endSession(@GetCurrentUserId() userId: string) {
    try {
      const sessionTimeEnd = await this.sessionTimeServices.endSession(userId);
      return handleSuccess(endSessionTimeSuccess, sessionTimeEnd);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get()
  async getSessions(@GetCurrentUserId() userId: string) {
    try {
      const sessionTimes = await this.sessionTimeServices.getSessions(userId);
      return handleSuccess(getTotalSessionTimeSuccess, sessionTimes);
    } catch (error) {
      return handleError(error);
    }
  }
}
