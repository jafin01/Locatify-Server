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
exports.CircleController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const errorMessages_1 = require("../constants/errorMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const circle_service_1 = require("./circle.service");
const circle_dto_1 = require("./dto/circle.dto");
const circleCode_dto_1 = require("./dto/circleCode.dto");
const circleMembers_dto_1 = require("./dto/circleMembers.dto");
let CircleController = class CircleController {
    constructor(circleService) {
        this.circleService = circleService;
    }
    async createCircle(circleDto, userId) {
        try {
            const circle = await this.circleService.createCircle(circleDto, userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.circleCreatedSuccess, circle);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async joinCircle(circleCodeDto, circleMembersDto, userId) {
        const { circleCode } = circleCodeDto;
        const role = circleMembersDto.role || 'member';
        try {
            const circle = await this.circleService.joinCircle(circleCode, userId, role);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.circleJoinedSuccess, circle);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getAllCircleMembers(params) {
        try {
            const circleMembers = await this.circleService.getAllCircleMembers(params.circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchCircleMembersSuccess, circleMembers);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async deleteCircleMember(params) {
        try {
            const circle = await this.circleService.deleteCircleMember(params.circleId, params.userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.deleteMemberSuccess, circle);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getCircleData(params) {
        try {
            const circleData = await this.circleService.getCircleDetails(params.circleId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchCircleSuccess, circleData);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getCircleDataByCode(params) {
        try {
            const circleData = await this.circleService.getCircleDetailsByCode(params.circleCode);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchCircleSuccess, circleData);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async updateCircleRole(circleMembersDto, params, userId) {
        const { role } = circleMembersDto;
        try {
            const updatedMember = await this.circleService.updateCircleRole(userId, params.circleId, role);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.updateMemberRoleSuccess, updatedMember);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getAllCircles(userId) {
        try {
            const circles = await this.circleService.getAllCircles(userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchCirclesSuccess, circles);
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
    __metadata("design:paramtypes", [circle_dto_1.CircleDto, String]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "createCircle", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [circleCode_dto_1.CircleCodeDto,
        circleMembers_dto_1.CircleMembersDto, String]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "joinCircle", null);
__decorate([
    (0, common_1.Get)('get-members/:circleId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "getAllCircleMembers", null);
__decorate([
    (0, common_1.Delete)('delete-member/:circleId/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "deleteCircleMember", null);
__decorate([
    (0, common_1.Get)('get-data/:circleId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "getCircleData", null);
__decorate([
    (0, common_1.Get)('get-data-by-code/:circleCode'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "getCircleDataByCode", null);
__decorate([
    (0, common_1.Post)('update-role/:circleId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [circleMembers_dto_1.CircleMembersDto, Object, String]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "updateCircleRole", null);
__decorate([
    (0, common_1.Get)('get-all'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CircleController.prototype, "getAllCircles", null);
CircleController = __decorate([
    (0, common_1.Controller)('api/circle'),
    __metadata("design:paramtypes", [circle_service_1.CircleService])
], CircleController);
exports.CircleController = CircleController;
//# sourceMappingURL=circle.controller.js.map