import prisma from "../../prisma/prisma";

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
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.partner.count(),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

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
      totalLoans,
      totalPartners,
      totalDsa,
      totalRevenue: totalRevenue._sum.amount || 0,
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
  role?: string;
  userAgent?: string;
  requestId?: string;
}) {
  return prisma.auditLog.create({
    data: {
      action: data.actionType,
      module: data.module,

      performedBy: data.adminId,

      entityId: data.targetId ?? null,

      ipAddress: data.ipAddress ?? null,

      role: data.role ?? null,

      userAgent: data.userAgent ?? null,

      requestId: data.requestId ?? null,

      metadata: {
        ...(data.metadata ?? {}),
        ...(data.description
          ? { description: data.description }
          : {}),
      },
    },
  });
}

  /* =========================
      GET ACTION LOGS
  ========================= */

  static async getActionLogs(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    return prisma.auditLog.findMany({
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
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
        id: userId,
      },

      data: {
        isBlocked: true,
      },
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
        id: userId,
      },

      data: {
        isBlocked: false,
      },
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
        id: userId,
      },

      data: {
        isVerified: true,
      },
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
        id: userId,
      },

      data: {
        role,
      },
    });
  }

  /* =========================
      SYSTEM USERS
  ========================= */

  static async getAllUsers(
    page = 1,
    limit = 50
  ) {
    const skip = (page - 1) * limit;

    const [users, total] =
      await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.user.count(),
      ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  /* =========================
      SYSTEM SETTINGS
  ========================= */

  static async getSystemSettings() {
    return prisma.setting.findMany({
      orderBy: {
        category: "asc",
      },
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
        key: settingKey,
      },

      data: {
        value,
      },
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
      notifications,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.payment.count(),

      prisma.notification.count(),
    ]);

    return {
      users,
      loans,
      payments,
      notifications,
      serverStatus: "HEALTHY",
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
      partnerCount,
      dsaCount,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.partner.count(),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),
    ]);

    /*
      Current LoanStatus enum contains:
      PENDING
      APPROVED
      REJECTED

      Therefore DISBURSED cannot be queried
      until it is added to the Prisma enum.
    */

    const disbursedLoans = 0;

    return {
      userCount,
      loanCount,
      approvedLoans,
      disbursedLoans,
      partnerCount,
      dsaCount,
    };
  }

  /* =========================
      RECENT ACTIVITIES
  ========================= */

  static async getRecentActivities() {
    return prisma.auditLog.findMany({
      take: 20,

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}