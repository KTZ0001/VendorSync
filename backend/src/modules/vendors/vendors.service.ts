import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.vendor.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.vendor.findMany({
      include: {
        _count: {
          select: { quotations: true }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: { quotations: true }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.vendor.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.vendor.delete({
      where: { id },
    });
  }
}
