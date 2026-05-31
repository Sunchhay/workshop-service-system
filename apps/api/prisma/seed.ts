import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

import {
  CommissionStatus,
  CustomerType,
  ExpenseStatus,
  ItemType,
  PaymentMethod,
  PaymentStatus, PrismaClient, RecordStatus,
  SaleStatus,
  UserRole
} from '../src/generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@workshop.com' },
    update: {
      name: 'Admin',
      passwordHash,
      role: UserRole.ADMIN,
      status: RecordStatus.ACTIVE,
    },
    create: {
      name: 'Admin',
      email: 'admin@workshop.com',
      passwordHash,
      role: UserRole.ADMIN,
      status: RecordStatus.ACTIVE,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@workshop.com' },
    update: {
      name: 'Staff',
      passwordHash,
      role: UserRole.STAFF,
      status: RecordStatus.ACTIVE,
    },
    create: {
      name: 'Staff',
      email: 'staff@workshop.com',
      passwordHash,
      role: UserRole.STAFF,
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed users done.');

  const customerOwner = await prisma.customer.create({
    data: {
      name: 'សុខា',
      phone: '012345678',
      customerType: CustomerType.OWNER,
      note: 'ម្ចាស់ម៉ាស៊ីន Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  const customerOwner2 = await prisma.customer.create({
    data: {
      name: 'វិសាល',
      phone: '098765432',
      customerType: CustomerType.OWNER,
      note: 'អតិថិជនទិញគ្រឿងបន្លាស់ញឹកញាប់',
      status: RecordStatus.ACTIVE,
    },
  });

  const mechanic = await prisma.customer.create({
    data: {
      name: 'ជាង ដារ៉ា',
      phone: '011222333',
      customerType: CustomerType.MECHANIC,
      note: 'ជាងដែលយកការងារមកហាង',
      status: RecordStatus.ACTIVE,
    },
  });

  const mechanic2 = await prisma.customer.create({
    data: {
      name: 'ជាង វណ្ណា',
      phone: '010888999',
      customerType: CustomerType.MECHANIC,
      note: 'ជាងជួសជុលម៉ាស៊ីនត្រាក់ទ័រ',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed customers done.');

  const ford6600 = await prisma.machineModel.upsert({
    where: { code: 'MDL-001' },
    update: {},
    create: {
      code: 'MDL-001',
      brand: 'Ford',
      modelName: 'Ford 6600',
      machineType: 'Tractor',
      year: '1975-1981',
      description: 'ម៉ូដែលត្រាក់ទ័រ Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  const ford7600 = await prisma.machineModel.upsert({
    where: { code: 'MDL-002' },
    update: {},
    create: {
      code: 'MDL-002',
      brand: 'Ford',
      modelName: 'Ford 7600',
      machineType: 'Tractor',
      year: '1975-1981',
      description: 'ម៉ូដែលត្រាក់ទ័រ Ford 7600',
      status: RecordStatus.ACTIVE,
    },
  });

  const kubota = await prisma.machineModel.upsert({
    where: { code: 'MDL-003' },
    update: {},
    create: {
      code: 'MDL-003',
      brand: 'Kubota',
      modelName: 'Kubota L4508',
      machineType: 'Tractor',
      year: 'General',
      description: 'ម៉ូដែល Kubota សម្រាប់ការងារស្រែ',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed machine models done.');

  const service1 = await prisma.service.upsert({
    where: { code: 'SRV-001' },
    update: {},
    create: {
      code: 'SRV-001',
      name: 'ម៉ាបក្បាលកន្លះ',
      nameEn: 'Cylinder Head Resurfacing',
      category: 'ក្បាលកន្លះ',
      description: 'សេវាកម្មម៉ាបក្បាលកន្លះឲ្យស្មើ',
      status: RecordStatus.ACTIVE,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { code: 'SRV-002' },
    update: {},
    create: {
      code: 'SRV-002',
      name: 'ស៊ីសូប៉ាប់',
      nameEn: 'Valve Seat Cutting / Valve Grinding',
      category: 'សូប៉ាប់',
      description: 'សេវាកម្មស៊ីសូប៉ាប់ប្រេង និងសូប៉ាប់ភ្លើង',
      status: RecordStatus.ACTIVE,
    },
  });

  const service3 = await prisma.service.upsert({
    where: { code: 'SRV-003' },
    update: {},
    create: {
      code: 'SRV-003',
      name: 'សំលាងវីលីគាំង',
      nameEn: 'Crankshaft Cleaning',
      category: 'វីលីគាំង',
      description: 'សេវាកម្មសំលាង និងពិនិត្យវីលីគាំង',
      status: RecordStatus.ACTIVE,
    },
  });

  const service4 = await prisma.service.upsert({
    where: { code: 'SRV-004' },
    update: {},
    create: {
      code: 'SRV-004',
      name: 'ប្តូរកូសាណេ',
      nameEn: 'Bearing Replacement',
      category: 'កូសាណេ',
      description: 'សេវាកម្មប្តូរកូសាណេ',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed services done.');

  await prisma.servicePrice.upsert({
    where: {
      serviceId_machineModelId: {
        serviceId: service1.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 15,
      mechanicPrice: 12,
    },
    create: {
      serviceId: service1.id,
      machineModelId: ford6600.id,
      ownerPrice: 15,
      mechanicPrice: 12,
      note: 'តម្លៃសម្រាប់ Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.servicePrice.upsert({
    where: {
      serviceId_machineModelId: {
        serviceId: service2.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 10,
      mechanicPrice: 8,
    },
    create: {
      serviceId: service2.id,
      machineModelId: ford6600.id,
      ownerPrice: 10,
      mechanicPrice: 8,
      note: 'ស៊ីសូប៉ាប់ Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.servicePrice.upsert({
    where: {
      serviceId_machineModelId: {
        serviceId: service1.id,
        machineModelId: ford7600.id,
      },
    },
    update: {
      ownerPrice: 18,
      mechanicPrice: 15,
    },
    create: {
      serviceId: service1.id,
      machineModelId: ford7600.id,
      ownerPrice: 18,
      mechanicPrice: 15,
      note: 'តម្លៃសម្រាប់ Ford 7600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.servicePrice.upsert({
    where: {
      serviceId_machineModelId: {
        serviceId: service3.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 12,
      mechanicPrice: 10,
    },
    create: {
      serviceId: service3.id,
      machineModelId: ford6600.id,
      ownerPrice: 12,
      mechanicPrice: 10,
      note: 'សំលាងវីលីគាំង Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed service prices done.');

  const product1 = await prisma.product.upsert({
    where: { code: 'PRD-001' },
    update: {},
    create: {
      code: 'PRD-001',
      name: 'ក្រវ៉ាត់ពិស្តុង',
      nameEn: 'Piston Ring',
      category: 'គ្រឿងម៉ាស៊ីន',
      unit: 'set',
      description: 'ក្រវ៉ាត់ពិស្តុងសម្រាប់ម៉ាស៊ីន',
      status: RecordStatus.ACTIVE,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { code: 'PRD-002' },
    update: {},
    create: {
      code: 'PRD-002',
      name: 'ពិស្តុង',
      nameEn: 'Piston',
      category: 'គ្រឿងម៉ាស៊ីន',
      unit: 'pcs',
      description: 'ពិស្តុងសម្រាប់ម៉ាស៊ីន',
      status: RecordStatus.ACTIVE,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { code: 'PRD-003' },
    update: {},
    create: {
      code: 'PRD-003',
      name: 'រ៉ងក្បាលកន្លះ',
      nameEn: 'Cylinder Head Gasket',
      category: 'រ៉ង',
      unit: 'pcs',
      description: 'រ៉ងសម្រាប់ក្បាលកន្លះ',
      status: RecordStatus.ACTIVE,
    },
  });

  const product4 = await prisma.product.upsert({
    where: { code: 'PRD-004' },
    update: {},
    create: {
      code: 'PRD-004',
      name: 'កូសាណេ',
      nameEn: 'Bearing',
      category: 'កូសាណេ',
      unit: 'set',
      description: 'កូសាណេសម្រាប់ម៉ាស៊ីន',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed products done.');

  await prisma.productPrice.upsert({
    where: {
      productId_machineModelId: {
        productId: product1.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 10,
      mechanicPrice: 9,
    },
    create: {
      productId: product1.id,
      machineModelId: ford6600.id,
      ownerPrice: 10,
      mechanicPrice: 9,
      note: 'ក្រវ៉ាត់ពិស្តុង Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productPrice.upsert({
    where: {
      productId_machineModelId: {
        productId: product1.id,
        machineModelId: ford7600.id,
      },
    },
    update: {
      ownerPrice: 13,
      mechanicPrice: 11,
    },
    create: {
      productId: product1.id,
      machineModelId: ford7600.id,
      ownerPrice: 13,
      mechanicPrice: 11,
      note: 'ក្រវ៉ាត់ពិស្តុង Ford 7600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productPrice.upsert({
    where: {
      productId_machineModelId: {
        productId: product2.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 25,
      mechanicPrice: 22,
    },
    create: {
      productId: product2.id,
      machineModelId: ford6600.id,
      ownerPrice: 25,
      mechanicPrice: 22,
      note: 'ពិស្តុង Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productPrice.upsert({
    where: {
      productId_machineModelId: {
        productId: product3.id,
        machineModelId: ford6600.id,
      },
    },
    update: {
      ownerPrice: 5,
      mechanicPrice: 4,
    },
    create: {
      productId: product3.id,
      machineModelId: ford6600.id,
      ownerPrice: 5,
      mechanicPrice: 4,
      note: 'រ៉ងក្បាលកន្លះ Ford 6600',
      status: RecordStatus.ACTIVE,
    },
  });

  console.log('Seed product prices done.');

  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'ហាងគ្រឿងបន្លាស់ សុវណ្ណ',
      phone: '015111222',
      note: 'ផ្គត់ផ្គង់គ្រឿងម៉ាស៊ីន Ford',
      status: RecordStatus.ACTIVE,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'ហាងគ្រឿងបន្លាស់ រតនា',
      phone: '016333444',
      note: 'តម្លៃសមរម្យសម្រាប់គ្រឿងបន្លាស់ទូទៅ',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productSupplierPrice.createMany({
    data: [
      {
        productId: product1.id,
        supplierId: supplier1.id,
        buyingPrice: 7.5,
        currency: 'USD',
        lastUpdatedAt: new Date(),
        note: 'តម្លៃទិញពី supplier សុវណ្ណ',
      },
      {
        productId: product1.id,
        supplierId: supplier2.id,
        buyingPrice: 7.2,
        currency: 'USD',
        lastUpdatedAt: new Date(),
        note: 'តម្លៃទិញពី supplier រតនា',
      },
      {
        productId: product2.id,
        supplierId: supplier1.id,
        buyingPrice: 18,
        currency: 'USD',
        lastUpdatedAt: new Date(),
        note: 'ពិស្តុង Ford 6600',
      },
    ],
  });

  console.log('Seed suppliers and supplier prices done.');

  const cart = await prisma.cart.create({
    data: {
      customerId: customerOwner.id,
      mechanicId: mechanic.id,
      createdById: staff.id,
      commissionAmount: 2,
      commissionNote: 'កម្រៃជើងសារជាង ដារ៉ា',
      note: 'ការងារ Ford 6600',
      status: 'ACTIVE',
      items: {
        create: [
          {
            itemType: ItemType.SERVICE,
            serviceId: service1.id,
            machineModelId: ford6600.id,
            nameSnapshot: 'Ford 6600 - ម៉ាបក្បាលកន្លះ',
            unitPrice: 15,
            quantity: 1,
            total: 15,
            note: 'ម៉ាបក្បាលកន្លះ',
          },
          {
            itemType: ItemType.PRODUCT,
            productId: product3.id,
            machineModelId: ford6600.id,
            nameSnapshot: 'Ford 6600 - រ៉ងក្បាលកន្លះ',
            unitPrice: 5,
            quantity: 1,
            total: 5,
            note: 'រ៉ងថ្មី',
          },
        ],
      },
    },
  });

  console.log(`Seed sample cart done: ${cart.id}`);

  const sale = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-000001',
      customerId: customerOwner2.id,
      mechanicId: mechanic2.id,
      createdById: admin.id,
      subtotal: 30,
      grandTotal: 30,
      paidAmount: 20,
      balanceAmount: 10,
      commissionAmount: 3,
      commissionNote: 'ជាង វណ្ណា ណែនាំអតិថិជន',
      commissionStatus: CommissionStatus.UNPAID,
      paymentStatus: PaymentStatus.PARTIAL,
      saleStatus: SaleStatus.COMPLETED,
      note: 'អតិថិជនបង់មុន 20$ នៅសល់ 10$',
      items: {
        create: [
          {
            itemType: ItemType.SERVICE,
            serviceId: service2.id,
            machineModelId: ford6600.id,
            nameSnapshot: 'Ford 6600 - ស៊ីសូប៉ាប់',
            unitPrice: 10,
            quantity: 1,
            total: 10,
          },
          {
            itemType: ItemType.PRODUCT,
            productId: product1.id,
            machineModelId: ford6600.id,
            nameSnapshot: 'Ford 6600 - ក្រវ៉ាត់ពិស្តុង',
            unitPrice: 10,
            quantity: 2,
            total: 20,
          },
        ],
      },
      payments: {
        create: [
          {
            paymentMethod: PaymentMethod.CASH,
            amount: 20,
            paidAt: new Date(),
            note: 'បង់សាច់ប្រាក់',
          },
        ],
      },
    },
  });

  await prisma.customer.update({
    where: { id: customerOwner2.id },
    data: { lastPurchasedAt: new Date() },
  });

  console.log(`Seed sample sale done: ${sale.invoiceNo}`);

  await prisma.expense.create({
    data: {
      expenseNo: 'EXP-000001',
      title: 'ទិញគ្រឿងបន្លាស់ពី supplier',
      category: 'Parts Purchase',
      amount: 50,
      paymentMethod: PaymentMethod.CASH,
      expenseStatus: ExpenseStatus.PAID,
      supplierId: supplier1.id,
      referenceNo: 'SUP-001',
      note: 'ទិញក្រវ៉ាត់ពិស្តុង និងរ៉ង',
      expenseDate: new Date(),
      createdById: admin.id,
    },
  });

  await prisma.expense.create({
    data: {
      expenseNo: 'EXP-000002',
      title: 'បង់កម្រៃជើងសារជាង',
      category: 'Mechanic Commission',
      amount: 3,
      paymentMethod: PaymentMethod.CASH,
      expenseStatus: ExpenseStatus.PAID,
      mechanicId: mechanic2.id,
      referenceNo: sale.invoiceNo,
      note: 'បង់កម្រៃជើងសារជាង វណ្ណា',
      expenseDate: new Date(),
      createdById: admin.id,
    },
  });

  console.log('Seed expenses done.');

  const existingReference = await prisma.referenceBook.findFirst({
    where: {
      title: 'Ford 6600 - ឯកសារយោងបច្ចេកទេសម៉ាស៊ីន',
    },
  });

  if (existingReference) {
    await prisma.referenceBook.delete({
      where: { id: existingReference.id },
    });
  }

  await prisma.referenceBook.create({
    data: {
      title: 'Ford 6600 - ឯកសារយោងបច្ចេកទេសម៉ាស៊ីន',
      category: 'Engine Specification',
      machineModelId: ford6600.id,
      summary:
        'ឯកសារយោងសម្រាប់ពិនិត្យទំហំ និងគម្លាតពេលជួសជុលម៉ាស៊ីន Ford 6600។',
      createdById: admin.id,
      status: RecordStatus.ACTIVE,
      sections: {
        create: [
          {
            name: 'Cylinder',
            description: 'ទំហំស៊ីឡាំង ពិស្តុង ក្រវ៉ាត់ពិស្តុង និងគម្លាត',
            sortOrder: 1,
            items: {
              create: [
                {
                  label: 'Piston Size',
                  value: '111.76',
                  unit: 'mm',
                  note: 'ទំហំស្តង់ដារ',
                  sortOrder: 1,
                },
                {
                  label: 'Piston Wrist Pin Size',
                  value: '35',
                  unit: 'mm',
                  note: 'វាស់មុនពេលដោះដូរ',
                  sortOrder: 2,
                },
                {
                  label: 'Piston Ring Size',
                  value: '112',
                  unit: 'mm',
                  note: 'ត្រូវផ្គូផ្គងជាមួយស៊ីឡាំង',
                  sortOrder: 3,
                },
                {
                  label: 'Cylinder Size',
                  value: '112',
                  unit: 'mm',
                  note: 'ទំហំស៊ីឡាំង',
                  sortOrder: 4,
                },
                {
                  label: 'Cylinder Height',
                  value: '250',
                  unit: 'mm',
                  note: 'វាស់ពីបាតដល់លើ',
                  sortOrder: 5,
                },
                {
                  label: 'សីធូ',
                  value: '0.05',
                  unit: 'mm',
                  note: 'គម្លាតស្តង់ដារ',
                  sortOrder: 6,
                },
                {
                  label: 'សំលាងធូរ',
                  value: '0.1',
                  unit: 'mm',
                  note: 'គម្លាតក្រោយសំលាង ឬធូរ',
                  sortOrder: 7,
                },
              ],
            },
          },
          {
            name: 'Cylinder Head',
            description: 'ទំហំសូប៉ាប់ មុំសូប៉ាប់ និងក្បាលកន្លះ',
            sortOrder: 2,
            items: {
              create: [
                {
                  label: 'ទំហំសូប៉ាប់ភ្លើង',
                  value: '38',
                  unit: 'mm',
                  note: 'Exhaust valve size',
                  sortOrder: 1,
                },
                {
                  label: 'មុំសូប៉ាប់ភ្លើង',
                  value: '45',
                  unit: 'degree',
                  note: 'Exhaust valve angle',
                  sortOrder: 2,
                },
                {
                  label: 'ទំហំសូប៉ាប់ប្រេង',
                  value: '42',
                  unit: 'mm',
                  note: 'Intake valve size',
                  sortOrder: 3,
                },
                {
                  label: 'មុំសូប៉ាប់ប្រេង',
                  value: '60',
                  unit: 'degree',
                  note: 'Intake valve angle',
                  sortOrder: 4,
                },
                {
                  label: 'កម្រាស់រ៉ង',
                  value: '1.5',
                  unit: 'mm',
                  note: 'កម្រាស់រ៉ងក្បាលកន្លះ',
                  sortOrder: 5,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seed reference book done.');

  const settings = [
    {
      key: 'business_name',
      value: 'សាន់ឆាយ ជាងម៉ាស៊ីន',
      type: 'text',
      group: 'business',
      description: 'ឈ្មោះហាង',
      isPublic: true,
    },
    {
      key: 'business_phone',
      value: '012345678',
      type: 'text',
      group: 'business',
      description: 'លេខទូរស័ព្ទហាង',
      isPublic: true,
    },
    {
      key: 'business_address',
      value: 'ភ្នំពេញ កម្ពុជា',
      type: 'text',
      group: 'business',
      description: 'អាសយដ្ឋានហាង',
      isPublic: true,
    },
    {
      key: 'invoice_prefix',
      value: 'INV',
      type: 'text',
      group: 'invoice',
      description: 'លេខកូដដើមសម្រាប់វិក្កយបត្រ',
      isPublic: false,
    },
    {
      key: 'invoice_footer',
      value: 'អរគុណសម្រាប់ការគាំទ្រ',
      type: 'text',
      group: 'invoice',
      description: 'សារបង្ហាញខាងក្រោមវិក្កយបត្រ',
      isPublic: true,
    },
    {
      key: 'default_currency',
      value: 'USD',
      type: 'text',
      group: 'system',
      description: 'រូបិយប័ណ្ណលំនាំដើម',
      isPublic: true,
    },
    {
      key: 'customer_required_checkout',
      value: 'true',
      type: 'boolean',
      group: 'cart',
      description: 'តម្រូវឲ្យជ្រើសអតិថិជនមុន checkout',
      isPublic: false,
    },
    {
      key: 'allow_edit_service_price',
      value: 'true',
      type: 'boolean',
      group: 'cart',
      description: 'អនុញ្ញាតឲ្យកែតម្លៃសេវាកម្មក្នុងកន្ត្រក',
      isPublic: false,
    },
    {
      key: 'allow_edit_product_price',
      value: 'true',
      type: 'boolean',
      group: 'cart',
      description: 'អនុញ្ញាតឲ្យកែតម្លៃផលិតផលក្នុងកន្ត្រក',
      isPublic: false,
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log('Seed settings done.');
  console.log('Seeding completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });