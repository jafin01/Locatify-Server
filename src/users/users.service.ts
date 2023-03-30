import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
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
