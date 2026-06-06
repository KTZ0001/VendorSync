import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class QuotationsService {
  constructor(
    private prisma: PrismaService,
    private activity: ActivityService
  ) {}

  async findAll() {
    return this.prisma.quotation.findMany({
      include: {
        vendor: true,
        rfq: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async compareByRfq(rfqId: string) {
    const quotes = await this.prisma.quotation.findMany({
      where: { rfqId },
      include: { vendor: true },
    });

    if (quotes.length === 0) return [];

    const minPrice = Math.min(...quotes.map(q => q.totalPrice));

    return quotes.map(q => ({
      ...q,
      isLowestPrice: q.totalPrice === minPrice,
    }));
  }

  async selectQuotation(id: string, userId: string) {
    const quote = await this.prisma.quotation.findUnique({
      where: { id },
      include: { rfq: true, vendor: true },
    });

    if (!quote) throw new Error('Quotation not found');

    // 1. Update this quote as selected
    await this.prisma.quotation.update({
      where: { id },
      data: { status: 'SELECTED' },
    });

    // 2. Reject others
    await this.prisma.quotation.updateMany({
      where: { rfqId: quote.rfqId, NOT: { id } },
      data: { status: 'REJECTED' },
    });

    // 3. Mark RFQ as completed
    await this.prisma.rFQ.update({
      where: { id: quote.rfqId },
      data: { status: 'COMPLETED' },
    });

    await this.activity.log(userId, 'QUOTE_SELECTED', `Selected quotation from ${quote.vendor?.name || 'Unknown'} for RFQ ${quote.rfq?.number || 'Unknown'}`);

    return { status: 'success' };
  }
}
