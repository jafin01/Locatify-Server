import { CircleService } from './circle.service';
import { CircleDto } from './dto/circle.dto';
import { CircleCodeDto } from './dto/circleCode.dto';
import { CircleMembersDto } from './dto/circleMembers.dto';
export declare class CircleController {
    private circleService;
    constructor(circleService: CircleService);
    createCircle(circleDto: CircleDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    joinCircle(circleCodeDto: CircleCodeDto, circleMembersDto: CircleMembersDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    addCircleMember(params: any, circleMembersDto: CircleMembersDto): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getAllCircleMembers(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    deleteCircleMember(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getCircleData(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getCircleDataByCode(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updateCircleRole(circleMembersDto: CircleMembersDto, params: any, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getAllCircles(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
}
