import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  const email = 'Your Email';

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log(`User ${email} already exists. Setting role to TEACHER...`);
    await prisma.user.update({
      where: { email },
      data: { role: 'TEACHER' }
    });
    console.log('Role updated.');
  } else {
    console.log(`Creating whitelisted faculty member ${email}...`);
    await prisma.user.create({
      data: {
        email,
        role: 'TEACHER'
      }
    });
    console.log('Successfully whitelisted!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
