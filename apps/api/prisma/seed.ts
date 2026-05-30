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
  ExpenseCategory,
  InvoiceStatus,
  ItemType,
  PaymentMethod,
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
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
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
      update: {
        name: str(row.name),
        role: row.role as UserRole,
        isActive: bool(row.isActive),
      },
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
        imageUrl: str(row.imageUrl) || null,
        customerType: row.customerType as CustomerType,
        notes: str(row.notes) || null,
        isActive: bool(row.isActive),
      },
      create: {
        code: row.code,
        name: str(row.name),
        phone: str(row.phone),
        imageUrl: str(row.imageUrl) || null,
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
        imageUrl: str(row.imageUrl) || null,
        category: str(row.category) || null,
        relatedComponent: str(row.relatedComponent) || null,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
      create: {
        code: row.code,
        nameEn: str(row.nameEn),
        nameKh: str(row.nameKh) || null,
        imageUrl: str(row.imageUrl) || null,
        category: str(row.category) || null,
        relatedComponent: str(row.relatedComponent) || null,
        description: str(row.description) || null,
        isActive: bool(row.isActive),
      },
    });
    serviceMap[row.code] = service.id;
    console.log(`  service: ${row.code} – ${row.nameEn}`);
  }

  // 4. Machine Models
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

  // 5. Price Catalog
  console.log('\nSeeding price catalogs...');
  const priceCatalogMap: Record<string, string> = {};
  for (const row of readCsv('price-catalog')) {
    const serviceId = serviceMap[row.serviceCode];
    const machineModelId =
      machineModelMap[`${row.machineModelBrand}|${row.machineModelModel}`];
    if (!serviceId) {
      console.warn(`  skip catalog: no service ${row.serviceCode}`);
      continue;
    }
    if (!machineModelId) {
      console.warn(
        `  skip catalog: no machine model ${row.machineModelBrand} ${row.machineModelModel}`,
      );
      continue;
    }
    const existing = await prisma.priceCatalog.findFirst({
      where: { serviceId, machineModelId, label: row.label },
    });
    const data = {
      serviceId,
      machineModelId,
      label: str(row.label),
      unitPrice: num(row.unitPrice),
      currency: str(row.currency, 'USD'),
      notes: str(row.notes) || null,
      isActive: bool(row.isActive),
    };
    const catalog = existing
      ? await prisma.priceCatalog.update({ where: { id: existing.id }, data })
      : await prisma.priceCatalog.create({ data });
    priceCatalogMap[
      `${row.serviceCode}|${row.machineModelBrand}|${row.machineModelModel}|${row.label}`
    ] = catalog.id;
    console.log(
      `  catalog: [${row.machineModelBrand} ${row.machineModelModel}] [${row.serviceCode}] ${row.label} = $${row.unitPrice}`,
    );
  }

  // 6. Reference Book
  console.log('\nSeeding reference books...');
  const referenceBookMap: Record<string, string> = {};
  for (const row of readCsv('reference-book')) {
    const partCode = str(row.partCode) || null;
    if (!partCode) continue;
    const machineModelId =
      str(row.machineModelBrand) && str(row.machineModelModel)
        ? (machineModelMap[
            `${row.machineModelBrand}|${row.machineModelModel}`
          ] ?? null)
        : null;
    const existing = await prisma.referenceBook.findFirst({
      where: { partCode },
    });
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
        nameKh: str(row.nameKh) || null,
        nameEn: str(row.nameEn) || null,
        aliases: str(row.aliases) || null,
        imageUrl: str(row.imageUrl) || null,
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
        nameKh: str(row.nameKh) || null,
        nameEn: str(row.nameEn) || null,
        aliases: str(row.aliases) || null,
        imageUrl: str(row.imageUrl) || null,
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

  // 8. Sales
  console.log('\nSeeding sales...');
  const saleMap: Record<string, string> = {};
  for (const row of readCsv('sales')) {
    const customerId = str(row.customerCode)
      ? (customerMap[row.customerCode] ?? null)
      : null;
    const createdById = userMap[row.createdByEmail];
    if (!createdById) {
      console.warn(`  skip sale: no user ${row.createdByEmail}`);
      continue;
    }
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
    console.log(
      `  sale: ${row.saleNumber} [${row.status}] $${row.totalAmount}`,
    );
  }

  // 9. Sale Items (delete + recreate per sale)
  console.log('\nSeeding sale items...');
  const saleItemsBySale: Record<string, Row[]> = {};
  for (const row of readCsv('sale-items')) {
    (saleItemsBySale[row.saleNumber] ??= []).push(row);
  }
  for (const [saleNumber, items] of Object.entries(saleItemsBySale)) {
    const saleId = saleMap[saleNumber];
    if (!saleId) {
      console.warn(`  skip saleItems: no sale ${saleNumber}`);
      continue;
    }
    await prisma.saleItem.deleteMany({ where: { saleId } });
    for (const item of items) {
      const itemType = (str(item.type) || 'PRODUCT') as ItemType;
      const productId = str(item.productCode)
        ? (productMap[item.productCode] ?? null)
        : null;
      const serviceId = str(item.serviceCode)
        ? (serviceMap[item.serviceCode] ?? null)
        : null;
      if (itemType === 'PRODUCT' && !productId && str(item.productCode)) {
        console.warn(`  skip saleItem: no product ${item.productCode}`);
        continue;
      }
      await prisma.saleItem.create({
        data: {
          saleId,
          type: itemType,
          productId,
          serviceId,
          itemCode: str(item.itemCode) || null,
          itemNameKh: str(item.itemNameKh) || null,
          itemNameEn: str(item.itemNameEn) || null,
          description:
            str(item.description) ||
            str(item.itemNameEn) ||
            str(item.itemNameKh) ||
            'Item',
          quantity: num(item.quantity, 1),
          unitPrice: num(item.unitPrice),
          discountAmount: num(item.discountAmount),
          totalPrice: num(item.totalPrice),
        },
      });
    }
    console.log(`  saleItems: ${saleNumber} (${items.length} items)`);
  }

  // 10. Invoices
  console.log('\nSeeding invoices...');
  const invoiceMap: Record<string, string> = {};
  for (const row of readCsv('invoices')) {
    const customerId = customerMap[row.customerCode];
    if (!customerId) {
      console.warn(`  skip invoice: no customer ${row.customerCode}`);
      continue;
    }
    const createdById = userMap[row.createdByEmail];
    if (!createdById) {
      console.warn(`  skip invoice: no user ${row.createdByEmail}`);
      continue;
    }
    const saleId = str(row.saleNumber)
      ? (saleMap[row.saleNumber] ?? null)
      : null;
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
    console.log(
      `  invoice: ${row.invoiceNumber} [${row.status}] $${row.totalAmount}`,
    );
  }

  // 11. Invoice Items (delete + recreate per invoice)
  console.log('\nSeeding invoice items...');
  const invoiceItemsByInvoice: Record<string, Row[]> = {};
  for (const row of readCsv('invoice-items')) {
    (invoiceItemsByInvoice[row.invoiceNumber] ??= []).push(row);
  }
  for (const [invoiceNumber, items] of Object.entries(invoiceItemsByInvoice)) {
    const invoiceId = invoiceMap[invoiceNumber];
    if (!invoiceId) {
      console.warn(`  skip invoiceItems: no invoice ${invoiceNumber}`);
      continue;
    }
    await prisma.invoiceItem.deleteMany({ where: { invoiceId } });
    for (const item of items) {
      const serviceId = str(item.serviceCode)
        ? (serviceMap[item.serviceCode] ?? null)
        : null;
      const productId = str(item.productCode)
        ? (productMap[item.productCode] ?? null)
        : null;
      await prisma.invoiceItem.create({
        data: {
          invoiceId,
          type: item.type as ItemType,
          serviceId,
          productId,
          description: str(item.description),
          itemCode: str(item.itemCode) || null,
          itemNameKh: str(item.itemNameKh) || null,
          itemNameEn: str(item.itemNameEn) || null,
          quantity: num(item.quantity, 1),
          unitPrice: num(item.unitPrice),
          discountAmount: num(item.discountAmount),
          totalPrice: num(item.totalPrice),
        },
      });
    }
    console.log(`  invoiceItems: ${invoiceNumber} (${items.length} items)`);
  }

  // 12. Payments
  console.log('\nSeeding payments...');
  for (const row of readCsv('payments')) {
    const invoiceId = invoiceMap[row.invoiceNumber];
    if (!invoiceId) {
      console.warn(`  skip payment: no invoice ${row.invoiceNumber}`);
      continue;
    }
    const customerId = customerMap[row.customerCode];
    if (!customerId) {
      console.warn(`  skip payment: no customer ${row.customerCode}`);
      continue;
    }
    const createdById = userMap[row.createdByEmail];
    if (!createdById) {
      console.warn(`  skip payment: no user ${row.createdByEmail}`);
      continue;
    }
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
    console.log(
      `  payment: ${row.paymentNumber} $${row.amount} [${row.method}]`,
    );
  }

  // 13. Expenses
  console.log('\nSeeding expenses...');
  for (const row of readCsv('expenses')) {
    const createdById = userMap[row.createdByEmail];
    if (!createdById) {
      console.warn(`  skip expense: no user ${row.createdByEmail}`);
      continue;
    }
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
    console.log(
      `  expense: ${row.expenseNumber} [${row.category}] $${row.amount}`,
    );
  }

  // 14. Audit Logs (skip if any already exist)
  console.log('\nSeeding audit logs...');
  const auditCount = await prisma.auditLog.count();
  if (auditCount === 0) {
    for (const row of readCsv('audit-logs')) {
      const userId = str(row.userEmail)
        ? (userMap[row.userEmail] ?? null)
        : null;
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

  // 15. Settings
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
