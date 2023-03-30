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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const errorMessages_1 = require("../constants/errorMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const user_dto_1 = require("./dto/user.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchUsersSuccess, users);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async getUserById(params) {
        const { userId } = params;
        try {
            const user = await this.userService.getUserById(userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.fetchUserSuccess, user);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async updateMobileNumber(userDto, userId) {
        try {
            const user = await this.userService.updateMobileNumber(userId, userDto);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.mobileUpdateSuccess, user);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async updateLastSeen(params) {
        const { userId } = params;
        try {
            const user = await this.userService.updateLastSeen(userId);
            return (0, returnHelpers_1.handleSuccess)(errorMessages_1.updateLastSeenSuccess, user);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
};
__decorate([
    (0, common_1.Get)('get-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('get-user/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('update-mobile-number'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMobileNumber", null);
__decorate([
    (0, common_1.Post)('update-last-seen/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLastSeen", null);
UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map