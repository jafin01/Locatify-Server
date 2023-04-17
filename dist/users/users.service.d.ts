import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
export declare class UsersService {
    private authService;
    private prismaService;
    constructor(authService: AuthService, prismaService: PrismaService);
    getAllUsers(): Promise<unknown>;
    getUserByEmail(email: string): Promise<unknown>;
    getUserById(userId: string): Promise<unknown>;
    updateMobileNumber(userId: string, userDto: UserDto): Promise<unknown>;
    updateEmail(userId: string, userDto: UserDto): Promise<unknown>;
    updatePassword(userId: string, userDto: UpdateUserDto): Promise<unknown>;
    uploadProfilePicture(userId: string, file: any): Promise<unknown>;
    deleteProfilePicture(userId: string): Promise<unknown>;
    updateUser(userId: string, imageUrl: string): Promise<unknown>;
    getAllActiveUsers(): Promise<unknown>;
    countActiveUsers(): Promise<unknown>;
    updateLastSeen(userId: string): Promise<unknown>;
    updateActiveStatus(): Promise<void>;
    getActiveStatus(userId: string): Promise<unknown>;
    deleteUserAccount(userId: string): Promise<unknown>;
}
