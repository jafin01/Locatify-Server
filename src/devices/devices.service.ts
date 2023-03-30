import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prismaService: PrismaService) {}

  createDevice(deviceDto, userId) {
    return new Promise(async (resolve, reject) => {
      const { device_type, device_version, app_version } = deviceDto;
      try {
        const device = await this.prismaService.devices.create({
          data: {
            user: { connect: { id: userId } },
            device_type,
            device_version,
            app_version,
          },
        });

        resolve(device);
        return device;
      } catch (error) {
        reject(error);
      }
    });
  }

  getDeviceById(deviceId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await this.prismaService.devices.findUnique({
          where: { id: deviceId },
        });

        resolve(device);
        return device;
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllDevices(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const devices = await this.prismaService.devices.findMany(userId);
        resolve(devices);
        return devices;
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteDevice(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await this.prismaService.devices.findUnique({
          where: { id },
        });

        if (!device) throw new ForbiddenException();

        const deletedDevice = await this.prismaService.devices.delete({
          where: { id },
        });

        resolve(deletedDevice);
        return deletedDevice;
      } catch (error) {
        reject(error);
      }
    });
  }
}
