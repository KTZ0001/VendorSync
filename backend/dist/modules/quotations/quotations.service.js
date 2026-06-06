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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_service_1 = require("../activity/activity.service");
let QuotationsService = class QuotationsService {
    prisma;
    activity;
    constructor(prisma, activity) {
        this.prisma = prisma;
        this.activity = activity;
    }
    async findAll() {
        return this.prisma.quotation.findMany({
            include: {
                vendor: true,
                rfq: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async compareByRfq(rfqId) {
        const quotes = await this.prisma.quotation.findMany({
            where: { rfqId },
            include: { vendor: true },
        });
        if (quotes.length === 0)
            return [];
        const minPrice = Math.min(...quotes.map(q => q.totalPrice));
        return quotes.map(q => ({
            ...q,
            isLowestPrice: q.totalPrice === minPrice,
        }));
    }
    async selectQuotation(id, userId) {
        const quote = await this.prisma.quotation.findUnique({
            where: { id },
            include: { rfq: true, vendor: true },
        });
        if (!quote)
            throw new Error('Quotation not found');
        await this.prisma.quotation.update({
            where: { id },
            data: { status: 'SELECTED' },
        });
        await this.prisma.quotation.updateMany({
            where: { rfqId: quote.rfqId, NOT: { id } },
            data: { status: 'REJECTED' },
        });
        await this.prisma.rFQ.update({
            where: { id: quote.rfqId },
            data: { status: 'COMPLETED' },
        });
        await this.activity.log(userId, 'QUOTE_SELECTED', `Selected quotation from ${quote.vendor?.name || 'Unknown'} for RFQ ${quote.rfq?.number || 'Unknown'}`);
        return { status: 'success' };
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map