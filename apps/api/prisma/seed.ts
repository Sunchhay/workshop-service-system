import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { PrismaClient, UserRole } from '../src/generated/prisma/client';

const BCRYPT_ROUNDS = 10;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const users: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}[] = [
  {
    email: 'admin@workshop.local',
    password: 'Admin@123',
    name: 'System Admin',
    role: UserRole.ADMIN,
    isActive: true,
  },
  {
    email: 'staff@workshop.local',
    password: 'Staff@123',
    name: 'Workshop Staff',
    role: UserRole.STAFF,
    isActive: true,
  },
  {
    email: 'technician@workshop.local',
    password: 'Technician@123',
    name: 'Workshop Technician',
    role: UserRole.TECHNICIAN,
    isActive: true,
  },
  {
    email: 'cashier@workshop.local',
    password: 'Cashier@123',
    name: 'Workshop Cashier',
    role: UserRole.CASHIER,
    isActive: true,
  },
];

async function main() {
  console.log('Running seed...');

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      console.log(`  skip   ${user.email} (already exists)`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });

    console.log(`  seeded ${user.email} [${user.role}]`);
  }

  console.log('Seed complete.');
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
