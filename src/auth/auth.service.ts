import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import {
  accessDeniedError,
  hashError,
  invalidCredentialsError,
  userAlreadyExistsError,
} from 'src/constants/responseMessages';
import { JwtService } from '@nestjs/jwt';
import { error, tokens } from 'src/types/tokens.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  hashData = async (data) => {
    try {
      const hash = await argon2.hash(data);
      return hash;
    } catch (error) {
      throw new Error(hashError);
    }
  };

  getTokens = async (
    userId: string,
    email: string,
  ): Promise<tokens | error> => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
          },
          {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: 60 * 60 * 24 * 3,
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
          },
          {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: 60 * 60 * 24 * 7,
          },
        ),
      ]);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      return {
        message: error.message,
        stack: error.stack,
      };
    }
  };

  updateRefreshTokenHash = async (userId: string, refreshToken: string) => {
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
    } catch (error) {
      throw new Error(error.message);
    }
  };

  userSignup = (authDto) => {
    return new Promise(async (resolve, reject) => {
      const { countryCode, mobileNo, firstName, lastName, email, password } =
        authDto;

      try {
        const user = await this.usersService.getUserByEmail(email);

        if (user) {
          throw new Error(userAlreadyExistsError);
        }

        const hashedPassword = await this.hashData(password);

        const newUser = await this.prismaService.user.create({
          data: {
            countryCode: countryCode,
            mobileNo: mobileNo,
            firstName: firstName,
            lastName: lastName,
            email: email,
            hashedPassword,
          },
        });

        const tokens: any = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

        resolve({ newUser, tokens });
      } catch (error) {
        reject(error);
      }
    });
  };

  userSignin = (loginDto) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = loginDto;

        const user: any = await this.usersService.getUserByEmail(email);

        if (!user) {
          throw new Error(invalidCredentialsError);
        }

        const isPassword = await argon2.verify(user.hashedPassword, password);

        if (!isPassword) {
          throw new Error(invalidCredentialsError);
        }

        const tokens: any = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        const circles = await this.prismaService.circle.findMany({
          where: {
            circleMembers: {
              some: {
                userId: user.id,
              },
            },
          },
        });

        const userDetails: any = { user: user, circles: circles };

        const updatedUser = await this.usersService.updateLastSeen(user.id);

        userDetails.user = updatedUser;

        resolve({ userDetails, tokens });
      } catch (error) {
        reject(error);
      }
    });
  };

  userLogout = (id: string) => {
    return new Promise<void>(async (resolve, reject) => {
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
      } catch (error) {
        reject(error);
      }
    });
  };

  refreshTokens = (id: string, refreshToken: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.usersService.getUserById(id);

        if (!user || !user.hashedRefreshToken) {
          throw new Error(accessDeniedError);
        }

        const isRefreshTokenMatch = await argon2.verify(
          user.hashedRefreshToken,
          refreshToken,
        );

        if (!isRefreshTokenMatch) throw new Error(accessDeniedError);

        const tokens: any = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        resolve({ user, tokens });
      } catch (error) {
        reject(error);
      }
    });
  };
}
