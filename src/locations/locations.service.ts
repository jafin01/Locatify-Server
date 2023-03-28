import { Injectable } from '@nestjs/common';
import { fetchLocationError } from 'src/constants/errorMessages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prismaService: PrismaService) {}

  getLocations(circleId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const locations = await this.prismaService.location.findMany({
          where: {
            circleId,
          },
        });

        resolve(locations);
      } catch (error) {
        reject(error);
      }
    });
  }

  getLocationByUser(userId: string, circleId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const location = await this.prismaService.location.findFirst({
          where: {
            AND: [{ userId: userId }, { circleId: circleId }],
          },
        });

        resolve(location);
      } catch (error) {
        reject(error);
      }
    });
  }

  getLocationById(locationId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const location = await this.prismaService.location.findUnique({
          where: {
            id: locationId,
          },
        });

        resolve(location);
      } catch (error) {
        reject(error);
      }
    });
  }

  createLocation(locationDto: any, userId: string, circleId: string) {
    return new Promise(async (resolve, reject) => {
      const { latitude, longitude } = locationDto;
      try {
        const location = await this.prismaService.location.create({
          data: {
            latitude,
            longitude,
            circle: { connect: { id: circleId } },
            user: { connect: { id: userId } },
          },
        });

        resolve(location);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateLocation(locationDto: any, userId: string) {
    return new Promise(async (resolve, reject) => {
      const { circleId, latitude, longitude } = locationDto;
      try {
        const locationToUpdate: any = await this.getLocationByUser(
          userId,
          circleId,
        );

        if (!locationToUpdate) {
          throw new Error(fetchLocationError);
        }

        const location = await this.prismaService.location.update({
          where: {
            id: locationToUpdate.id,
          },
          data: {
            latitude,
            longitude,
          },
        });

        resolve(location);
      } catch (error) {
        reject(error);
      }
    });
  }
}
