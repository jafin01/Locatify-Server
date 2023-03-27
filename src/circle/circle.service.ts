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
        const role = 'Admin';
        await this.createCircleMember(userId, circle.id, role);

        resolve(circle);
        return circle;
      } catch (error) {
        reject(error);
      }
    });
  };

  createCircleMember = (userId, circleId, role) => {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        const createdMember = await this.prismaService.circleMembers.create({
          data: {
            member: { connect: { id: userId } },
            circle: { connect: { id: circleId } },
            role,
          },
        });

        resolve(createdMember);
      } catch (error) {
        reject(error);
      }
    });
  };

  joinCircle = (circleCode, userId, role) => {
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

        await this.createCircleMember(userId, circle.id, role);

        resolve(circle);
      } catch (error) {
        reject(error);
      }
    });
  };

  getAllCircleMembers = (circleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.getCircleDetails(circleId);

        if (!circle) throw new Error(noCircleError);

        const members: any = await this.prismaService.circleMembers.findMany({
          where: {
            circleId,
          },
        });

        const circleMembers = await Promise.all(
          members.map(async (member) => {
            const user = await this.prismaService.user.findMany({
              where: {
                id: member.userId,
              },
            });
            return user;
          }),
        );

        resolve(circleMembers);
      } catch (error) {
        reject(error);
      }
    });
  };

  getCircleMember = (userId, circleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const circleMember: any =
          await this.prismaService.circleMembers.findFirst({
            where: {
              AND: [{ userId: userId }, { circleId: circleId }],
            },
          });

        console.log(circleMember);

        resolve(circleMember);
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

        if (!circle) throw new Error(noCircleError);

        resolve(circle);
      } catch (error) {
        reject(error);
      }
    });
  };

  addCircleRole = (userId, circleId, role) => {
    return new Promise(async (resolve, reject) => {
      try {
        const member = await this.getCircleMember(userId, circleId);
        console.log(member);
        // if (member) throw new Error(userAlreadyExistsError);

        // const updatedMember = await this.prismaService.circleMembers.update({
        //   where: {
        //     id: member.id,
        //   },
        //   data: {
        //     role,
        //   },
        // });
        // console.log(updatedMember);
        resolve(circleId);
      } catch (error) {
        reject(error);
      }
    });
  };

  // addCircleRole = (userId, circleId, role) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const member = await this.getCircleMember(userId, circleId);

  //       console.log(member);

  //       // const updatedMember = await this.prismaService.circleMembers.update({
  //       //   where: {
  //       //     id: circleId,
  //       //   },
  //       //   data: {
  //       //     role,
  //       //   },
  //       // });
  //       resolve(circleId);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // };

  generateCircleCode = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };
}
