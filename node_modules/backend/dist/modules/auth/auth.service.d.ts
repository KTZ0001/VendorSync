import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        vendorId: string | null;
        createdAt: Date;
    }>;
    login(credentials: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
}
