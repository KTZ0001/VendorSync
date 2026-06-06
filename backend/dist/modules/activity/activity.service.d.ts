import { PrismaService } from '../../prisma/prisma.service';
export declare class ActivityService {
    private prisma;
    constructor(prisma: PrismaService);
    log(userId: string, action: string, details: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        details: string;
        userId: string;
    }>;
    getLogs(): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        details: string;
        userId: string;
    }[]>;
}
