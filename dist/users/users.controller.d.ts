import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getAllUsers(): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getUserById(params: any): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updateMobileNumber(userDto: UserDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updateEmail(userDto: UserDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updatePassword(userDto: UpdateUserDto, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    uploadImage(file: any, userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    deleteProfilePicture(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    updateLastSeen(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    getAllActiveUsers(): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
    deleteAccount(userId: string): Promise<{
        success: boolean;
        message: any;
        data: any;
        tokens: any;
        stack: any;
    }>;
}
