import { prisma } from "../../prisma";

export class SuperAdminRepository {

  /* =========================
      DASHBOARD OVERVIEW
  ========================= */

  static async getDashboardOverview() {

    const [
      totalUsers,
      totalLoans,
      totalPartners,
      totalDsa,
      totalRevenue
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.partnerProfile.count(),

      prisma.dsaProfile.count(),

      prisma.payment.aggregate({
        where: {
          status: "SUCCESS"
        },
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      totalUsers,
      totalLoans,
      totalPartners,
      totalDsa,
      totalRevenue:
        totalRevenue._sum.amount || 0
    };
  }

  /* =========================
      CREATE ACTION LOG
  ========================= */

  static async createActionLog(data: {
    adminId: string;
    actionType: string;
    module: string;
    targetId?: string;
    description?: string;
    metadata?: any;
    ipAddress?: string;
  }) {

    return prisma.superAdminAction.create({
      data
    });
  }

  /* =========================
      GET ACTION LOGS
  ========================= */

  static async getActionLogs(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    return prisma.superAdminAction.findMany({

      skip,
      take: limit,

      include: {
        admin: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      BLOCK USER
  ========================= */

  static async blockUser(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        isBlocked: true
      }
    });
  }

  /* =========================
      UNBLOCK USER
  ========================= */

  static async unblockUser(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        isBlocked: false
      }
    });
  }

  /* =========================
      VERIFY USER
  ========================= */

  static async verifyUser(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        isVerified: true
      }
    });
  }

  /* =========================
      CHANGE USER ROLE
  ========================= */

  static async changeUserRole(
    userId: string,
    role: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        role
      }
    });
  }

  /* =========================
      SYSTEM USERS
  ========================= */

  static async getAllUsers(
    page = 1,
    limit = 50
  ) {

    const skip =
      (page - 1) * limit;

    const [users, total] =
      await Promise.all([

        prisma.user.findMany({

          skip,
          take: limit,

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.user.count()
      ]);

    return {
      users,
      total,
      page,
      limit
    };
  }

  /* =========================
      SYSTEM SETTINGS
  ========================= */

  static async getSystemSettings() {

    return prisma.setting.findMany({
      orderBy: {
        category: "asc"
      }
    });
  }

  /* =========================
      UPDATE SETTING
  ========================= */

  static async updateSetting(
    settingKey: string,
    value: any
  ) {

    return prisma.setting.update({

      where: {
        settingKey
      },

      data: {
        settingValue: value
      }
    });
  }

  /* =========================
      SYSTEM HEALTH
  ========================= */

  static async getSystemHealth() {

    const [
      users,
      loans,
      payments,
      notifications
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.payment.count(),

      prisma.notification.count()
    ]);

    return {
      users,
      loans,
      payments,
      notifications,
      serverStatus: "HEALTHY"
    };
  }

  /* =========================
      PLATFORM ANALYTICS
  ========================= */

  static async getPlatformAnalytics() {

    const [
      userCount,
      loanCount,
      approvedLoans,
      disbursedLoans,
      partnerCount,
      dsaCount
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED"
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: "DISBURSED"
        }
      }),

      prisma.partnerProfile.count(),

      prisma.dsaProfile.count()
    ]);

    return {
      userCount,
      loanCount,
      approvedLoans,
      disbursedLoans,
      partnerCount,
      dsaCount
    };
  }

  /* =========================
      RECENT ACTIVITIES
  ========================= */

  static async getRecentActivities() {

    return prisma.superAdminAction.findMany({

      take: 20,

      include: {
        admin: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }
}