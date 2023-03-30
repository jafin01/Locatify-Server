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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
const errorMessages_1 = require("../constants/errorMessages");
const auth_service_1 = require("../auth/auth.service");
let UsersService = class UsersService {
    constructor(prismaService, authService) {
        this.prismaService = prismaService;
        this.authService = authService;
    }
    getAllUsers() {
        return new Promise((resolve, reject) => {
            try {
                const users = this.prismaService.user.findMany();
                resolve(users);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getUserById(userId) {
        return new Promise((resolve, reject) => {
            try {
                const user = this.prismaService.user.findUnique({
                    where: { id: userId },
                });
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateMobileNumber(userId, userDto) {
        return new Promise((resolve, reject) => {
            const { mobileNo } = userDto;
            try {
                const user = this.prismaService.user.update({
                    where: { id: userId },
                    data: { mobileNo },
                });
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateEmail(userId, userDto) {
        return new Promise((resolve, reject) => {
            const { email } = userDto;
            try {
                const user = this.prismaService.user.update({
                    where: { id: userId },
                    data: { email },
                });
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updatePassword(userId, userDto) {
        return new Promise(async (resolve, reject) => {
            const { currentPassword, newPassword } = userDto;
            try {
                const user = await this.getUserById(userId);
                const passwordIsMatch = await argon2.verify(user.hashedPassword, currentPassword);
                if (!passwordIsMatch)
                    throw new Error(errorMessages_1.passwordDoesNotMatchError);
                const hashedPassword = await this.authService.hashData(newPassword);
                const updatedUser = this.prismaService.user.update({
                    where: { id: userId },
                    data: { hashedPassword },
                });
                resolve(updatedUser);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateLastSeen(userId) {
        return new Promise((resolve, reject) => {
            try {
                const user = this.prismaService.user.update({
                    where: { id: userId },
                    data: { lastSeen: new Date() },
                });
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map