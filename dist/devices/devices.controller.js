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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const responseMessages_1 = require("../constants/responseMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const devices_service_1 = require("./devices.service");
const devices_dto_1 = require("./dto/devices.dto");
let DevicesController = class DevicesController {
    constructor(deviceServices) {
        this.deviceServices = deviceServices;
    }
    async createDevice(deviceDto, userId) {
        try {
            const device = await this.deviceServices.createDevice(deviceDto, userId);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.createdDevice, device);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getDeviceById(params) {
        try {
            const device = await this.deviceServices.getDeviceById(params.deviceId);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.getDeviceById, device);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getAllDevices(userId) {
        try {
            const devices = await this.deviceServices.getAllDevices(userId);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.getDevices, devices);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async deleteDevice(params) {
        try {
            const device = await this.deviceServices.deleteDevice(params.deviceId);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.deleteDevice, device);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devices_dto_1.DevicesDto, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createDevice", null);
__decorate([
    (0, common_1.Get)('get-one-device/:deviceId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceById", null);
__decorate([
    (0, common_1.Get)('get-all-devices'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getAllDevices", null);
__decorate([
    (0, common_1.Delete)('delete-one/:deviceId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "deleteDevice", null);
DevicesController = __decorate([
    (0, common_1.Controller)('api/devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map