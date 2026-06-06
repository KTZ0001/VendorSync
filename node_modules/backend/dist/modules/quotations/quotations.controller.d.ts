import { QuotationsService } from './quotations.service';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
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
    compare(rfqId: string): Promise<{
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
    select(id: string, req: any): Promise<{
        status: string;
    }>;
}
