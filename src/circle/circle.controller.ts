import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { CircleService } from './circle.service';
import { CircleDto } from './dto/circle.dto';
import { CircleCodeDto } from './dto/circleCode.dto';

@Controller('api/circle')
export class CircleController {
  constructor(private circleService: CircleService) {}

  @Post('create')
  async createCircle(
    @Body() circleDto: CircleDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const circle = await this.circleService.createCircle(circleDto, userId);
      return handleSuccess(circle);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('join')
  async joinCircle(
    @Body() circleCodeDto: CircleCodeDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const circle = await this.circleService.joinCircle(circleCodeDto, userId);
      return handleSuccess(circle);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-circle-members/:id')
  async getAllCircleMembers(@Param() params) {
    try {
      const circleMembers = await this.circleService.getAllCircleMembers(
        params.id,
      );
      return handleSuccess(circleMembers);
    } catch (error) {
      return handleError(error);
    }
  }
}
