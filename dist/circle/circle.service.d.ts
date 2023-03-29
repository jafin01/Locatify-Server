import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CircleService {
    private prismaService;
    constructor(prismaService: PrismaService);
    id: number;
    name: string;
    circleMembers: User[];
    createCircle: (circleDto: any, userId: any) => Promise<unknown>;
    createCircleMember: (userId: any, circleId: any, role: any) => Promise<unknown>;
    joinCircle: (circleCode: any, userId: any, role: any) => Promise<unknown>;
    getCircleDetailsByCode: (circleCode: any) => Promise<unknown>;
    getAllCircleMembers: (circleId: any) => Promise<unknown>;
    getCircleMember: (userId: any, circleId: any) => Promise<unknown>;
    deleteCircleMember: (circleId: any, userId: any) => Promise<unknown>;
    getCircleDetails: (circleId: string) => Promise<unknown>;
    updateCircleRole: (userId: any, circleId: any, role: any) => Promise<unknown>;
    getAllCircles: (userId: any) => Promise<unknown>;
    generateCircleCode: (length: any) => string;
}
