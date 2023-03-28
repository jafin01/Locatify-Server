import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  createdLocationSuccess,
  fetchLocationSuccess,
  updateLocationSuccess,
} from 'src/constants/errorMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { LocationDto } from './dto/location.dto';
import { LocationsService } from './locations.service';

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('get-all/:circleId')
  async getLocations(@Param('circleId') circleId: string) {
    try {
      const locations = this.locationsService.getLocations(circleId);
      return handleSuccess(fetchLocationSuccess, locations);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-one/:circleId')
  async getLocation(
    @Param('circleId') circleId: string,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const location = await this.locationsService.getLocationByUser(
        userId,
        circleId,
      );
      return handleSuccess(fetchLocationSuccess, location);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-one-by-id/:locationId')
  async getLocationById(@Param('locationId') locationId: string) {
    try {
      const location = await this.locationsService.getLocationById(locationId);
      return handleSuccess(fetchLocationSuccess, location);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('create/:circleId')
  async createLocation(
    @Body() locationDto: LocationDto,
    @Param('circleId') circleId: string,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const location = await this.locationsService.createLocation(
        locationDto,
        userId,
        circleId,
      );

      return handleSuccess(createdLocationSuccess, location);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post('update/')
  async updateLocation(
    @Body() locationDto: LocationDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      const location = await this.locationsService.updateLocation(
        locationDto,
        userId,
      );
      return handleSuccess(updateLocationSuccess, location);
    } catch (error) {
      return handleError(error);
    }
  }
}
