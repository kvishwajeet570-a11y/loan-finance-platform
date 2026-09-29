import prisma from "../../prisma/prisma";

export class AnalyticsRepository {

  /* ==================================
     OVERVIEW ANALYTICS
  ================================== */

  static async getOverviewAnalytics() {

    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      verifiedUsers
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: { status: "APPROVED" }
      }),

      prisma.loanApplication.count({
        where: { status: "PENDING" }
      }),

      prisma.loanApplication.count({
        where: { status: "REJECTED" }
      }),

      prisma.user.count({
        where: { isVerified: true }
      })
    ]);

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      verifiedUsers
    };
  }

  /* ==================================
     LOAN AMOUNT ANALYTICS
  ================================== */

  static async getLoanAmountAnalytics() {

    const result =
      await prisma.loanApplication.aggregate({

        _sum: {
          amount: true
        },

        _avg: {
          amount: true
        },

        _max: {
          amount: true
        },

        _min: {
          amount: true
        }
      });

    return result;
  }

  /* ==================================
     LOAN STATUS ANALYTICS
  ================================== */

  static async getLoanStatusAnalytics() {

    return prisma.loanApplication.groupBy({

      by: ["status"],

      _count: {
        id: true
      }
    });
  }

  /* ==================================
     LOAN TYPE ANALYTICS
  ================================== */

  static async getLoanTypeAnalytics() {

    return prisma.loanApplication.groupBy({

      by: ["loanType"],

      _count: {
        id: true
      },

      _sum: {
        amount: true
      }
    });
  }

  /* ==================================
     USER ROLE ANALYTICS
  ================================== */

  static async getUserRoleAnalytics() {

    return prisma.user.groupBy({

      by: ["role"],

      _count: {
        id: true
      }
    });
  }

  /* ==================================
     MONTHLY LOAN ANALYTICS
  ================================== */

  static async getMonthlyLoanAnalytics() {

    return prisma.loanApplication.findMany({

      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true
      },

      orderBy: {
        createdAt: "asc"
      }
    });
  }

  /* ==================================
     MONTHLY USER ANALYTICS
  ================================== */

  static async getMonthlyUserAnalytics() {

    return prisma.user.findMany({

      select: {
        id: true,
        createdAt: true
      },

      orderBy: {
        createdAt: "asc"
      }
    });
  }

  /* ==================================
     TOP CUSTOMERS
  ================================== */

  static async getTopCustomers() {

    return prisma.user.findMany({

      where: {
        role: "CUSTOMER"
      },

      include: {
        loans: true
      },

      take: 10
    });
  }

  /* ==================================
     RECENT ACTIVITIES
  ================================== */

  static async getRecentActivities() {

    return prisma.loanApplication.findMany({

      take: 20,

      orderBy: {
        createdAt: "desc"
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  /* ==================================
     FULL DASHBOARD ANALYTICS
  ================================== */

  static async getDashboardAnalytics() {

    const [
      overview,
      loanAmount,
      loanStatus,
      loanType,
      userRoles,
      recentActivities
    ] = await Promise.all([

      this.getOverviewAnalytics(),

      this.getLoanAmountAnalytics(),

      this.getLoanStatusAnalytics(),

      this.getLoanTypeAnalytics(),

      this.getUserRoleAnalytics(),

      this.getRecentActivities()
    ]);

    return {
      overview,
      loanAmount,
      loanStatus,
      loanType,
      userRoles,
      recentActivities
    };
  }
}