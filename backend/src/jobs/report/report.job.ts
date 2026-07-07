import cron from "node-cron";
import prisma from "../../config/prisma";

export const reportJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Generating Daily Report...");

    const totalUsers =
      await prisma.user.count();

    const totalLoans =
      await prisma.loanApplication.count();

    const approvedLoans =
      await prisma.loanApplication.count({
        where: {
          status: "approved",
        },
      });

    const totalTransactions =
      await prisma.transaction.count();

    const revenue =
      await prisma.commission.aggregate({
        _sum: {
          amount: true,
        },
      });

    await prisma.revenueAnalytics.create({
      data: {
        totalRevenue:
          revenue._sum.amount || 0,
        totalUsers,
        totalLoans,
        totalTransactions,
      },
    });

    console.log("Report Generated");
  });
};