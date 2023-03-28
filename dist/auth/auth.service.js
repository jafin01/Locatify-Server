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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
const errorMessages_1 = require("../constants/errorMessages");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prismaService, jwtService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.hashData = async (data) => {
            try {
                const hash = await argon2.hash(data);
                return hash;
            }
            catch (error) {
                throw new Error(errorMessages_1.hashError);
            }
        };
        this.getTokens = async (userId, email) => {
            try {
                const [accessToken, refreshToken] = await Promise.all([
                    this.jwtService.signAsync({
                        sub: userId,
                        email,
                    }, {
                        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                        expiresIn: 60 * 15,
                    }),
                    this.jwtService.signAsync({
                        sub: userId,
                        email,
                    }, {
                        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                        expiresIn: 60 * 60 * 24 * 7,
                    }),
                ]);
                return {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                };
            }
            catch (error) {
                return {
                    message: error.message,
                    stack: error.stack,
                };
            }
        };
        this.updateRefreshTokenHash = async (userId, refreshToken) => {
            try {
                const hashedRefreshToken = await this.hashData(refreshToken);
                await this.prismaService.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        hashedRefreshToken,
                    },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        };
        this.userSignup = (authDto) => {
            return new Promise(async (resolve, reject) => {
                const { mobileNo, firstName, lastName, email, password, locationTitle, latitude, longitude, } = authDto;
                try {
                    const user = await this.prismaService.user.findUnique({
                        where: { email },
                    });
                    if (user) {
                        throw new Error(errorMessages_1.userAlreadyExistsError);
                    }
                    const hashedPassword = await this.hashData(password);
                    const newUser = await this.prismaService.user.create({
                        data: {
                            mobileNo: mobileNo,
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            hashedPassword,
                        },
                    });
                    if (locationTitle && latitude && longitude) {
                        await this.prismaService.location.create({
                            data: {
                                title: locationTitle,
                                latitude,
                                longitude,
                                user: { connect: { id: newUser.id } },
                            },
                        });
                    }
                    const tokens = await this.getTokens(newUser.id, newUser.email);
                    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
                    resolve({ newUser, tokens });
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.userSignin = (loginDto) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { email, password } = loginDto;
                    const user = await this.prismaService.user.findUnique({
                        where: {
                            email,
                        },
                    });
                    if (!user) {
                        throw new Error(errorMessages_1.invalidCredentialsError);
                    }
                    const isPassword = await argon2.verify(user.hashedPassword, password);
                    if (!isPassword) {
                        throw new Error(errorMessages_1.invalidCredentialsError);
                    }
                    const tokens = await this.getTokens(user.id, user.email);
                    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
                    resolve({ user, tokens });
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.userLogout = (id) => {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.prismaService.user.updateMany({
                        where: {
                            id,
                            hashedRefreshToken: {
                                not: null,
                            },
                        },
                        data: {
                            hashedRefreshToken: null,
                        },
                    });
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.refreshTokens = (id, refreshToken) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const user = await this.prismaService.user.findUnique({
                        where: {
                            id,
                        },
                    });
                    if (!user || !user.hashedRefreshToken) {
                        throw new Error(errorMessages_1.accessDeniedError);
                    }
                    const isRefreshTokenMatch = await argon2.verify(user.hashedRefreshToken, refreshToken);
                    if (!isRefreshTokenMatch)
                        throw new Error(errorMessages_1.accessDeniedError);
                    const tokens = await this.getTokens(user.id, user.email);
                    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
                    resolve({ user, tokens });
                }
                catch (error) {
                    reject(error);
                }
            });
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map