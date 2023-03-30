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
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const errorMessages_1 = require("../constants/errorMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const places_dto_1 = require("./dto/places.dto");
const places_service_1 = require("./places.service");
let PlacesController = class PlacesController {
    constructor(placesService) {
        this.placesService = placesService;
    }
    async createPlace(placesDto, userId, params) {
        try {
            const place = await this.placesService.createPlace(placesDto, params.circleId, userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.placeCreateSuccess, place);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getPlaceById(params) {
        try {
            const place = await this.placesService.getPlaceById(params.placeId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.getPlaceById, place);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getPlacesInCircle(params) {
        try {
            const places = await this.placesService.getPlacesInCircle(params.circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.getPlacesInCircle, places);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async deletePlace(params) {
        try {
            const place = await this.placesService.deletePlace(params.circleId, params.placeId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.deletePlace, place);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async updatePlace(placeDto, userId, params) {
        try {
            const place = await this.placesService.updatePlace(placeDto, params.circleId, params.placeId, userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.updatedPlace, place);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
};
__decorate([
    (0, common_1.Post)('create/:circleId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [places_dto_1.PlacesDto, String, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "createPlace", null);
__decorate([
    (0, common_1.Get)('get-one/:placeId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "getPlaceById", null);
__decorate([
    (0, common_1.Get)('get-places-in-circle/:circleId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "getPlacesInCircle", null);
__decorate([
    (0, common_1.Delete)('delete-one/:circleId/:placeId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "deletePlace", null);
__decorate([
    (0, common_1.Put)('update-place/:circleId/:placeId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [places_dto_1.PlacesDto, String, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "updatePlace", null);
PlacesController = __decorate([
    (0, common_1.Controller)('api/places'),
    __metadata("design:paramtypes", [places_service_1.PlacesService])
], PlacesController);
exports.PlacesController = PlacesController;
//# sourceMappingURL=places.controller.js.map