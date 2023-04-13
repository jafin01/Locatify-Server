import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  createdDevice,
  deleteDevice,
  getDeviceById,
  getDevices,
} from 'src/constants/responseMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { DevicesService } from './devices.service';
import { DevicesDto } from './dto/devices.dto';

@Controller('api/devices')
export class DevicesController {
  constructor(private deviceServices: DevicesService) {}

  @Post('create')
  async createDevice(
    @Body() deviceDto: DevicesDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const device = await this.deviceServices.createDevice(deviceDto, userId);
      return handleSuccess(createdDevice, device);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-one-device/:deviceId')
  async getDeviceById(@Param() params) {
    try {
      const device = await this.deviceServices.getDeviceById(params.deviceId);
      return handleSuccess(getDeviceById, device);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-all-devices')
  async getAllDevices(@GetCurrentUserId() userId: string) {
    try {
      const devices = await this.deviceServices.getAllDevices(userId);
      return handleSuccess(getDevices, devices);
    } catch (error) {
      return handleError(error);
    }
  }

  @Delete('delete-one/:deviceId')
  async deleteDevice(@Param() params) {
    try {
      const device = await this.deviceServices.deleteDevice(params.deviceId);
      return handleSuccess(deleteDevice, device);
    } catch (error) {
      return handleError(error);
    }
  }
}
