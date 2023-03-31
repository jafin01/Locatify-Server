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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const errorMessages_1 = require("../constants/errorMessages");
const prisma_service_1 = require("../prisma/prisma.service");
let LocationsService = class LocationsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    getLocations(circleId) {
        return new Promise(async (resolve, reject) => {
            try {
                const locations = await this.prismaService.location.findMany({
                    where: {
                        circleId,
                    },
                });
                if (locations.length === 0)
                    throw new Error(errorMessages_1.noLocationFoundError);
                resolve(locations);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getLocationByUser(userId, circleId) {
        return new Promise(async (resolve, reject) => {
            try {
                const location = await this.prismaService.location.findFirst({
                    where: {
                        AND: [{ userId: userId }, { circleId: circleId }],
                    },
                });
                if (!location)
                    throw new Error(errorMessages_1.noLocationFoundError);
                resolve(location);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getLocationById(locationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const location = await this.prismaService.location.findUnique({
                    where: {
                        id: locationId,
                    },
                });
                if (!location)
                    throw new Error(errorMessages_1.noLocationFoundError);
                resolve(location);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    createLocation(locationDto, userId, circleId) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateLocation(locationDto, circleId, userId) {
        return new Promise(async (resolve, reject) => {
            const { latitude, longitude } = locationDto;
            try {
                const locationToUpdate = await this.getLocationByUser(userId, circleId);
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
exports.LocationsService = LocationsService;
//# sourceMappingURL=locations.service.js.map