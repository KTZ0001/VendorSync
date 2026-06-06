import { RfqsService } from './rfqs.service';
export declare class RfqsController {
    private readonly rfqsService;
    constructor(rfqsService: RfqsService);
    create(body: any, req: any): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
        items: string;
        creatorId: string;
    }>;
    findAll(): Promise<{
        items: any;
        _count: {
            quotations: number;
        };
        creator: {
            fullName: string;
        };
        number: string;
        id: string;
        createdAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
        creatorId: string;
    }[]>;
    findOne(id: string): Promise<{
        items: any;
        quotations: ({
            vendor: {
                name: string;
                category: string;
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
        })[];
        creator: {
            fullName: string;
        };
        number: string;
        id: string;
        createdAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
        creatorId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
        items: string;
        creatorId: string;
    }>;
}
