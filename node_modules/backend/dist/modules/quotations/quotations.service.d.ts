import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
export declare class QuotationsService {
    private prisma;
    private activity;
    constructor(prisma: PrismaService, activity: ActivityService);
    findAll(): Promise<({
        vendor: {
            id: string;
            email: string;
            name: string;
            category: string;
            gstNumber: string;
            status: string;
            contactName: string;
        };
        rfq: {
            number: string;
            id: string;
            createdAt: Date;
            status: string;
            description: string;
            title: string;
            deadline: Date;
            items: string;
            creatorId: string;
        };
    } & {
        id: string;
        vendorId: string;
        createdAt: Date;
        status: string;
        rfqId: string;
        unitPrice: number;
        totalPrice: number;
        deliveryDays: number;
        notes: string | null;
    })[]>;
    compareByRfq(rfqId: string): Promise<{
        isLowestPrice: boolean;
        vendor: {
            id: string;
            email: string;
            name: string;
            category: string;
            gstNumber: string;
            status: string;
            contactName: string;
        };
        id: string;
        vendorId: string;
        createdAt: Date;
        status: string;
        rfqId: string;
        unitPrice: number;
        totalPrice: number;
        deliveryDays: number;
        notes: string | null;
    }[]>;
    selectQuotation(id: string, userId: string): Promise<{
        status: string;
    }>;
}
