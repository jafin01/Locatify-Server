import { Injectable } from '@nestjs/common';
import { characters } from 'src/constants/circleConstants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CircleService {
  constructor(private prismaService: PrismaService) {}
  createCircle = async (circleDto, userId) => {
    const { title, description } = circleDto;

    const circleCode = this.generateCircleCode(6);

    return new Promise(async (resolve, reject) => {
      try {
        const circle = await this.prismaService.circle.create({
          data: {
            title,
            circleCode,
            description,
            user: { connect: { id: userId } },
          },
        });

        await this.prismaService.circleMembers.create({
          data: {
            users: { connect: { id: userId } },
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

  generateCircleCode = (length) => {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };
}
