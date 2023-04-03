import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { currentPasswordIncorrectError } from 'src/constants/errorMessages';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ActiveStatus } from 'src/types/users.type';

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
    return new Promise((resolve, reject) => {
      const { mobileNo } = userDto;
      try {
        const user = this.prismaService.user.update({
          where: { id: userId },
          data: { mobileNo },
        });
        resolve(user);
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

        const updatedUsers = await Promise.all(
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

        console.log(updatedUsers);

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
}
