import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

import {
  AuditAction,
  CustomerType,
  DifficultyLevel,
  ExpenseCategory,
  InvoiceStatus,
  ItemType,
  JobStatus,
  PaymentMethod,
  PriceType,
  Priority,
  PrismaClient,
  ReferenceSourceType,
  SaleStatus,
  UserRole,
  VerificationStatus,
} from '../src/generated/prisma/client';

const BCRYPT_ROUNDS = 10;
const SEED_DIR = path.join(process.cwd(), 'prisma', 'seed');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Row = Record<string, string>;

function readCsv(name: string): Row[] {
  const content = fs.readFileSync(path.join(SEED_DIR, `${name}.csv`), 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true, trim: true }) as Row[];
}

const str = (v: string | undefined, def = ''): string => v?.trim() ?? def;
const num = (v: string | undefined, def = 0): number => {
  const n = parseFloat(v ?? '');
  return isNaN(n) ? def : n;
};
const bool = (v: string | undefined, def = true): boolean => {
  const s = v?.trim().toLowerCase();
  if (s === 'false') return false;
  if (s === 'true') return true;
  return def;
};
const dt = (v: string | undefined): Date | undefined => {
  if (!v?.trim()) return undefined;
  const d = new Date(v.trim());
  return isNaN(d.getTime()) ? undefined : d;
};

async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Users
  console.log('Seeding users...');
  const userMap: Record<string, string> = {};
  for (const row of readCsv('users')) {
    const hashed = await bcrypt.hash(row.password, BCRYPT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: row.email },
      update: { name: str(row.name), role: row.role as UserRole, isActive: bool(row.isActive) },
      create: {
        email: row.email,
        password: hashed,
        name: str(row.name),
        role: row.role as UserRole,
        isActive: bool(row.isActive),
      },
    });
    userMap[row.email] = user.id;
    console.log(`  user: ${row.email} [${row.role}]`);
  }

  // 2. Customers
  console.log('\nSeeding customers...');
  const customerMap: Record<string, string> = {};
  for (const row of readCsv('customers')) {
    const customer = await prisma.customer.upsert({
      where: { code: row.code },
      update: {
        name: str(row.name),
        phone: str(row.phone),
        email: str(row.email) || null,
        address: str(row.address) || null,
        customerType: row.customerType as CustomerType,
        notes: str(row.notes) || null,
        isActive: bool(row.isActive),
      },
      create: {
        code: row.code,
        name: str(row.name),
        phone: str(row.phone),
        email: str(row.email) || null,
        address: str(row.address) || null,
        customerType: row.customerType as CustomerType,
        notes: str(row.notes) || null,
        isActive: bool(row.isActive),
      },
    });
    customerMap[row.code] = customer.id;
    console.log(`  customer: ${row.code} – ${row.name}`);
  }

  // 3. Services
  console.log('\nSeeding services...');
  const serviceMap: Record<string, string> = {};
  for (const row of readCsv('services')) {
    const service = await prisma.service.upsert({
      where: { code: row.code },
      update: {
        nameEn: str(row.nameEn),
        nameKh: str(row.nameKh) || null,
        category: str(row.category) || null,
        relatedComponent: str(row.relatedComponent) || null,
        defaultPrice: str(row.defaultPrice) ? num(row.defaultPrice) : null,
        priceType: row.priceType as PriceType,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
      create: {
        code: row.code,
        nameEn: str(row.nameEn),
        nameKh: str(row.nameKh) || null,
        category: str(row.category) || null,
        relatedComponent: str(row.relatedComponent) || null,
        defaultPrice: str(row.defaultPrice) ? num(row.defaultPrice) : null,
        priceType: row.priceType as PriceType,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
    });
    serviceMap[row.code] = service.id;
    console.log(`  service: ${row.code} – ${row.nameEn}`);
  }

  // 4. Price Catalog
  console.log('\nSeeding price catalogs...');
  const priceCatalogMap: Record<string, string> = {};
  for (const row of readCsv('price-catalog')) {
    const serviceId = serviceMap[row.serviceCode];
    if (!serviceId) {
      console.warn(`  skip catalog: no service ${row.serviceCode}`);
      continue;
    }
    const existing = await prisma.priceCatalog.findFirst({
      where: { serviceId, label: row.label },
    });
    const data = {
      serviceId,
      label: str(row.label),
      sizeFrom: str(row.sizeFrom) ? num(row.sizeFrom) : null,
      sizeTo: str(row.sizeTo) ? num(row.sizeTo) : null,
      unit: str(row.unit) || null,
      difficultyLevel: row.difficultyLevel as DifficultyLevel,
      customerType: str(row.customerType) ? (row.customerType as CustomerType) : null,
      unitPrice: num(row.unitPrice),
      currency: str(row.currency, 'USD'),
      notes: str(row.notes) || null,
      isActive: bool(row.isActive),
    };
    const catalog = existing
      ? await prisma.priceCatalog.update({ where: { id: existing.id }, data })
      : await prisma.priceCatalog.create({ data });
    priceCatalogMap[`${row.serviceCode}|${row.label}`] = catalog.id;
    console.log(`  catalog: [${row.serviceCode}] ${row.label} = $${row.unitPrice}`);
  }

  // 5. Machine Models
  console.log('\nSeeding machine models...');
  const machineModelMap: Record<string, string> = {};
  for (const row of readCsv('machine-models')) {
    const machineModel = await prisma.machineModel.upsert({
      where: { brand_model: { brand: str(row.brand), model: str(row.model) } },
      update: {
        category: str(row.category) || null,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
      create: {
        brand: str(row.brand),
        model: str(row.model),
        category: str(row.category) || null,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
    });
    machineModelMap[`${row.brand}|${row.model}`] = machineModel.id;
    console.log(`  machineModel: ${row.brand} ${row.model}`);
  }

  // 6. Reference Book
  console.log('\nSeeding reference books...');
  const referenceBookMap: Record<string, string> = {};
  for (const row of readCsv('reference-book')) {
    const partCode = str(row.partCode) || null;
    if (!partCode) continue;
    const machineModelId =
      str(row.machineModelBrand) && str(row.machineModelModel)
        ? (machineModelMap[`${row.machineModelBrand}|${row.machineModelModel}`] ?? null)
        : null;
    const existing = await prisma.referenceBook.findFirst({ where: { partCode } });
    const data = {
      machineModelId,
      componentType: str(row.componentType) || null,
      partName: str(row.partName),
      partCode,
      standardSize: str(row.standardSize) ? num(row.standardSize) : null,
      wearLimit: str(row.wearLimit) ? num(row.wearLimit) : null,
      serviceLimit: str(row.serviceLimit) ? num(row.serviceLimit) : null,
      unit: str(row.unit, 'mm'),
      sourceType: row.sourceType as ReferenceSourceType,
      verificationStatus: row.verificationStatus as VerificationStatus,
      notes: str(row.notes) || null,
      isActive: bool(row.isActive),
    };
    const ref = existing
      ? await prisma.referenceBook.update({ where: { id: existing.id }, data })
      : await prisma.referenceBook.create({ data });
    referenceBookMap[partCode] = ref.id;
    console.log(`  referenceBook: ${partCode} – ${row.partName}`);
  }

  // 7. Products
  console.log('\nSeeding products...');
  const productMap: Record<string, string> = {};
  for (const row of readCsv('products')) {
    const linkedReferenceBookId = str(row.linkedReferenceBookPartCode)
      ? (referenceBookMap[row.linkedReferenceBookPartCode] ?? null)
      : null;
    const product = await prisma.product.upsert({
      where: { code: row.code },
      update: {
        name: str(row.name),
        brand: str(row.brand) || null,
        componentPartType: str(row.componentPartType) || null,
        size: str(row.size) || null,
        supplier: str(row.supplier) || null,
        description: str(row.description) || null,
        category: str(row.category) || null,
        unit: str(row.unit, 'piece'),
        costPrice: num(row.costPrice),
        sellingPrice: num(row.sellingPrice),
        stockQuantity: Math.round(num(row.stockQuantity)),
        reorderLevel: Math.round(num(row.reorderLevel)),
        linkedReferenceBookId,
        isActive: bool(row.isActive),
      },
      create: {
        code: row.code,
        name: str(row.name),
        brand: str(row.brand) || null,
        componentPartType: str(row.componentPartType) || null,
        size: str(row.size) || null,
        supplier: str(row.supplier) || null,
        description: str(row.description) || null,
        category: str(row.category) || null,
        unit: str(row.unit, 'piece'),
        costPrice: num(row.costPrice),
        sellingPrice: num(row.sellingPrice),
        stockQuantity: Math.round(num(row.stockQuantity)),
        reorderLevel: Math.round(num(row.reorderLevel)),
        linkedReferenceBookId,
        isActive: bool(row.isActive),
      },
    });
    productMap[row.code] = product.id;
    console.log(`  product: ${row.code} – ${row.name}`);
  }

  // 8. Service Jobs
  console.log('\nSeeding service jobs...');
  const serviceJobMap: Record<string, string> = {};
  for (const row of readCsv('service-jobs')) {
    const customerId = customerMap[row.customerCode];
    if (!customerId) { console.warn(`  skip job: no customer ${row.customerCode}`); continue; }
    const createdById = userMap[row.createdByEmail];
    if (!createdById) { console.warn(`  skip job: no user ${row.createdByEmail}`); continue; }
    const machineModelId =
      str(row.machineModelBrand) && str(row.machineModelModel)
        ? (machineModelMap[`${row.machineModelBrand}|${row.machineModelModel}`] ?? null)
        : null;
    const assignedToId = str(row.assignedToEmail)
      ? (userMap[row.assignedToEmail] ?? null)
      : null;
    const job = await prisma.serviceJob.upsert({
      where: { jobCode: row.jobCode },
      update: {
        machineModelId,
        partDescription: str(row.partDescription),
        status: row.status as JobStatus,
        priority: row.priority as Priority,
        estimatedCompletionDate: dt(row.estimatedCompletionDate) ?? null,
        notes: str(row.notes) || null,
        technicianNotes: str(row.technicianNotes) || null,
        assignedToId,
      },
      create: {
        jobCode: row.jobCode,
        customerId,
        machineModelId,
        partDescription: str(row.partDescription),
        status: row.status as JobStatus,
        priority: row.priority as Priority,
        estimatedCompletionDate: dt(row.estimatedCompletionDate) ?? null,
        notes: str(row.notes) || null,
        technicianNotes: str(row.technicianNotes) || null,
        createdById,
        assignedToId,
      },
    });
    serviceJobMap[row.jobCode] = job.id;
    console.log(`  serviceJob: ${row.jobCode} [${row.status}]`);
  }

  // 9. Service Job Items (delete + recreate per job)
  console.log('\nSeeding service job items...');
  const jobItemsByJob: Record<string, Row[]> = {};
  for (const row of readCsv('service-job-items')) {
    (jobItemsByJob[row.jobCode] ??= []).push(row);
  }
  for (const [jobCode, items] of Object.entries(jobItemsByJob)) {
    const serviceJobId = serviceJobMap[jobCode];
    if (!serviceJobId) { console.warn(`  skip items: no job ${jobCode}`); continue; }
    await prisma.serviceJobItem.deleteMany({ where: { serviceJobId } });
    for (const item of items) {
      const serviceId = str(item.serviceCode) ? (serviceMap[item.serviceCode] ?? null) : null;
      const priceCatalogId =
        str(item.priceCatalogLabel) && str(item.serviceCode)
          ? (priceCatalogMap[`${item.serviceCode}|${item.priceCatalogLabel}`] ?? null)
          : null;
      const productId = str(item.productCode) ? (productMap[item.productCode] ?? null) : null;
      const qty = num(item.quantity, 1);
      const price = num(item.unitPrice);
      await prisma.serviceJobItem.create({
        data: {
          serviceJobId,
          type: item.type as ItemType,
          serviceId,
          priceCatalogId,
          productId,
          description: str(item.description),
          quantity: qty,
          unitPrice: price,
          totalPrice: qty * price,
          measurement: str(item.measurement) || null,
          notes: str(item.notes) || null,
        },
      });
    }
    console.log(`  serviceJobItems: ${jobCode} (${items.length} items)`);
  }

  // 10. Sales
  console.log('\nSeeding sales...');
  const saleMap: Record<string, string> = {};
  for (const row of readCsv('sales')) {
    const customerId = str(row.customerCode) ? (customerMap[row.customerCode] ?? null) : null;
    const createdById = userMap[row.createdByEmail];
    if (!createdById) { console.warn(`  skip sale: no user ${row.createdByEmail}`); continue; }
    const sale = await prisma.sale.upsert({
      where: { saleNumber: row.saleNumber },
      update: {
        customerId,
        status: row.status as SaleStatus,
        subtotal: num(row.subtotal),
        discountAmount: num(row.discountAmount),
        totalAmount: num(row.totalAmount),
        notes: str(row.notes) || null,
        soldAt: dt(row.soldAt) ?? new Date(),
      },
      create: {
        saleNumber: row.saleNumber,
        customerId,
        status: row.status as SaleStatus,
        subtotal: num(row.subtotal),
        discountAmount: num(row.discountAmount),
        totalAmount: num(row.totalAmount),
        notes: str(row.notes) || null,
        soldAt: dt(row.soldAt) ?? new Date(),
        createdById,
      },
    });
    saleMap[row.saleNumber] = sale.id;
    console.log(`  sale: ${row.saleNumber} [${row.status}] $${row.totalAmount}`);
  }

  // 11. Sale Items (delete + recreate per sale)
  console.log('\nSeeding sale items...');
  const saleItemsBySale: Record<string, Row[]> = {};
  for (const row of readCsv('sale-items')) {
    (saleItemsBySale[row.saleNumber] ??= []).push(row);
  }
  for (const [saleNumber, items] of Object.entries(saleItemsBySale)) {
    const saleId = saleMap[saleNumber];
    if (!saleId) { console.warn(`  skip saleItems: no sale ${saleNumber}`); continue; }
    await prisma.saleItem.deleteMany({ where: { saleId } });
    for (const item of items) {
      const productId = productMap[item.productCode];
      if (!productId) { console.warn(`  skip saleItem: no product ${item.productCode}`); continue; }
      await prisma.saleItem.create({
        data: {
          saleId,
          productId,
          description: str(item.description) || null,
          quantity: num(item.quantity, 1),
          unitPrice: num(item.unitPrice),
          discountAmount: num(item.discountAmount),
          totalPrice: num(item.totalPrice),
        },
      });
    }
    console.log(`  saleItems: ${saleNumber} (${items.length} items)`);
  }

  // 12. Invoices
  console.log('\nSeeding invoices...');
  const invoiceMap: Record<string, string> = {};
  for (const row of readCsv('invoices')) {
    const customerId = customerMap[row.customerCode];
    if (!customerId) { console.warn(`  skip invoice: no customer ${row.customerCode}`); continue; }
    const createdById = userMap[row.createdByEmail];
    if (!createdById) { console.warn(`  skip invoice: no user ${row.createdByEmail}`); continue; }
    const serviceJobId = str(row.serviceJobCode) ? (serviceJobMap[row.serviceJobCode] ?? null) : null;
    const saleId = str(row.saleNumber) ? (saleMap[row.saleNumber] ?? null) : null;
    const invoice = await prisma.invoice.upsert({
      where: { invoiceNumber: row.invoiceNumber },
      update: {
        status: row.status as InvoiceStatus,
        subtotal: num(row.subtotal),
        discountAmount: num(row.discountAmount),
        taxAmount: num(row.taxAmount),
        totalAmount: num(row.totalAmount),
        paidAmount: num(row.paidAmount),
        dueAmount: num(row.dueAmount),
        notes: str(row.notes) || null,
        issuedAt: dt(row.issuedAt) ?? new Date(),
        dueDate: dt(row.dueDate) ?? null,
      },
      create: {
        invoiceNumber: row.invoiceNumber,
        customerId,
        serviceJobId,
        saleId,
        status: row.status as InvoiceStatus,
        subtotal: num(row.subtotal),
        discountAmount: num(row.discountAmount),
        taxAmount: num(row.taxAmount),
        totalAmount: num(row.totalAmount),
        paidAmount: num(row.paidAmount),
        dueAmount: num(row.dueAmount),
        notes: str(row.notes) || null,
        issuedAt: dt(row.issuedAt) ?? new Date(),
        dueDate: dt(row.dueDate) ?? null,
        createdById,
      },
    });
    invoiceMap[row.invoiceNumber] = invoice.id;
    console.log(`  invoice: ${row.invoiceNumber} [${row.status}] $${row.totalAmount}`);
  }

  // 13. Invoice Items (delete + recreate per invoice)
  console.log('\nSeeding invoice items...');
  const invoiceItemsByInvoice: Record<string, Row[]> = {};
  for (const row of readCsv('invoice-items')) {
    (invoiceItemsByInvoice[row.invoiceNumber] ??= []).push(row);
  }
  for (const [invoiceNumber, items] of Object.entries(invoiceItemsByInvoice)) {
    const invoiceId = invoiceMap[invoiceNumber];
    if (!invoiceId) { console.warn(`  skip invoiceItems: no invoice ${invoiceNumber}`); continue; }
    await prisma.invoiceItem.deleteMany({ where: { invoiceId } });
    for (const item of items) {
      const serviceId = str(item.serviceCode) ? (serviceMap[item.serviceCode] ?? null) : null;
      const productId = str(item.productCode) ? (productMap[item.productCode] ?? null) : null;
      await prisma.invoiceItem.create({
        data: {
          invoiceId,
          type: item.type as ItemType,
          serviceId,
          productId,
          description: str(item.description),
          quantity: num(item.quantity, 1),
          unitPrice: num(item.unitPrice),
          discountAmount: num(item.discountAmount),
          totalPrice: num(item.totalPrice),
        },
      });
    }
    console.log(`  invoiceItems: ${invoiceNumber} (${items.length} items)`);
  }

  // 14. Payments
  console.log('\nSeeding payments...');
  for (const row of readCsv('payments')) {
    const invoiceId = invoiceMap[row.invoiceNumber];
    if (!invoiceId) { console.warn(`  skip payment: no invoice ${row.invoiceNumber}`); continue; }
    const customerId = customerMap[row.customerCode];
    if (!customerId) { console.warn(`  skip payment: no customer ${row.customerCode}`); continue; }
    const createdById = userMap[row.createdByEmail];
    if (!createdById) { console.warn(`  skip payment: no user ${row.createdByEmail}`); continue; }
    await prisma.payment.upsert({
      where: { paymentNumber: row.paymentNumber },
      update: {
        amount: num(row.amount),
        method: row.method as PaymentMethod,
        referenceNo: str(row.referenceNo) || null,
        notes: str(row.notes) || null,
        paidAt: dt(row.paidAt) ?? new Date(),
      },
      create: {
        paymentNumber: row.paymentNumber,
        invoiceId,
        customerId,
        amount: num(row.amount),
        method: row.method as PaymentMethod,
        referenceNo: str(row.referenceNo) || null,
        notes: str(row.notes) || null,
        paidAt: dt(row.paidAt) ?? new Date(),
        createdById,
      },
    });
    console.log(`  payment: ${row.paymentNumber} $${row.amount} [${row.method}]`);
  }

  // 15. Expenses
  console.log('\nSeeding expenses...');
  for (const row of readCsv('expenses')) {
    const createdById = userMap[row.createdByEmail];
    if (!createdById) { console.warn(`  skip expense: no user ${row.createdByEmail}`); continue; }
    await prisma.expense.upsert({
      where: { expenseNumber: row.expenseNumber },
      update: {
        category: row.category as ExpenseCategory,
        description: str(row.description),
        amount: num(row.amount),
        method: row.method as PaymentMethod,
        referenceNo: str(row.referenceNo) || null,
        notes: str(row.notes) || null,
        expenseDate: dt(row.expenseDate) ?? new Date(),
      },
      create: {
        expenseNumber: row.expenseNumber,
        category: row.category as ExpenseCategory,
        description: str(row.description),
        amount: num(row.amount),
        method: row.method as PaymentMethod,
        referenceNo: str(row.referenceNo) || null,
        notes: str(row.notes) || null,
        expenseDate: dt(row.expenseDate) ?? new Date(),
        createdById,
      },
    });
    console.log(`  expense: ${row.expenseNumber} [${row.category}] $${row.amount}`);
  }

  // 16. Audit Logs (skip if any already exist)
  console.log('\nSeeding audit logs...');
  const auditCount = await prisma.auditLog.count();
  if (auditCount === 0) {
    for (const row of readCsv('audit-logs')) {
      const userId = str(row.userEmail) ? (userMap[row.userEmail] ?? null) : null;
      await prisma.auditLog.create({
        data: {
          userId,
          action: row.action as AuditAction,
          entityType: str(row.entityType),
          entityId: str(row.entityId) || null,
          ipAddress: str(row.ipAddress) || null,
        },
      });
      console.log(`  auditLog: ${row.action} ${row.entityType}`);
    }
  } else {
    console.log(`  skip – ${auditCount} logs already exist`);
  }

  // 17. Settings
  console.log('\nSeeding settings...');
  for (const row of readCsv('settings')) {
    await prisma.setting.upsert({
      where: { key: row.key },
      update: {
        type: str(row.type, 'text'),
        group: str(row.group, 'general'),
        description: str(row.description) || null,
        isPublic: bool(row.isPublic, false),
      },
      create: {
        key: str(row.key),
        value: str(row.value) || null,
        type: str(row.type, 'text'),
        group: str(row.group, 'general'),
        description: str(row.description) || null,
        isPublic: bool(row.isPublic, false),
      },
    });
    console.log(`  setting: ${row.key} = ${row.value || '(empty)'}`);
  }

  console.log('\n✅ Seed complete!');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
