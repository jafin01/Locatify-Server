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
exports.CircleService = void 0;
const common_1 = require("@nestjs/common");
const circleConstants_1 = require("../constants/circleConstants");
const responseMessages_1 = require("../constants/responseMessages");
const prisma_service_1 = require("../prisma/prisma.service");
const responseMessages_2 = require("../constants/responseMessages");
let CircleService = class CircleService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.createCircle = (circleDto, userId) => {
            const { title, description } = circleDto;
            const circleCode = this.generateCircleCode(6);
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.prismaService.circle.create({
                        data: {
                            title,
                            circleCode,
                            description,
                            createdUser: { connect: { id: userId } },
                        },
                    });
                    const role = 'Admin';
                    await this.createCircleMember(userId, circle.id, role);
                    resolve(circle);
                    return circle;
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.createCircleMember = (userId, circleId, role) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const createdMember = await this.prismaService.circleMembers.create({
                        data: {
                            member: { connect: { id: userId } },
                            circle: { connect: { id: circleId } },
                            role,
                        },
                    });
                    resolve(createdMember);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.joinCircle = (circleCode, userId, role) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.prismaService.circle.findFirst({
                        where: {
                            circleCode,
                        },
                    });
                    if (!circle)
                        throw new Error(responseMessages_1.noCircleFoundError);
                    const isValidCode = new Date() < circle.codeExpiresAt;
                    if (!isValidCode) {
                        throw new Error(responseMessages_1.codeExpiredError);
                    }
                    const isExistingMember = await this.prismaService.circleMembers.findFirst({
                        where: {
                            circleId: circle.id,
                            userId,
                        },
                    });
                    if (isExistingMember)
                        throw new Error(responseMessages_2.userAlreadyExistsError);
                    await this.createCircleMember(userId, circle.id, role);
                    resolve(circle);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.addCircleMember = (circleId, userId, role) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const isExistingMember = await this.prismaService.circleMembers.findFirst({
                        where: {
                            circleId,
                            userId,
                        },
                    });
                    if (isExistingMember)
                        throw new Error(responseMessages_2.userAlreadyExistsError);
                    const createdMember = await this.createCircleMember(userId, circleId, role);
                    resolve(createdMember);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getCircleDetailsByCode = (circleCode) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.prismaService.circle.findFirst({
                        where: {
                            circleCode,
                        },
                    });
                    if (!circle)
                        throw new Error(responseMessages_1.codeInvalidError);
                    resolve(circle);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getAllCircleMembers = (circleId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.getCircleDetails(circleId);
                    if (!circle)
                        throw new Error(responseMessages_1.noCircleFoundError);
                    const members = await this.prismaService.circleMembers.findMany({
                        where: {
                            circleId,
                        },
                    });
                    const circleMembers = await Promise.all(members.map(async (member) => {
                        const user = await this.prismaService.user.findFirst({
                            where: {
                                id: member.userId,
                            },
                        });
                        return user;
                    }));
                    resolve(circleMembers);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getCircleMember = (userId, circleId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circleMember = await this.prismaService.circleMembers.findFirst({
                        where: {
                            AND: [{ userId: userId }, { circleId: circleId }],
                        },
                    });
                    resolve(circleMember);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.deleteCircleMember = (circleId, userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const member = await this.getCircleMember(userId, circleId);
                    if (!member)
                        throw new Error(responseMessages_1.noCircleMemberError);
                    const deletedMember = await this.prismaService.circleMembers.delete({
                        where: {
                            id: member.id,
                        },
                    });
                    resolve(deletedMember);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getCircleDetails = (circleId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circle = await this.prismaService.circle.findUnique({
                        where: {
                            id: circleId,
                        },
                    });
                    if (!circle)
                        throw new Error(responseMessages_1.noCircleFoundError);
                    resolve(circle);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.updateCircleRole = (userId, circleId, role) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const member = await this.getCircleMember(userId, circleId);
                    const updatedMember = await this.prismaService.circleMembers.update({
                        where: {
                            id: member.id,
                        },
                        data: {
                            role,
                        },
                    });
                    resolve(updatedMember);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.getAllCircles = (userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const circles = await this.prismaService.circleMembers.findMany({
                        where: {
                            userId,
                        },
                    });
                    const circleDetails = await Promise.all(circles.map(async (circle) => {
                        const circleData = await this.getCircleDetails(circle.circleId);
                        return circleData;
                    }));
                    resolve(circleDetails);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.generateCircleCode = (length) => {
            let result = '';
            const charactersLength = circleConstants_1.characters.length;
            for (let i = 0; i < length; i++) {
                result += circleConstants_1.characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
    }
};
CircleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CircleService);
exports.CircleService = CircleService;
//# sourceMappingURL=circle.service.js.map