import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: any): Promise<{
        id: string;
        email: string;
        name: string;
        category: string;
        gstNumber: string;
        status: string;
        contactName: string;
    }>;
    findAll(): Promise<({
        _count: {
            quotations: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        category: string;
        gstNumber: string;
        status: string;
        contactName: string;
    })[]>;
    findOne(id: string): Promise<({
        quotations: {
            id: string;
            vendorId: string;
            createdAt: Date;
            status: string;
            rfqId: string;
            unitPrice: number;
            totalPrice: number;
            deliveryDays: number;
            notes: string | null;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        category: string;
        gstNumber: string;
        status: string;
        contactName: string;
    }) | null>;
    update(id: string, updateVendorDto: any): Promise<{
        id: string;
        email: string;
        name: string;
        category: string;
        gstNumber: string;
        status: string;
        contactName: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        category: string;
        gstNumber: string;
        status: string;
        contactName: string;
    }>;
}
