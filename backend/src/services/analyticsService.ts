import prisma
from "../prisma/prisma";


/* ========================================
   GET ANALYTICS
======================================== */

export const getAnalyticsService =
  async () => {

    const totalUsers =
      await prisma.user.count();

    const totalLoans =
      await prisma.loanApplication.count();

    const totalTransactions =
      await prisma.transaction.count();

    const revenue =
      await prisma.transaction.aggregate({

        _sum: {

          amount: true,

        },

      });

    return {

      totalUsers,

      totalLoans,

      totalTransactions,

      totalRevenue:
        revenue._sum.amount || 0,

    };

  };