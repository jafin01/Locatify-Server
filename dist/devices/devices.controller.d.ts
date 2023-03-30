import { DevicesService } from './devices.service';
import { DevicesDto } from './dto/devices.dto';
export declare class DevicesController {
    private deviceServices;
    constructor(deviceServices: DevicesService);
    createDevice(deviceDto: DevicesDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getDeviceById(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getAllDevices(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    deleteDevice(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
}
