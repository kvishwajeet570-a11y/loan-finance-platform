import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

export class SecurityLogRepository {

  /* =========================
      CREATE LOG
  ========================= */

  static async createLog(data: {
  userId: string;
  action: string;
  severity?: string;
  status?: string;
  ipAddress?: string;
  deviceInfo?: string;
  userAgent?: string;
  module?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.securityLog.create({
    data,
  });
}

  /* =========================
      GET BY ID
  ========================= */

  static async getById(
    id: string
  ) {

    return prisma.securityLog.findUnique({

      where: { id },

      include: {
        user: true
      }
    });
  }

  /* =========================
      USER LOGS
  ========================= */

  static async getUserLogs(
    userId: string,
    page = 1,
    limit = 20
  ) {

    return prisma.securityLog.findMany({

      where: {
        userId
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      LOGIN ATTEMPTS
  ========================= */

  static async getLoginAttempts(
    userId: string
  ) {

    return prisma.securityLog.findMany({

      where: {
        userId,
        action: "LOGIN"
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      FAILED LOGINS
  ========================= */

  static async getFailedLogins() {

    return prisma.securityLog.findMany({

      where: {
        action: "LOGIN",
        status: "FAILED"
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      HIGH RISK EVENTS
  ========================= */

  static async getHighRiskEvents() {

    return prisma.securityLog.findMany({

      where: {
        severity: "HIGH"
      },

      include: {
        user: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      CRITICAL EVENTS
  ========================= */

  static async getCriticalEvents() {

    return prisma.securityLog.findMany({

      where: {
        severity: "CRITICAL"
      },

      include: {
        user: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      GET BY EVENT TYPE
  ========================= */

  static async getByEventType(
    action: string
  ) {

    return prisma.securityLog.findMany({

      where: {
        action
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      GET BY IP
  ========================= */

  static async getByIpAddress(
    ipAddress: string
  ) {

    return prisma.securityLog.findMany({

      where: {
        ipAddress
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      SEARCH LOGS
  ========================= */

  static async searchLogs(
    keyword: string
  ) {

    return prisma.securityLog.findMany({

      where: {

        OR: [

          {
            action: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            description: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            ipAddress: {
              contains: keyword
            }
          }
        ]
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      DELETE OLD LOGS
  ========================= */

  static async deleteOldLogs(
    days = 90
  ) {

    const date = new Date();

    date.setDate(
      date.getDate() - days
    );

    return prisma.securityLog.deleteMany({

      where: {
        createdAt: {
          lt: date
        }
      }
    });
  }

  /* =========================
      SECURITY ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalLogs,
      failedLogins,
      criticalEvents,
      highRiskEvents
    ] = await Promise.all([

      prisma.securityLog.count(),

      prisma.securityLog.count({

        where: {
          action: "LOGIN",
          status: "FAILED"
        }
      }),

      prisma.securityLog.count({

        where: {
          severity: "CRITICAL"
        }
      }),

      prisma.securityLog.count({

        where: {
          severity: "HIGH"
        }
      })
    ]);

    return {
      totalLogs,
      failedLogins,
      criticalEvents,
      highRiskEvents
    };
  }

  /* =========================
      SECURITY DASHBOARD
  ========================= */

  static async getDashboard() {

    const [
      analytics,
      recentEvents
    ] = await Promise.all([

      this.getAnalytics(),

      prisma.securityLog.findMany({

        take: 20,

        include: {
          user: true
        },

        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return {
      analytics,
      recentEvents
    };
  }
}