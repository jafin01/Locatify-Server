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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const errorMessages_1 = require("../constants/errorMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const location_dto_1 = require("./dto/location.dto");
const locations_service_1 = require("./locations.service");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async getLocations(circleId) {
        try {
            const locations = await this.locationsService.getLocations(circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchLocationSuccess, locations);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getLocation(circleId, userId) {
        try {
            const location = await this.locationsService.getLocationByUser(userId, circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchLocationSuccess, location);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getLocationById(locationId) {
        try {
            const location = await this.locationsService.getLocationById(locationId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchLocationSuccess, location);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async createLocation(locationDto, circleId, userId) {
        try {
            const location = await this.locationsService.createLocation(locationDto, userId, circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.createdLocationSuccess, location);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async updateLocation(locationDto, circleId, userId) {
        try {
            const location = await this.locationsService.updateLocation(locationDto, circleId, userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.updateLocationSuccess, location);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
};
__decorate([
    (0, common_1.Get)('get-all/:circleId'),
    __param(0, (0, common_1.Param)('circleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('get-one/:circleId/:userId'),
    __param(0, (0, common_1.Param)('circleId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocation", null);
__decorate([
    (0, common_1.Get)('get-one-by-id/:locationId'),
    __param(0, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationById", null);
__decorate([
    (0, common_1.Post)('create/:circleId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('circleId')),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.LocationDto, String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Post)('update/:circleId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('circleId')),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.LocationDto, String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "updateLocation", null);
LocationsController = __decorate([
    (0, common_1.Controller)('api/locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
exports.LocationsController = LocationsController;
//# sourceMappingURL=locations.controller.js.map