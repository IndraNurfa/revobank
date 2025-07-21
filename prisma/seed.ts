import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123qwe', 10);

  // Seed Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
    },
  });

  // Seed Users
  const usersData = [
    {
      username: 'user1',
      email: 'user1@example.com',
      phone_number: '0811111111',
      full_name: 'User One',
      address: 'Jl. Mawar No.1',
      dob: new Date('1990-01-01'),
      role_id: customerRole.id,
      password: password,
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      phone_number: '0811111112',
      full_name: 'User Two',
      address: 'Jl. Mawar No.2',
      dob: new Date('1991-01-01'),
      role_id: customerRole.id,
      password: password,
    },
    {
      username: 'user3',
      email: 'user3@example.com',
      phone_number: '0811111113',
      full_name: 'User Three',
      address: 'Jl. Mawar No.3',
      dob: new Date('1992-01-01'),
      role_id: customerRole.id,
      password: password,
    },
    {
      username: 'admin1',
      email: 'admin1@example.com',
      phone_number: '0811111120',
      full_name: 'Admin One',
      address: 'Jl. Melati No.1',
      dob: new Date('1985-05-01'),
      role_id: adminRole.id,
      password: password,
    },
    {
      username: 'admin2',
      email: 'admin2@example.com',
      phone_number: '0811111121',
      full_name: 'Admin Two',
      address: 'Jl. Melati No.2',
      dob: new Date('1986-06-01'),
      role_id: adminRole.id,
      password: password,
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed.', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
