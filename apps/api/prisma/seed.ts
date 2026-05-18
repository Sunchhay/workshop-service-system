import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { PrismaClient } from '../src/generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@workshop.local' },
  });

  if (existing) {
    console.log('Seed skipped — admin@workshop.local already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@1234', 10);

  await prisma.user.create({
    data: {
      email: 'admin@workshop.local',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Seeded → admin@workshop.local / Admin@1234');
  console.log('Change this password after first login.');
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
