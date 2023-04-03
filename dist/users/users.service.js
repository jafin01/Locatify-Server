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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
const errorMessages_1 = require("../constants/errorMessages");
const auth_service_1 = require("../auth/auth.service");
let UsersService = class UsersService {
    constructor(authService, prismaService) {
        this.authService = authService;
        this.prismaService = prismaService;
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
                    throw new Error(errorMessages_1.currentPasswordIncorrectError);
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
    getAllActiveUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const activeUsers = await this.prismaService.user.findMany({
                    where: { isActive: true },
                });
                resolve(activeUsers);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    countActiveUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const activeUsersCount = await this.prismaService.user.count({
                    where: { isActive: true },
                });
                resolve(activeUsersCount);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateLastSeen(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = this.prismaService.user.update({
                    where: { id: userId },
                    data: {
                        lastSeen: new Date(),
                        isActive: true,
                        activeStatus: 'Online',
                    },
                });
                await this.updateActiveStatus();
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateActiveStatus() {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.getAllUsers();
                const updatedUsers = await Promise.all(users.map(async (user) => {
                    const { id } = user;
                    const { activeStatus } = await this.getActiveStatus(id);
                    const updatedUser = await this.prismaService.user.update({
                        where: { id },
                        data: { activeStatus },
                    });
                    return updatedUser;
                }));
                console.log(updatedUsers);
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getActiveStatus(userId) {
        return new Promise(async (resolve, reject) => {
            const data = {
                activeStatus: '',
            };
            try {
                const user = await this.getUserById(userId);
                const lastSeen = new Date(user.lastSeen);
                const currentTime = new Date();
                const difference = currentTime.getTime() - lastSeen.getTime();
                const minutes = Math.floor(difference / 60000);
                const isOnline = minutes < 1;
                if (isOnline) {
                    await this.prismaService.user.update({
                        where: { id: userId },
                        data: { isActive: true },
                    });
                    data.activeStatus = 'Online';
                }
                else {
                    await this.prismaService.user.update({
                        where: { id: userId },
                        data: { isActive: false },
                    });
                    if (minutes < 60) {
                        data.activeStatus = `Active ${minutes} minutes ago`;
                    }
                    else {
                        const hours = Math.floor(minutes / 60);
                        data.activeStatus = `Active ${hours} hours ago`;
                    }
                }
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map