import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private activity: ActivityService
  ) {}

  async findAllPOs() {
    return this.prisma.purchaseOrder.findMany({
      include: {
        vendor: true,
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPO(quotationId: string, userId: string) {
    const quote = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { vendor: true, rfq: true },
    });

    if (!quote) throw new Error('Quotation not found');

    const taxAmount = quote.totalPrice * 0.18; // 18% GST

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

  async createInvoice(poId: string, userId: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: poId },
    });

    if (!po) throw new Error('Purchase Order not found');

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

  async getPO(id: string) {
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
}
