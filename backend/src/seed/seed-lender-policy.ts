import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lenderPolicies = [
  {
    lenderName: "State Bank of India",
    productName: "Personal Loan",
    loanType: "Personal Loan",
    overview:
      "Policy record created for integration testing. Official product terms have not yet been verified. Do not use this record as a lending decision or customer offer.",
    verified: false,
    isActive: true,
  },
  {
    lenderName: "HDFC Bank",
    productName: "Personal Loan",
    loanType: "Personal Loan",
    overview:
      "Policy record created for integration testing. Official product terms have not yet been verified. Do not use this record as a lending decision or customer offer.",
    verified: false,
    isActive: true,
  },
];

async function main() {
  for (const item of lenderPolicies) {
    const existing = await prisma.lenderPolicy.findFirst({
      where: {
        lenderName: item.lenderName,
        productName: item.productName,
        loanType: item.loanType,
      },
    });

    if (existing) {
      console.log(`Already exists: ${item.lenderName} — ${item.productName}`);
      continue;
    }

    await prisma.lenderPolicy.create({
      data: item,
    });

    console.log(`Created: ${item.lenderName} — ${item.productName}`);
  }

  const count = await prisma.lenderPolicy.count({
    where: { isActive: true },
  });

  console.log(`Active lender-policy records: ${count}`);
}

main()
  .catch((error) => {
    console.error("Lender-policy seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
