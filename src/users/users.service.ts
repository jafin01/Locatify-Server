import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import {
  currentPasswordIncorrectError,
  insufficientDataError,
  mobileNoAlreadyExistsError,
} from 'src/constants/responseMessages';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ActiveStatus } from 'src/types/users.type';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  getAllUsers() {
    return new Promise((resolve, reject) => {
      try {
        const users = this.prismaService.user.findMany();
        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      try {
        const user = this.prismaService.user.findUnique({
          where: { email },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserById(userId: string) {
    return new Promise((resolve, reject) => {
      try {
        const user = this.prismaService.user.findUnique({
          where: { id: userId },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateMobileNumber(userId: string, userDto: UserDto) {
    return new Promise(async (resolve, reject) => {
      const { countryCode, mobileNo } = userDto;

      if (!countryCode || !mobileNo) throw new Error(insufficientDataError);
      try {
        const user: any = await this.getUserById(userId);

        if (
          user.countryCode.trim() === countryCode.trim() &&
          user.mobileNo.trim() === mobileNo.trim()
        )
          throw new Error(mobileNoAlreadyExistsError);

        const updatedUser = this.prismaService.user.update({
          where: { id: userId },
          data: { countryCode, mobileNo },
        });
        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateEmail(userId: string, userDto: UserDto) {
    return new Promise((resolve, reject) => {
      const { email } = userDto;
      try {
        const user = this.prismaService.user.update({
          where: { id: userId },
          data: { email },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  updatePassword(userId: string, userDto: UpdateUserDto) {
    return new Promise(async (resolve, reject) => {
      const { currentPassword, newPassword } = userDto;
      try {
        const user: any = await this.getUserById(userId);
        const passwordIsMatch = await argon2.verify(
          user.hashedPassword,
          currentPassword,
        );

        if (!passwordIsMatch) throw new Error(currentPasswordIncorrectError);

        const hashedPassword = await this.authService.hashData(newPassword);

        const updatedUser = this.prismaService.user.update({
          where: { id: userId },
          data: { hashedPassword },
        });
        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  async uploadProfilePicture(userId: string, file: any) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(file);
        const s3 = new S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
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
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteProfilePicture(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.getUserById(userId);
        const imageUrl = user.profilePicUrl;
        const fileName = imageUrl.split('/').pop();
        const s3 = new S3({
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
      } catch (error) {
        reject(error);
      }
    });
  }

  updateUser(userId: string, imageUrl: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.update({
          where: { id: userId },
          data: {
            profilePicUrl: imageUrl,
          },
        });
        resolve(user);
      } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  updateLastSeen(userId: string) {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  updateActiveStatus() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const users: any = await this.getAllUsers();

        await Promise.all(
          users.map(async (user) => {
            const { id } = user;
            const { activeStatus }: any = await this.getActiveStatus(id);
            const updatedUser = await this.prismaService.user.update({
              where: { id },
              data: { activeStatus },
            });
            return updatedUser;
          }),
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getActiveStatus(userId: string) {
    return new Promise(async (resolve, reject) => {
      const data: ActiveStatus = {
        activeStatus: '',
      };

      try {
        const user: any = await this.getUserById(userId);
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
        } else {
          await this.prismaService.user.update({
            where: { id: userId },
            data: { isActive: false },
          });
          if (minutes < 60) {
            data.activeStatus = `Active ${minutes} minutes ago`;
          } else {
            const hours = Math.floor(minutes / 60);
            data.activeStatus = `Active ${hours} hours ago`;
          }
        }
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteUserAccount(userId: string) {
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
      } catch (error) {
        reject(error);
      }
    });
  }
}
