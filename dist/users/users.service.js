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
const responseMessages_1 = require("../constants/responseMessages");
const auth_service_1 = require("../auth/auth.service");
const uuid_1 = require("uuid");
const aws_sdk_1 = require("aws-sdk");
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
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            try {
                const user = this.prismaService.user.findUnique({
                    where: { email },
                });
                resolve(user);
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
        return new Promise(async (resolve, reject) => {
            const { countryCode, mobileNo } = userDto;
            if (!countryCode || !mobileNo)
                throw new Error(responseMessages_1.insufficientDataError);
            try {
                const user = await this.getUserById(userId);
                if (user.countryCode.trim() === countryCode.trim() &&
                    user.mobileNo.trim() === mobileNo.trim())
                    throw new Error(responseMessages_1.mobileNoAlreadyExistsError);
                const updatedUser = this.prismaService.user.update({
                    where: { id: userId },
                    data: { countryCode, mobileNo },
                });
                resolve(updatedUser);
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
                    throw new Error(responseMessages_1.currentPasswordIncorrectError);
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
    async uploadProfilePicture(userId, file) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(file);
                const s3 = new aws_sdk_1.S3({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                });
                const fileExtension = file.originalname.split('.').pop();
                const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
                const uploadParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                    Body: file.buffer,
                    ACL: 'public-read',
                };
                await s3.upload(uploadParams).promise();
                console.log('File uploaded to S3');
                const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
                const updatedUser = await this.updateUser(userId, imageUrl);
                resolve(updatedUser);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteProfilePicture(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUserById(userId);
                const imageUrl = user.profilePicUrl;
                const fileName = imageUrl.split('/').pop();
                const s3 = new aws_sdk_1.S3({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                });
                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                };
                await s3.deleteObject(deleteParams).promise();
                console.log('File deleted from S3');
                const updatedUser = await this.updateUser(userId, null);
                resolve(updatedUser);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateUser(userId, imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.prismaService.user.update({
                    where: { id: userId },
                    data: {
                        profilePicUrl: imageUrl,
                    },
                });
                resolve(user);
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
                        otp: null,
                        otpExpiresAt: null,
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
                await Promise.all(users.map(async (user) => {
                    const { id } = user;
                    const { activeStatus } = await this.getActiveStatus(id);
                    const updatedUser = await this.prismaService.user.update({
                        where: { id },
                        data: { activeStatus },
                    });
                    return updatedUser;
                }));
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
    deleteUserAccount(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prismaService.circleMembers.deleteMany({
                    where: { userId },
                });
                await this.prismaService.location.deleteMany({
                    where: { userId },
                });
                await this.prismaService.places.deleteMany({
                    where: { userId },
                });
                await this.prismaService.devices.deleteMany({
                    where: { userId },
                });
                await this.prismaService.sessionTime.deleteMany({
                    where: { userId },
                });
                const user = this.prismaService.user.delete({
                    where: { id: userId },
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
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map