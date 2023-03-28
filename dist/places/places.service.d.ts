import { CircleService } from 'src/circle/circle.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class PlacesService {
    private prismaService;
    private circleServices;
    constructor(prismaService: PrismaService, circleServices: CircleService);
    createPlace: (placesDto: any, circleId: any, userId: any) => Promise<unknown>;
    getPlaceById: (placeId: any) => Promise<unknown>;
    getPlacesInCircle: (circleId: string) => Promise<unknown>;
    deletePlace: (circleId: string, id: string) => Promise<unknown>;
    updatePlace: (placeDto: any, circleId: string, placeId: string, userId: string) => Promise<unknown>;
}
