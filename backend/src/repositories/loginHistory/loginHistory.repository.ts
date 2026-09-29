import prisma from "../../prisma/prisma";

export class LoginHistoryRepository {
  /* ==========================================
     CREATE LOGIN RECORD
  ========================================== */

  async create(data: {
    userId: string;
    loginMethod: string;
    ipAddress: string;
    browser?: string;
    os?: string;
    platform?: string;
    status?: string;
  }) {
    return prisma.loginHistory.create({
      data: {
        userId: data.userId,
        loginMethod: data.loginMethod,
        ipAddress: data.ipAddress,
        browser: data.browser,
        os: data.os,
        platform: data.platform,
        status: data.status || "SUCCESS",
      },
    });
  }

  /* ==========================================
     GET ALL LOGIN HISTORY
  ========================================== */

  async findAll(
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.loginHistory.findMany({
        skip,
        take: limit,

        orderBy: {
          loginTime: "desc",
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNo: true,
              role: true,
            },
          },
        },
      }),

      prisma.loginHistory.count(),
    ]);

    return {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /* ==========================================
     USER LOGIN HISTORY
  ========================================== */

  async findByUserId(userId: string) {
    return prisma.loginHistory.findMany({
      where: {
        userId,
      },

      orderBy: {
        loginTime: "desc",
      },
    });
  }

  /* ==========================================
     LAST LOGIN
  ========================================== */

  async findLastLogin(userId: string) {
    return prisma.loginHistory.findFirst({
      where: {
        userId,
      },

      orderBy: {
        loginTime: "desc",
      },
    });
  }

  /* ==========================================
     ACTIVE SESSIONS
  ========================================== */

  async getActiveSessions() {
    return prisma.loginHistory.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        loginTime: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /* ==========================================
     LOGOUT SESSION
  ========================================== */

  async logoutSession(id: string) {
    return prisma.loginHistory.update({
      where: {
        id,
      },

      data: {
        logoutTime: new Date(),
        isActive: false,
      },
    });
  }

  /* ==========================================
     ANALYTICS
  ========================================== */

  async getAnalytics() {
    const [
      totalLogins,
      successLogins,
      failedLogins,
      activeSessions,
    ] = await Promise.all([
      prisma.loginHistory.count(),

      prisma.loginHistory.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.loginHistory.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.loginHistory.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return {
      totalLogins,
      successLogins,
      failedLogins,
      activeSessions,

      successRate:
        totalLogins > 0
          ? Number(
              (
                (successLogins / totalLogins) *
                100
              ).toFixed(2)
            )
          : 0,
    };
  }

  /* ==========================================
     DELETE LOGIN HISTORY
  ========================================== */

  async delete(id: string) {
    return prisma.loginHistory.delete({
      where: {
        id,
      },
    });
  }

  /* ==========================================
     DELETE OLD HISTORY
  ========================================== */

  async deleteOldHistory(days: number) {
    const date = new Date();

    date.setDate(date.getDate() - days);

    return prisma.loginHistory.deleteMany({
      where: {
        loginTime: {
          lt: date,
        },
      },
    });
  }
}

export default new LoginHistoryRepository();