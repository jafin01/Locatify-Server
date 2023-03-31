import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
export declare class UsersService {
    private prismaService;
    private authService;
    constructor(prismaService: PrismaService, authService: AuthService);
    getAllUsers(): Promise<unknown>;
    getUserById(userId: string): Promise<unknown>;
    getAllActiveUsers(): Promise<unknown>;
    updateMobileNumber(userId: string, userDto: UserDto): Promise<unknown>;
    updateEmail(userId: string, userDto: UserDto): Promise<unknown>;
    countActiveUsers(): Promise<unknown>;
    updatePassword(userId: string, userDto: UpdateUserDto): Promise<unknown>;
    updateLastSeen(userId: string): Promise<unknown>;
}
