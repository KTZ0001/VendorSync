import { Injectable, Global } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string, action: string, details: string) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  }

  async getLogs() {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
