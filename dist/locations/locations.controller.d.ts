import { LocationDto } from './dto/location.dto';
import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getLocations(circleId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getLocation(circleId: string, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getLocationById(locationId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    createLocation(locationDto: LocationDto, circleId: string, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updateLocation(locationDto: LocationDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
}
