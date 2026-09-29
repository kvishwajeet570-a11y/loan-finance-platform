import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

class SuperAdminService {
  /**
   * Global Dashboard
   */
  async getDashboard() {
    const [
      totalUsers,
      totalAdmins,
      totalDSA,
      totalPartners,
      totalLoans,
      totalPayments,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          role: "ADMIN",
        },
      }),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.partner.count(),

      prisma.loanApplication.count(),

      prisma.payment.count(),

      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalAdmins,
      totalDSA,
      totalPartners,
      totalLoans,
      totalPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }

  /**
   * User Management
   */
  async getAllUsers(
    page = 1,
    limit = 20,
    search = ""
  ) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(
      100,
      Math.max(1, Number(limit) || 20)
    );

    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    };
  }

  /**
   * Block User
   */
  async blockUser(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Unblock User
   */
  async unblockUser(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: false,
      },
    });
  }

  /**
   * Promote User To Admin
   */
  async makeAdmin(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "ADMIN",
      },
    });
  }

  /**
   * Remove Admin Access
   */
  async removeAdmin(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "CUSTOMER",
      },
    });
  }

  /**
   * Loan Analytics
   */
  async loanAnalytics() {
    const [
      total,
      approved,
      rejected,
      pending,
      amount,
    ] = await Promise.all([
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      total,
      approved,
      rejected,
      pending,
      totalAmount: amount._sum.amount || 0,
    };
  }

  /**
   * Revenue Analytics
   */
  async revenueAnalytics() {
    return prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },

      _sum: {
        amount: true,
      },

      _count: {
        id: true,
      },
    });
  }

  /**
   * Top DSA
   */
  async topDSA() {
    return prisma.commission.groupBy({
      by: ["userId"],

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: 10,
    });
  }

  /**
   * Top Partners
   */
  async topPartners() {
    return prisma.commission.groupBy({
      by: ["partnerId"],

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: 10,
    });
  }

  /**
   * System Health
   */
  async systemHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        database: "online",
        api: "online",
        server: "online",
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        database: "offline",
        api: "online",
        server: "online",
        timestamp: new Date(),
      };
    }
  }

  /**
   * Monthly Business Report
   */
  async monthlyBusiness() {
    const year = new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        COUNT(*) AS total_loans,
        COALESCE(SUM(amount), 0) AS total_amount
      FROM "LoanApplication"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month ASC
    `;
  }

  /**
   * Platform Statistics
   */
  async platformStats() {
    const [
      users,
      loans,
      partners,
      payments,
      referrals,
      commissions,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.partner.count(),

      prisma.payment.count(),

      prisma.referral.count(),

      prisma.commission.aggregate({
        _sum: {
          commissionAmount: true,
        },
      }),
    ]);

    return {
      users,
      loans,
      partners,
      payments,
      referrals,
      totalCommission:
        commissions._sum.commissionAmount || 0,
    };
  }

  /**
   * Recent Activities
   */
  async recentActivities() {
    return prisma.auditLog.findMany({
      take: 50,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Complete Super Admin Report
   */
  async completeReport() {
    const [
      dashboard,
      loanAnalytics,
      revenue,
      platform,
    ] = await Promise.all([
      this.getDashboard(),
      this.loanAnalytics(),
      this.revenueAnalytics(),
      this.platformStats(),
    ]);

    return {
      dashboard,
      loanAnalytics,
      revenue,
      platform,
    };
  }
}

export default new SuperAdminService();