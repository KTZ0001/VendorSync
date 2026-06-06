const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Needed to hash the password
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Data Seed with Hashed Passwords...');

  // 1. Hash the password for the login to work
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create/Update a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'admin@vendorsync.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@vendorsync.com',
      password: hashedPassword,
      fullName: 'System Admin',
      role: 'ADMIN'
    }
  });

  // 3. Create Vendors
  const v1 = await prisma.vendor.upsert({
    where: { gstNumber: 'GST-TECH-001' },
    update: {},
    create: {
      name: 'Titan Technologies',
      category: 'Electronics',
      gstNumber: 'GST-TECH-001',
      contactName: 'Alice Johnson',
      email: 'alice@titan.com',
      status: 'ACTIVE'
    }
  });

  const v2 = await prisma.vendor.upsert({
    where: { gstNumber: 'GST-SOFT-002' },
    update: {},
    create: {
      name: 'CloudScale Software',
      category: 'IT Services',
      gstNumber: 'GST-SOFT-002',
      contactName: 'Bob Smith',
      email: 'bob@cloudscale.io',
      status: 'ACTIVE'
    }
  });

  const v3 = await prisma.vendor.upsert({
    where: { gstNumber: 'GST-OFFI-003' },
    update: {},
    create: {
      name: 'Office Depot Pro',
      category: 'Furniture',
      gstNumber: 'GST-OFFI-003',
      contactName: 'Charlie Brown',
      email: 'charlie@officedepot.pro',
      status: 'ACTIVE'
    }
  });

  const v4 = await prisma.vendor.upsert({
    where: { gstNumber: 'GST-LOGI-004' },
    update: {},
    create: {
      name: 'Rapid Logistics',
      category: 'Logistics',
      gstNumber: 'GST-LOGI-004',
      contactName: 'Diana Prince',
      email: 'diana@rapidlog.co',
      status: 'ACTIVE'
    }
  });

  // 4. Create an RFQ
  const rfq = await prisma.rFQ.upsert({
    where: { number: 'RFQ-001' },
    update: {},
    create: {
      number: 'RFQ-001',
      title: 'Global Office Laptop Upgrade',
      description: 'Procuring 50 high-end business laptops for the 2026 dev team.',
      deadline: new Date('2026-12-31'),
      status: 'PUBLISHED',
      items: JSON.stringify([{ item: 'MacBook Pro M3', qty: 50 }]),
      creatorId: demoUser.id
    }
  });

  // 5. Create Quotations for Comparison demo
  const q1 = await prisma.quotation.upsert({
    where: { id: 'quote-1-demo' }, // Stability for upsert
    update: {},
    create: {
      id: 'quote-1-demo',
      rfqId: rfq.id,
      vendorId: v1.id,
      unitPrice: 2000,
      totalPrice: 100000,
      deliveryDays: 14,
      notes: 'Includes 3-year warranty.',
      status: 'SUBMITTED'
    }
  });

  const q2 = await prisma.quotation.upsert({
    where: { id: 'quote-2-demo' },
    update: {},
    create: {
      id: 'quote-2-demo',
      rfqId: rfq.id,
      vendorId: v2.id,
      unitPrice: 1850,
      totalPrice: 92500,
      deliveryDays: 21,
      notes: 'Bulk discount applied - Special Hackathon Offer.',
      status: 'SUBMITTED'
    }
  });

  console.log('✅ Seed Finished successfully!');
  console.log('👉 Login Email: admin@vendorsync.com');
  console.log('👉 Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
