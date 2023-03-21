import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { characters } from 'src/constants/circleConstants';
import { noCircleError } from 'src/constants/errorMessages';
import { PrismaService } from 'src/prisma/prisma.service';
import { userAlreadyExistsError } from 'src/constants/errorMessages';
@Injectable()
export class CircleService {
  constructor(private prismaService: PrismaService) {}
  id: number;
  name: string;
  circleMembers: User[];
  createCircle = (circleDto, userId) => {
    const { title, description } = circleDto;

    const circleCode = this.generateCircleCode(6);

    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.prismaService.circle.create({
          data: {
            title,
            circleCode,
            description,
            createdUser: { connect: { id: userId } },
          },
        });

        await this.prismaService.circleMembers.create({
          data: {
            members: { connect: { id: userId } },
            circle: { connect: { id: circle.id } },
          },
        });

        resolve(circle);
        return circle;
      } catch (error) {
        reject(error);
      }
    });
  };

  joinCircle = async (circleCodeDto, userId) => {
    const { circleCode } = circleCodeDto;
    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.prismaService.circle.findFirst({
          where: {
            circleCode,
          },
        });

        if (!circle) throw new Error(noCircleError);

        const isExistingMember =
          await this.prismaService.circleMembers.findFirst({
            where: {
              circleId: circle.id,
              userId,
            },
          });

        if (isExistingMember) throw new Error(userAlreadyExistsError);

        const members = await this.prismaService.circleMembers.create({
          data: {
            members: {
              connect: { id: userId },
            },
            circle: {
              connect: { id: circle.id },
            },
          },
        });

        resolve(members);
      } catch (error) {
        reject(error);
      }
    });
  };

  getAllCircleMembers = (circleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circle = this.getCircleDetails(circleId);

        if (!circle) throw new Error(noCircleError);

        const membersId: any = await this.prismaService.circleMembers.findMany({
          where: {
            circleId,
          },
        });

        const circleMembers = await this.prismaService.user.findMany({
          where: {
            id: {
              in: membersId.userId,
            },
          },
        });

        resolve(circleMembers);
      } catch (error) {
        reject(error);
      }
    });
  };

  getCircleDetails = (circleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.prismaService.circle.findUnique({
          where: {
            id: circleId,
          },
        });

        resolve(circle);
      } catch (error) {
        reject(error.message);
      }
    });
  };

  generateCircleCode = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };
}
