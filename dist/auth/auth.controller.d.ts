import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mailer/mail.service';
export declare class AuthController {
    private authService;
    private mailService;
    constructor(authService: AuthService, mailService: MailService);
    userSignup(authDto: AuthDto): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    userSignin(loginDto: LoginDto): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    userLogout(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    forgetPassword(verifyEmailDto: VerifyEmailDto): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
}
