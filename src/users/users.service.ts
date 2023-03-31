import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  getAllActiveUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const activeUsers = await this.prismaService.user.findMany({
          where: { isActive: true },
        });

        resolve(activeUsers);
        return activeUsers;
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
  }
}
