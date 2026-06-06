"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_service_1 = require("../activity/activity.service");
let OrdersService = class OrdersService {
    prisma;
    activity;
    constructor(prisma, activity) {
        this.prisma = prisma;
        this.activity = activity;
    }
    async findAllPOs() {
        return this.prisma.purchaseOrder.findMany({
            include: {
                vendor: true,
                invoices: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPO(quotationId, userId) {
        const quote = await this.prisma.quotation.findUnique({
            where: { id: quotationId },
            include: { vendor: true, rfq: true },
        });
        if (!quote)
            throw new Error('Quotation not found');
        const taxAmount = quote.totalPrice * 0.18;
        const po = await this.prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${Date.now().toString().slice(-6)}`,
                totalAmount: quote.totalPrice + taxAmount,
                taxAmount: taxAmount,
                status: 'ISSUED',
                vendorId: quote.vendorId,
                quotationId: quote.id,
            },
        });
        await this.activity.log(userId, 'PO_CREATED', `Generated Purchase Order ${po.poNumber}`);
        return po;
    }
    async createInvoice(poId, userId) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id: poId },
        });
        if (!po)
            throw new Error('Purchase Order not found');
        const inv = await this.prisma.invoice.create({
            data: {
                invNumber: `INV-${Date.now().toString().slice(-6)}`,
                amount: po.totalAmount,
                status: 'UNPAID',
                poId: poId,
            },
        });
        await this.activity.log(userId, 'INV_CREATED', `Generated Invoice ${inv.invNumber} for PO ${po.poNumber}`);
        return inv;
    }
    async getPO(id) {
        return this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                vendor: true,
                quotation: {
                    include: { rfq: true }
                },
                invoices: true,
            },
        });
    }
    async findAllInvoices() {
        return this.prisma.invoice.findMany({
            include: {
                po: {
                    include: { vendor: true }
                }
            },
            orderBy: { invNumber: 'desc' }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map