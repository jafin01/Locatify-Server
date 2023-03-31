import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { passwordDoesNotMatchError } from 'src/constants/errorMessages';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
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

  getAllActiveUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const activeUsers = await this.prismaService.user.findMany({
          where: { isActive: true },
        });

        resolve(activeUsers);
        return activeUsers;
        
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
    })
    
  updatePassword(userId: string, userDto: UpdateUserDto) {
    return new Promise(async (resolve, reject) => {
      const { currentPassword, newPassword } = userDto;
      try {
        const user: any = await this.getUserById(userId);
        const passwordIsMatch = await argon2.verify(
          user.hashedPassword,
          currentPassword,
        );

        if (!passwordIsMatch) throw new Error(passwordDoesNotMatchError);

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

  updateLastSeen(userId: string) {
    return new Promise((resolve, reject) => {
      try {
        const user = this.prismaService.user.update({
          where: { id: userId },
          data: { lastSeen: new Date() },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}
