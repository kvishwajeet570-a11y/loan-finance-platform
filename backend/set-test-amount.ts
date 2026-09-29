import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const loanId = "cmtx1e39f0002q6mjviwqtu9f";

  const loan = await prisma.loanApplication.update({
    where: { id: loanId },
    data: { amount: 50000 },
    select: {
      id: true,
      fullName: true,
      amount: true,
      status: true,
    },
  });

  console.log(JSON.stringify(loan, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
