import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: "superadmin@loanfinance.com",
    },
    select: {
      id: true,
      email: true,
      role: true,
      isBlocked: true,
      isVerified: true,
      roleRef: {
        select: {
          id: true,
          name: true,
          code: true,
          slug: true,
          isActive: true,
        },
      },
    },
  });

  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
