import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionTimeDto } from './dto/sessionTime.dto';

@Injectable()
export class SessiontimeService {
  constructor(private prismaService: PrismaService) {}

  async createSessionTime(sessionTimeDto: SessionTimeDto, userId) {
    return new Promise(async (resolve, reject) => {
      const currentTime = new Date().toISOString();
      try {
        const sessionTime = await this.prismaService.sessionTime.create({
          data: {
            user: { connect: { id: userId } },
            inTime: currentTime,
          },
        });
        resolve(sessionTime);
      } catch (error) {
        reject(error);
      }
    });
  }

  async endSession(userId) {
    return new Promise(async (resolve, reject) => {
      const currentTime = new Date().toISOString();
      try {
        const endedSession = await this.prismaService.sessionTime.updateMany({
          where: {
            userId,
            outTime: null,
          },
          data: {
            outTime: currentTime,
          },
        });
        resolve(endedSession);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getSessions(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const sessionTimes = await this.prismaService.sessionTime.findMany({
          where: { userId },
          select: { inTime: true, outTime: true },
        });

        const totalSessionTime = sessionTimes.reduce((acc, curr) => {
          const diff = +curr.outTime.getTime() - +curr.inTime.getTime();
          console.log(diff);
          acc += diff;
          return acc / 60000;
        }, 0);

        resolve(totalSessionTime);
      } catch (error) {
        reject(error);
      }
    });
  }
}
