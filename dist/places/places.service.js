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
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const circle_service_1 = require("../circle/circle.service");
const errorMessages_1 = require("../constants/errorMessages");
const prisma_service_1 = require("../prisma/prisma.service");
let PlacesService = class PlacesService {
    constructor(prismaService, circleServices) {
        this.prismaService = prismaService;
        this.circleServices = circleServices;
        this.createPlace = (placesDto, circleId, userId) => {
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
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getPlaceById = (placeId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const place = await this.prismaService.places.findUnique({
                        where: {
                            id: placeId,
                        },
                    });
                    resolve(place);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getPlacesInCircle = (circleId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.circleServices.getCircleDetails(circleId);
                    if (!circle)
                        throw new Error(errorMessages_1.noCircleError);
                    const places = await this.prismaService.places.findMany({
                        where: {
                            circleId,
                        },
                    });
                    resolve(places);
                    return places;
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.deletePlace = (circleId, id) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.circleServices.getCircleDetails(circleId);
                    console.log(circle);
                    if (!circle)
                        throw new Error(errorMessages_1.noCircleError);
                    const place = await this.prismaService.places.delete({
                        where: {
                            id,
                        },
                    });
                    resolve(place);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.updatePlace = (placeDto, circleId, placeId, userId) => {
            return new Promise(async (resolve, reject) => {
                const { name, latitude, longitude } = placeDto;
                try {
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
                }
                catch (error) {
                    reject(error);
                }
            });
        };
    }
};
PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        circle_service_1.CircleService])
], PlacesService);
exports.PlacesService = PlacesService;
//# sourceMappingURL=places.service.js.map