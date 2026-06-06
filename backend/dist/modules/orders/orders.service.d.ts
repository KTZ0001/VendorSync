import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
export declare class OrdersService {
    private prisma;
    private activity;
    constructor(prisma: PrismaService, activity: ActivityService);
    findAllPOs(): Promise<({
        vendor: {
            id: string;
            email: string;
            name: string;
            category: string;
            gstNumber: string;
            status: string;
            contactName: string;
        };
        invoices: {
            id: string;
            status: string;
            invNumber: string;
            amount: number;
            paidAt: Date | null;
            poId: string;
        }[];
    } & {
        id: string;
        vendorId: string;
        createdAt: Date;
        status: string;
        poNumber: string;
        quotationId: string;
        totalAmount: number;
        taxAmount: number;
    })[]>;
    createPO(quotationId: string, userId: string): Promise<{
        id: string;
        vendorId: string;
        createdAt: Date;
        status: string;
        poNumber: string;
        quotationId: string;
        totalAmount: number;
        taxAmount: number;
    }>;
    createInvoice(poId: string, userId: string): Promise<{
        id: string;
        status: string;
        invNumber: string;
        amount: number;
        paidAt: Date | null;
        poId: string;
    }>;
    getPO(id: string): Promise<({
        vendor: {
            id: string;
            email: string;
            name: string;
            category: string;
            gstNumber: string;
            status: string;
            contactName: string;
        };
        quotation: {
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
        };
        invoices: {
            id: string;
            status: string;
            invNumber: string;
            amount: number;
            paidAt: Date | null;
            poId: string;
        }[];
    } & {
        id: string;
        vendorId: string;
        createdAt: Date;
        status: string;
        poNumber: string;
        quotationId: string;
        totalAmount: number;
        taxAmount: number;
    }) | null>;
    findAllInvoices(): Promise<({
        po: {
            vendor: {
                id: string;
                email: string;
                name: string;
                category: string;
                gstNumber: string;
                status: string;
                contactName: string;
            };
        } & {
            id: string;
            vendorId: string;
            createdAt: Date;
            status: string;
            poNumber: string;
            quotationId: string;
            totalAmount: number;
            taxAmount: number;
        };
    } & {
        id: string;
        status: string;
        invNumber: string;
        amount: number;
        paidAt: Date | null;
        poId: string;
    })[]>;
}
