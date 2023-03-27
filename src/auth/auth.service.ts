import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import {
  accessDeniedError,
  hashError,
  invalidCredentialsError,
  logoutSuccess,
  userAlreadyExistsError,
} from 'src/constants/errorMessages';
import { JwtService } from '@nestjs/jwt';
import { error, tokens } from 'src/types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
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
            expiresIn: 60 * 15,
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
      const {
        mobileNo,
        firstName,
        lastName,
        email,
        password,
        locationTitle,
        latitude,
        longitude,
      } = authDto;

      try {
        const user = await this.prismaService.user.findUnique({
          where: { email },
        });

        if (user) {
          throw new Error(userAlreadyExistsError);
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

        const user = await this.prismaService.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error(invalidCredentialsError);
        }

        const isPassword = await argon2.verify(user.hashedPassword, password);

        if (!isPassword) {
          throw new Error(invalidCredentialsError);
        }

        const tokens: any = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        resolve({ user, tokens });
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
        const user = await this.prismaService.user.findUnique({
          where: {
            id,
          },
        });

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
