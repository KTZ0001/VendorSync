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
exports.RfqsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_service_1 = require("../activity/activity.service");
let RfqsService = class RfqsService {
    prisma;
    activity;
    constructor(prisma, activity) {
        this.prisma = prisma;
        this.activity = activity;
    }
    async create(data, userId) {
        const timestamp = Date.now().toString().slice(-4);
        const rfqNumber = `RFQ-${new Date().getFullYear()}-${timestamp}`;
        const items = typeof data.items === 'object' ? JSON.stringify(data.items) : (data.items || '[]');
        const rfq = await this.prisma.rFQ.create({
            data: {
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                items,
                number: rfqNumber,
                creatorId: userId,
            },
        });
        await this.activity.log(userId, 'RFQ_CREATED', `Created RFQ ${rfqNumber}`);
        return rfq;
    }
    async findAll() {
        const rfqs = await this.prisma.rFQ.findMany({
            include: {
                creator: { select: { fullName: true } },
                _count: { select: { quotations: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return rfqs.map(rfq => ({
            ...rfq,
            items: rfq.items ? JSON.parse(rfq.items) : []
        }));
    }
    async findOne(id) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id },
            include: {
                creator: { select: { fullName: true } },
                quotations: {
                    include: { vendor: { select: { name: true, category: true } } }
                }
            }
        });
        if (!rfq)
            throw new common_1.NotFoundException('RFQ not found');
        return {
            ...rfq,
            items: rfq.items ? JSON.parse(rfq.items) : []
        };
    }
    async updateStatus(id, status) {
        return this.prisma.rFQ.update({
            where: { id },
            data: { status },
        });
    }
};
exports.RfqsService = RfqsService;
exports.RfqsService = RfqsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], RfqsService);
//# sourceMappingURL=rfqs.service.js.map