import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('No seed data configured for production.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
