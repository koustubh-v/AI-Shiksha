import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const franchises = await prisma.franchise.findMany({ select: { id: true, domain: true } });
  console.log("Franchises:");
  console.log(franchises);

  for (const f of franchises) {
      const uCount = await prisma.user.count({ where: { franchise_id: f.id } });
      const cCount = await prisma.course.count({ where: { franchise_id: f.id } });
      console.log(`Franchise ${f.domain} (${f.id}): ${uCount} users, ${cCount} courses`);
  }

  const nullUsers = await prisma.user.count({ where: { franchise_id: null } });
  console.log(`NULL franchise: ${nullUsers} users`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
