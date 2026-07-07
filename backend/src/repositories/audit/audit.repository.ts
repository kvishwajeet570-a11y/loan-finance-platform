import { prisma } from "../../prisma/prisma";

export class AuditRepository {

  /* ============================
     CREATE AUDIT LOG
  ============================ */

  static async createAuditLog(data: {
    userId?: string;
    action: string;
    module: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {

    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        module: data.module,
        description: data.description,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata
          ? JSON.stringify(data.metadata)
          : null,
      },
    });
  }

  /* ============================
     GET ALL AUDIT LOGS
  ============================ */

  static async getAuditLogs(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [logs, total] =
      await Promise.all([

        prisma.auditLog.findMany({
          skip,
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
                role: true,
              },
            },
          },
        }),

        prisma.auditLog.count(),
      ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  /* ============================
     GET USER AUDIT LOGS
  ============================ */

  static async getUserAuditLogs(
    userId: string
  ) {

    return prisma.auditLog.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ============================
     GET MODULE LOGS
  ============================ */

  static async getModuleLogs(
    module: string
  ) {

    return prisma.auditLog.findMany({

      where: {
        module,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ============================
     GET ACTION LOGS
  ============================ */

  static async getActionLogs(
    action: string
  ) {

    return prisma.auditLog.findMany({

      where: {
        action,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ============================
     SEARCH AUDIT LOGS
  ============================ */

  static async searchAuditLogs(
    keyword: string
  ) {

    return prisma.auditLog.findMany({

      where: {
        OR: [
          {
            action: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            module: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },

      take: 50,
    });
  }

  /* ============================
     AUDIT ANALYTICS
  ============================ */

  static async getAuditStats() {

    const [
      totalLogs,
      loginLogs,
      loanLogs,
      kycLogs,
    ] = await Promise.all([

      prisma.auditLog.count(),

      prisma.auditLog.count({
        where: {
          module: "AUTH",
        },
      }),

      prisma.auditLog.count({
        where: {
          module: "LOAN",
        },
      }),

      prisma.auditLog.count({
        where: {
          module: "KYC",
        },
      }),
    ]);

    return {
      totalLogs,
      loginLogs,
      loanLogs,
      kycLogs,
    };
  }

  /* ============================
     DELETE OLD LOGS
  ============================ */

  static async deleteOldLogs(
    beforeDate: Date
  ) {

    return prisma.auditLog.deleteMany({

      where: {
        createdAt: {
          lt: beforeDate,
        },
      },
    });
  }
}