import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { error, tokens } from 'src/types/tokens.type';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private usersService;
    private prismaService;
    private jwtService;
    constructor(usersService: UsersService, prismaService: PrismaService, jwtService: JwtService);
    hashData: (data: any) => Promise<string>;
    getTokens: (userId: string, email: string) => Promise<tokens | error>;
    updateRefreshTokenHash: (userId: string, refreshToken: string) => Promise<void>;
    userSignup: (authDto: any) => Promise<unknown>;
    userSignin: (loginDto: any) => Promise<unknown>;
    userLogout: (id: string) => Promise<void>;
    refreshTokens: (id: string, refreshToken: string) => Promise<unknown>;
}
