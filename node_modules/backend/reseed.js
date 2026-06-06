const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  Building 4-Vendor Full Ecosystem...');

  try {
    // 1. Wipe Everything
    await prisma.invoice.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.quotation.deleteMany();
    await prisma.rFQ.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Role-Based Users
    const admin = await prisma.user.create({
      data: { email: 'admin@vendorbridge.com', password: 'password123', fullName: 'Alex Rivera', role: 'ADMIN' }
    });

    const vendorUsers = [];
    const companies = [
        { name: 'Titan Core Systems', cat: 'Technology', gst: 'GST-TCN-1' },
        { name: 'Acme Robotics Labs', cat: 'Manufacturing', gst: 'GST-ACM-2' },
        { name: 'Global Logics X', cat: 'Logistics', gst: 'GST-GLX-3' },
        { name: 'Matrix Dynamics', cat: 'Hardware', gst: 'GST-MTX-4' }
    ];

    for (const [i, comp] of companies.entries()) {
      // Create Vendor
      const vendor = await prisma.vendor.create({
        data: {
          name: comp.name,
          email: `contact@${comp.name.toLowerCase().replace(/ /g, '')}.com`,
          category: comp.cat,
          gstNumber: comp.gst,
          contactName: `Lead Manager ${i+1}`,
          status: 'ACTIVE'
        }
      });

      // Create RFQ for this vendor
      const rfq = await prisma.rFQ.create({
        data: {
          number: `RFQ-2024-00${i+1}`,
          title: `${comp.cat} Expansion Node`,
          description: `Strategic procurement of infrastructure for ${comp.cat} projects.`,
          deadline: new Date(Date.now() + 86400000 * 30),
          status: 'COMPLETED',
          items: '[]',
          creatorId: admin.id
        }
      });

      // Create Quotation
      const quote = await prisma.quotation.create({
        data: {
          rfqId: rfq.id,
          vendorId: vendor.id,
          unitPrice: 5000 + (i * 1000),
          totalPrice: 45000 + (i * 5000),
          deliveryDays: 10 + i,
          status: 'SELECTED'
        }
      });

      // Create PO
      const po = await prisma.purchaseOrder.create({
        data: {
          poNumber: `PO-${2024}-${100+i}`,
          quotationId: quote.id,
          vendorId: vendor.id,
          totalAmount: quote.totalPrice,
          taxAmount: quote.totalPrice * 0.18,
          status: 'ISSUED'
        }
      });

      // Create Invoice
      await prisma.invoice.create({
        data: {
          invNumber: `INV-${2024}-${500+i}`,
          poId: po.id,
          amount: po.totalAmount + po.taxAmount,
          status: i % 2 === 0 ? 'PAID' : 'UNPAID',
          paidAt: i % 2 === 0 ? new Date() : null
        }
      });
    }

    console.log('✅ 4-VENDOR ECOSYSTEM DEPLOYED. FULL AUDIT TRAILS CREATED.');
  } catch (err) {
    console.error('❌ Ecosystem Build Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
