import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const loans = await prisma.loanApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      fullName: true,
      amount: true,
      status: true,
      userId: true,
      createdAt: true,
    },
  });

  console.log(JSON.stringify(loans, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
