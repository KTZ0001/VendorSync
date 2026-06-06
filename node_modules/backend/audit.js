const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 SYSTEM AUDIT INITIATED...');
  const vc = await prisma.vendor.count();
  const rc = await prisma.rFQ.count();
  const qc = await prisma.quotation.count();
  const ic = await prisma.invoice.count();
  
  console.log('--- DATA STATUS ---');
  console.log(`🏢 Vendors Detected: ${vc}`);
  console.log(`📄 RFQs Detected: ${rc}`);
  console.log(`💰 Quotes Detected: ${qc}`);
  console.log(`🧾 Invoices Detected: ${ic}`);
  
  if (vc > 0) {
    const list = await prisma.vendor.findMany({ select: { name: true } });
    console.log('Names:', list.map(v => v.name).join(', '));
  }
}
main();
