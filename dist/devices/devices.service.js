"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DevicesService = class DevicesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getDeviceById(deviceId) {
        return new Promise(async (resolve, reject) => {
            try {
                const device = await this.prismaService.devices.findUnique({
                    where: { id: deviceId },
                });
                resolve(device);
                return device;
            }
            catch (error) {
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
            }
            catch (error) {
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
                if (!device)
                    throw new common_1.ForbiddenException();
                const deletedDevice = await this.prismaService.devices.delete({
                    where: { id },
                });
                resolve(deletedDevice);
                return deletedDevice;
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map