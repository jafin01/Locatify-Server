import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  circleCreatedSuccess,
  circleJoinedSuccess,
  deleteMemberSuccess,
  fetchCircleMembersSuccess,
  fetchCirclesSuccess,
  fetchCircleSuccess,
  updateMemberRoleSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { CircleService } from './circle.service';
import { CircleDto } from './dto/circle.dto';
import { CircleCodeDto } from './dto/circleCode.dto';
import { CircleMembersDto } from './dto/circleMembers.dto';

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
      return handleSuccess(circleCreatedSuccess, circle);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('join')
  async joinCircle(
    @Body() circleCodeDto: CircleCodeDto,
    @Body() circleMembersDto: CircleMembersDto,
    @GetCurrentUserId() userId: string,
  ) {
    const { circleCode } = circleCodeDto;
    const role = circleMembersDto.role || 'member';
    try {
      const circle = await this.circleService.joinCircle(
        circleCode,
        userId,
        role,
      );
      return handleSuccess(circleJoinedSuccess, circle);
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
      return handleSuccess(fetchCircleMembersSuccess, circleMembers);
    } catch (error) {
      return handleError(error);
    }
  }

  @Delete('delete-member/:circleId/:userId')
  async deleteCircleMember(@Param() params) {
    try {
      const circle = await this.circleService.deleteCircleMember(
        params.circleId,
        params.userId,
      );
      return handleSuccess(deleteMemberSuccess, circle);
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
      return handleSuccess(fetchCircleSuccess, circleData);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-data-by-code/:circleCode')
  async getCircleDataByCode(@Param() params) {
    try {
      const circleData = await this.circleService.getCircleDetailsByCode(
        params.circleCode,
      );
      return handleSuccess(fetchCircleSuccess, circleData);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update-role/:circleId')
  async updateCircleRole(
    @Body() circleMembersDto: CircleMembersDto,
    @Param() params,
    @GetCurrentUserId() userId: string,
  ) {
    const { role } = circleMembersDto;

    try {
      const updatedMember = await this.circleService.updateCircleRole(
        userId,
        params.circleId,
        role,
      );

      return handleSuccess(updateMemberRoleSuccess, updatedMember);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-all')
  async getAllCircles(@GetCurrentUserId() userId: string) {
    try {
      const circles = await this.circleService.getAllCircles(userId);
      return handleSuccess(fetchCirclesSuccess, circles);
    } catch (error) {
      return handleError(error);
    }
  }
}
