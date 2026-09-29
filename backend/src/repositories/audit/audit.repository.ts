import prisma from "../../prisma/prisma";

export class AuditRepository {
  static async createAuditLog(data: {
    userId?: string;
    action: string;
    module: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
    severity?: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
    role?: string;
    entityId?: string;
    requestId?: string;
    oldData?: any;
    newData?: any;
  }) {
    return prisma.auditLog.create({
      data: {
        performedBy: data.userId,
        action: data.action,
        module: data.module,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
        severity: data.severity ?? "INFO",
        role: data.role,
        entityId: data.entityId,
        requestId: data.requestId,
        oldData: data.oldData,
        newData: data.newData,
      },
    });
  }

  static async getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.auditLog.count(),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserAuditLogs(userId: string) {
    return prisma.auditLog.findMany({
      where: {
        performedBy: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getModuleLogs(module: string) {
    return prisma.auditLog.findMany({
      where: {
        module,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getActionLogs(action: string) {
    return prisma.auditLog.findMany({
      where: {
        action,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async searchAuditLogs(keyword: string) {
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
            performedBy: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAuditStats() {
    const [totalLogs, loginLogs, loanLogs, kycLogs] =
      await Promise.all([
        prisma.auditLog.count(),
        prisma.auditLog.count({
          where: { module: "AUTH" },
        }),
        prisma.auditLog.count({
          where: { module: "LOAN" },
        }),
        prisma.auditLog.count({
          where: { module: "KYC" },
        }),
      ]);

    return {
      totalLogs,
      loginLogs,
      loanLogs,
      kycLogs,
    };
  }

  static async deleteOldLogs(beforeDate: Date) {
    return prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: beforeDate,
        },
      },
    });
  }
}