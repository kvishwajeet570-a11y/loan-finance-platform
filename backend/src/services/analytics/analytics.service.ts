import prisma from "../../prisma/prisma";

class AnalyticsService {
  async getDashboardAnalytics() {
    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalPartners,
      totalDSA,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: { status: "approved" },
      }),

      prisma.loanApplication.count({
        where: { status: "rejected" },
      }),

      prisma.loanApplication.count({
        where: { status: "pending" },
      }),

      prisma.user.count({
        where: { role: "partner" },
      }),

      prisma.user.count({
        where: { role: "dsa" },
      }),
    ]);

    const disbursedAmount =
      await prisma.loanApplication.aggregate({
        where: {
          status: "approved",
        },
        _sum: {
          amount: true,
        },
      });

    const approvalRate =
      totalLoans > 0
        ? Number(
            (
              (approvedLoans / totalLoans) *
              100
            ).toFixed(2)
          )
        : 0;

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalPartners,
      totalDSA,
      approvalRate,
      totalDisbursed:
        Number(
          disbursedAmount._sum.amount
        ) || 0,
    };
  }

  async getLoanTypeAnalytics() {
    return prisma.loanApplication.groupBy({
      by: ["loanType"],
      _count: {
        loanType: true,
      },
    });
  }

  async getRecentApplications(limit = 10) {
    return prisma.loanApplication.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        loanType: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getMonthlyTrend() {
    return prisma.loanApplication.findMany({
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export default new AnalyticsService();