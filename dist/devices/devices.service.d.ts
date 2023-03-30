import { PrismaService } from 'src/prisma/prisma.service';
export declare class DevicesService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createDevice(deviceDto: any, userId: any): Promise<unknown>;
    getDeviceById(deviceId: string): Promise<unknown>;
    getAllDevices(userId: any): Promise<unknown>;
    deleteDevice(id: any): Promise<unknown>;
}
