import { Injectable } from '@nestjs/common';
import { noLocationFoundError } from 'src/constants/errorMessages';
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

        if (locations.length === 0) throw new Error(noLocationFoundError);

        const responseToClient = await Promise.all(
          locations.map(async (location) => {
            const { userId } = location;
            const userData = await this.prismaService.user.findUnique({
              where: {
                id: userId,
              },
            });

            return {
              ...location,
              userData,
            };
          }),
        );

        resolve(responseToClient);
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

        if (!location) throw new Error(noLocationFoundError);

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

        if (!location) throw new Error(noLocationFoundError);

        resolve(location);
      } catch (error) {
        reject(error);
      }
    });
  }

  createLocation(locationDto: any, userId: string, circleId: string) {
    return new Promise(async (resolve, reject) => {
      const latitude = locationDto.latitude || 0.0;
      const longitude = locationDto.longitude || 0.0;

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

  updateLocation(locationDto: any, circleId: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      const { latitude, longitude } = locationDto;
      try {
        const locationToUpdate: any = await this.getLocationByUser(
          userId,
          circleId,
        );

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
