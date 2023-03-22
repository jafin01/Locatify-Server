import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { CircleService } from './circle.service';
import { CircleRoleDto } from './dto/circle-role.dto';
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
      const circle: any = await this.circleService.createCircle(
        circleDto,
        userId,
      );
      await this.circleService.createCircleMembers(userId, circle.id);
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

  @Get('get-members/:circleId')
  async getAllCircleMembers(@Param() params) {
    try {
      const circleMembers = await this.circleService.getAllCircleMembers(
        params.circleId,
      );
      return handleSuccess(circleMembers);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-data/:circleId')
  async getCircleData(@Param() params) {
    try {
      const circleData = await this.circleService.getCircleDetails(
        params.circleId,
      );
      return handleSuccess(circleData);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('add-role/:circleId')
  async addCircleRole(
    @Body() circleRoleDto: CircleRoleDto,
    @Param() params,
    @GetCurrentUserId() userId: string,
  ) {
    const { role } = circleRoleDto;

    console.log(role, params.circleId, userId);
    try {
      const updatedMember = await this.circleService.addCircleRole(
        role,
        userId,
        params.circleId,
      );

      return handleSuccess(updatedMember);
    } catch (error) {
      return handleError(error);
    }
  }
}
