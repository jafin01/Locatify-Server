import { Injectable } from '@nestjs/common';
import { CircleService } from 'src/circle/circle.service';
import { noCircleError } from 'src/constants/errorMessages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlacesService {
  constructor(
    private prismaService: PrismaService,
    private circleServices: CircleService,
  ) { }

  createPlace = (placesDto, circleId, userId) => {
    const { name, latitude, longitude } = placesDto;

    return new Promise(async (resolve, reject) => {
      try {
        const place = await this.prismaService.places.create({
          data: {
            name,
            latitude,
            longitude,
            user: { connect: { id: userId } },
            circle: { connect: { id: circleId } },
          },
        });

        resolve(place);
        return place;
      } catch (error) {
        reject(error);
      }
    });
  };

  getPlaceById = (placeId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const place = await this.prismaService.places.findUnique({
          where: {
            id: placeId,
          },
        });
        resolve(place);
      } catch (error) {
        reject(error);
      }
    });
  };

  getPlacesInCircle = (circleId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.circleServices.getCircleDetails(circleId);

        if (!circle) throw new Error(noCircleError);

        const places = await this.prismaService.places.findMany({
          where: {
            circleId,
          },
        });
        resolve(places);
        return places;
      } catch (error) {
        reject(error);
      }
    });
  };

  deletePlace = (circleId: string, id: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.circleServices.getCircleDetails(circleId);
        console.log(circle);
        if (!circle) throw new Error(noCircleError);
        const place = await this.prismaService.places.delete({
          where: {
            id,
          },
        });
        resolve(place);
      } catch (error) {
        reject(error);
      }
    });
  };

  updatePlace = (
    placeDto,
    circleId: string,
    placeId: string,
    userId: string,
  ) => {
    return new Promise(async (resolve, reject) => {
      const { name, latitude, longitude } = placeDto;
      try {
        // const circle = await this.circleServices.getCircleDetails(circleId);
        // if (!circle) throw new Error(noCircleError);

        const place = await this.prismaService.places.update({
          where: { id: placeId },
          data: {
            name,
            latitude,
            longitude,
            user: { connect: { id: userId } },
            circle: { connect: { id: circleId } },
          },
        });

        resolve(place);
      } catch (error) {
        reject(error);
      }
    });
  };
}
