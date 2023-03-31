import { PrismaService } from 'src/prisma/prisma.service';
export declare class LocationsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getLocations(circleId: string): Promise<unknown>;
    getLocationByUser(userId: string, circleId: string): Promise<unknown>;
    getLocationById(locationId: string): Promise<unknown>;
    createLocation(locationDto: any, userId: string, circleId: string): Promise<unknown>;
    updateLocation(locationDto: any, circleId: string, userId: string): Promise<unknown>;
}
