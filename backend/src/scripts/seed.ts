import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';
import dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/backend/.env' });

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@helpdesk.local';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  const userEmail = process.env.USER_EMAIL || 'user@helpdesk.local';
  const userPass = process.env.USER_PASSWORD || 'User123!';
  const userName = process.env.USER_NAME || 'Usuário Teste';

  console.log('Seeding users...');

  const adminHash = await hashPassword(adminPass);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, name: adminName, role: 'ADMIN', isActive: true },
    create: { email: adminEmail, passwordHash: adminHash, name: adminName, role: 'ADMIN', isActive: true },
  });

  const userHash = await hashPassword(userPass);
  await prisma.user.upsert({
    where: { email: userEmail },
    update: { passwordHash: userHash, name: userName, role: 'USER', isActive: true },
    create: { email: userEmail, passwordHash: userHash, name: userName, role: 'USER', isActive: true },
  });

  console.log('Seed concluído:');
  console.log(` ADMIN => ${adminEmail} / ${adminPass}`);
  console.log(` USER  => ${userEmail} / ${userPass}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });