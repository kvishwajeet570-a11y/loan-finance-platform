import prisma from "../../config/database/prisma";
export class DashboardRepository {

  /* ===================================
     DASHBOARD OVERVIEW
  =================================== */

  static async getOverview() {

    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      verifiedUsers,
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
          isVerified: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      verifiedUsers,
    };
  }

  /* ===================================
     TOTAL DISBURSED AMOUNT
  =================================== */

  static async getDisbursedAmount() {

    const result =
      await prisma.loanApplication.aggregate({

        where: {
          status: "APPROVED",
        },

        _sum: {
          amount: true,
        },
      });

    return result._sum.amount || 0;
  }

  /* ===================================
     LOAN STATUS CHART
  =================================== */

  static async getLoanStatusAnalytics() {

    return prisma.loanApplication.groupBy({

      by: ["status"],

      _count: {
        id: true,
      },
    });
  }

  /* ===================================
     RECENT LOAN APPLICATIONS
  =================================== */

  static async getRecentLoans(
    limit = 10
  ) {

    return prisma.loanApplication.findMany({

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
          },
        },
      },
    });
  }

  /* ===================================
     RECENT USERS
  =================================== */

  static async getRecentUsers(
    limit = 10
  ) {

    return prisma.user.findMany({

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /* ===================================
     MONTHLY USER GROWTH
  =================================== */

  static async getMonthlyUserGrowth() {

    const users =
      await prisma.user.findMany({

        select: {
          createdAt: true,
        },
      });

    return users;
  }

  /* ===================================
     MONTHLY LOAN GROWTH
  =================================== */

  static async getMonthlyLoanGrowth() {

    const loans =
      await prisma.loanApplication.findMany({

        select: {
          createdAt: true,
          amount: true,
          status: true,
        },
      });

    return loans;
  }

  /* ===================================
     LOAN TYPE ANALYTICS
  =================================== */

  static async getLoanTypeAnalytics() {

    return prisma.loanApplication.groupBy({

      by: ["loanType"],

      _count: {
        id: true,
      },

      _sum: {
        amount: true,
      },
    });
  }

  /* ===================================
     TOP DSA PERFORMANCE
  =================================== */

  static async getTopDsaPerformance() {

    return prisma.user.findMany({

      where: {
        role: "DSA",
      },

      include: {
        loans: true,
      },

      take: 10,
    });
  }

  /* ===================================
     DASHBOARD DATA
  =================================== */

  static async getDashboardData() {

    const [
      overview,
      disbursedAmount,
      loanStatusAnalytics,
      recentLoans,
      recentUsers,
      loanTypeAnalytics,
    ] = await Promise.all([

      this.getOverview(),

      this.getDisbursedAmount(),

      this.getLoanStatusAnalytics(),

      this.getRecentLoans(),

      this.getRecentUsers(),

      this.getLoanTypeAnalytics(),
    ]);

    return {
      overview,
      disbursedAmount,
      loanStatusAnalytics,
      recentLoans,
      recentUsers,
      loanTypeAnalytics,
    };
  }
}