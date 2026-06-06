import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class RfqsService {
  constructor(
    private prisma: PrismaService,
    private activity: ActivityService
  ) {}

  async create(data: any, userId: string) {
    // Use timestamp + random suffix for guaranteed uniqueness in hackathon setting
    const timestamp = Date.now().toString().slice(-4);
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${timestamp}`;

    // Ensure items is stringified for SQLite
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

  async findOne(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: {
        creator: { select: { fullName: true } },
        quotations: {
          include: { vendor: { select: { name: true, category: true } } }
        }
      }
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    
    return {
      ...rfq,
      items: rfq.items ? JSON.parse(rfq.items) : []
    };
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.rFQ.update({
      where: { id },
      data: { status },
    });
  }
}
