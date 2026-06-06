import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log('📡 Prisma Connected to Sync Engine');
    
    // AUTO-SEEDER FOR HACKATHON STABILITY
    const vendorCount = await this.vendor.count();
    console.log(`🔍 Current Vendor Count in Database: ${vendorCount}`);
    
    if (vendorCount === 0) {
      console.log('🚀 No vendors found. Initiating Auto-Seed Protocol...');
      await this.seedDemoData();
    }
  }

  private async seedDemoData() {
    try {
        const admin = await this.user.findFirst() || await this.user.create({
            data: { email: 'admin@vendorsync.com', password: 'password123', fullName: 'System Admin', role: 'ADMIN' }
        });

        const companies = [
            { name: 'Titan Core Systems', cat: 'Technology', gst: 'GST-TCN-1' },
            { name: 'Acme Robotics Labs', cat: 'Manufacturing', gst: 'GST-ACM-2' },
            { name: 'Global Logics X', cat: 'Logistics', gst: 'GST-GLX-3' },
            { name: 'Matrix Dynamics', cat: 'Hardware', gst: 'GST-MTX-4' }
        ];

        for (const comp of companies) {
            await this.vendor.create({
                data: {
                    name: comp.name,
                    email: `contact@${comp.name.toLowerCase().replace(/ /g, '')}.com`,
                    category: comp.cat,
                    gstNumber: comp.gst,
                    contactName: 'Executive Node',
                    status: 'ACTIVE'
                }
            });
        }
        console.log('✅ Auto-Seed Successful. 4 Partners Manifested.');
    } catch (e) {
        console.error('❌ Auto-Seed Failed:', e);
    }
  }
}
