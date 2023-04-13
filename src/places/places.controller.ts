import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import {
  deletePlace,
  getPlaceById,
  getPlacesInCircle,
  placeCreateSuccess,
  updatedPlace,
} from 'src/constants/responseMessages';
import { handleError, handleSuccess } from 'src/helpers/returnHelpers';
import { PlacesDto } from './dto/places.dto';
import { PlacesService } from './places.service';

@Controller('api/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('create/:circleId')
  async createPlace(
    @Body() placesDto: PlacesDto,
    @GetCurrentUserId() userId: string,
    @Param() params,
  ) {
    try {
      const place: any = await this.placesService.createPlace(
        placesDto,
        params.circleId,
        userId,
      );

      return handleSuccess(placeCreateSuccess, place);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-one/:placeId')
  async getPlaceById(@Param() params) {
    try {
      const place: any = await this.placesService.getPlaceById(params.placeId);

      return handleSuccess(getPlaceById, place);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get('get-places-in-circle/:circleId')
  async getPlacesInCircle(@Param() params) {
    try {
      const places = await this.placesService.getPlacesInCircle(
        params.circleId,
      );
      return handleSuccess(getPlacesInCircle, places);
    } catch (error) {
      return handleError(error);
    }
  }

  @Delete('delete-one/:circleId/:placeId')
  async deletePlace(@Param() params) {
    try {
      const place = await this.placesService.deletePlace(
        params.circleId,
        params.placeId,
      );
      return handleSuccess(deletePlace, place);
    } catch (error) {
      return handleError(error);
    }
  }

  @Put('update-place/:circleId/:placeId')
  async updatePlace(
    @Body() placeDto: PlacesDto,
    @GetCurrentUserId() userId: string,
    @Param() params,
  ) {
    try {
      const place = await this.placesService.updatePlace(
        placeDto,
        params.circleId,
        params.placeId,
        userId,
      );
      return handleSuccess(updatedPlace, place);
    } catch (error) {
      return handleError(error);
    }
  }
}
