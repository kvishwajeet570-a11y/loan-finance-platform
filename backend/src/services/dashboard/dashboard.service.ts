import prisma from "../../prisma/prisma";

class DashboardService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalLoans,
      totalApprovedLoans,
      totalPendingLoans,
      totalRejectedLoans,
      totalPartners,
      totalDSA,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.user.count({
        where: {
          role: "partner",
        },
      }),

      prisma.user.count({
        where: {
          role: "dsa",
        },
      }),
    ]);

    return {
      totalUsers,
      totalLoans,
      totalApprovedLoans,
      totalPendingLoans,
      totalRejectedLoans,
      totalPartners,
      totalDSA,
    };
  }

  async getRevenueAnalytics() {
    const result =
      await prisma.loanApplication.aggregate({
        where: {
          status: "APPROVED",
        },
        _sum: {
          amount: true,
        },
        _count: true,
      });

    return {
      totalDisbursed:
        result?._sum?.amount ?? 0,

      totalApprovedLoans:
        result._count,
    };
  }

  async getRecentLoans(limit = 10) {
    return prisma.loanApplication.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async getRecentUsers(limit = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMonthlyLoanAnalytics() {
    const currentYear =
      new Date().getFullYear();

    const data = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(
        currentYear,
        month,
        1
      );

      const endDate = new Date(
        currentYear,
        month + 1,
        0,
        23,
        59,
        59
      );

      const count =
        await prisma.loanApplication.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

      data.push({
        month: month + 1,
        applications: count,
      });
    }

    return data;
  }

  async getLoanStatusAnalytics() {
    const [
      approved,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      approved,
      pending,
      rejected,
    };
  }

  async getUserGrowthAnalytics() {
    const currentYear =
      new Date().getFullYear();

    const result = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(
        currentYear,
        month,
        1
      );

      const endDate = new Date(
        currentYear,
        month + 1,
        0,
        23,
        59,
        59
      );

      const users =
        await prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

      result.push({
        month: month + 1,
        users,
      });
    }

    return result;
  }

  async getTopDSA(limit = 10) {
    return prisma.user.findMany({
      where: {
        role: "dsa",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getKPIs() {
    const [
      totalLoanAmount,
      approvedLoanAmount,
      pendingLoanAmount,
    ] = await Promise.all([
      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.loanApplication.aggregate({
        where: {
          status: "APPROVED",
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.loanApplication.aggregate({
        where: {
          status: "PENDING",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalLoanAmount:
        totalLoanAmount?._sum?.amount ?? 0,

      approvedLoanAmount:
        approvedLoanAmount?._sum?.amount ?? 0,

      pendingLoanAmount:
        pendingLoanAmount?._sum?.amount ?? 0,
    };
  }

  async getCompleteDashboard() {
    const [
      stats,
      revenue,
      recentLoans,
      recentUsers,
      loanStatus,
      kpis,
    ] = await Promise.all([
      this.getDashboardStats(),
      this.getRevenueAnalytics(),
      this.getRecentLoans(),
      this.getRecentUsers(),
      this.getLoanStatusAnalytics(),
      this.getKPIs(),
    ]);

    return {
      stats,
      revenue,
      recentLoans,
      recentUsers,
      loanStatus,
      kpis,
    };
  }
}

export default new DashboardService();