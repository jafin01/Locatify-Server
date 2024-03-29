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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorator/get-current-user-id.decorator");
const get_current_user_decorator_1 = require("../common/decorator/get-current-user.decorator");
const public_decorator_1 = require("../common/decorator/public.decorator");
const refreshToken_guard_1 = require("../common/guards/refreshToken.guard");
const responseMessages_1 = require("../constants/responseMessages");
const returnHelpers_1 = require("../helpers/returnHelpers");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const login_dto_1 = require("./dto/login.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const mail_service_1 = require("../mailer/mail.service");
let AuthController = class AuthController {
    constructor(authService, mailService) {
        this.authService = authService;
        this.mailService = mailService;
    }
    async userSignup(authDto) {
        try {
            const data = await this.authService.userSignup(authDto);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.registerSuccess, data.newUser, data.tokens);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async userSignin(loginDto) {
        try {
            const data = await this.authService.userSignin(loginDto);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.loginSuccess, data.userDetails, data.tokens);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async userLogout(userId) {
        try {
            await this.authService.userLogout(userId);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.logoutSuccess);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async refreshTokens(userId, refreshToken) {
        try {
            const response = await this.authService.refreshTokens(userId, refreshToken);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.refreshTokenSuccess, response.user, response.tokens);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async forgetPassword(verifyEmailDto) {
        try {
            const { email } = verifyEmailDto;
            const data = await this.mailService.sendOtpInMail(email);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.OTPSentSuccess, data);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
    async resetPassword(resetPasswordDto, userId) {
        const { otp, password } = resetPasswordDto;
        try {
            const data = await this.mailService.verifyOtpAndResetPassword(userId, otp, password);
            return (0, returnHelpers_1.handleSuccess)(responseMessages_1.passwordResetSuccess, data);
        }
        catch (error) {
            return (0, returnHelpers_1.handleError)(error);
        }
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('local/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userSignup", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('local/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userSignin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userLogout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, get_current_user_decorator_1.GetCurrentUser)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('password/forget'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('password/reset/:userId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map