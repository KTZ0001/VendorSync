"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        console.log('📡 Prisma Connected to Sync Engine');
        const vendorCount = await this.vendor.count();
        console.log(`🔍 Current Vendor Count in Database: ${vendorCount}`);
        if (vendorCount === 0) {
            console.log('🚀 No vendors found. Initiating Auto-Seed Protocol...');
            await this.seedDemoData();
        }
    }
    async seedDemoData() {
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
        }
        catch (e) {
            console.error('❌ Auto-Seed Failed:', e);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map