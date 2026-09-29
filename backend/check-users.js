const prisma = require("./src/prisma/prisma").default;

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNo: true,
      role: true,
      isActive: true,
      isBlocked: true,
      isDeleted: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  console.table(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
