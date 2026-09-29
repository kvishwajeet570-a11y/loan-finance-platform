import prisma from "../../prisma/prisma";

export type AuditSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

interface AuditLogPayload {
  userId?: string;
  role?: string;

  action: string;
  module: string;

  entityId?: string;

  severity?: AuditSeverity;

  oldData?: any;
  newData?: any;

  ipAddress?: string;
  userAgent?: string;

  requestId?: string;

  metadata?: Record<string, any>;
}

class AuditService {
  async createLog(payload: AuditLogPayload) {
    try {
      return await prisma.auditLog.create({
        data: {
          action: payload.action,
          module: payload.module,
          entityId: payload.entityId,
          performedBy: payload.userId,
          role: payload.role,
          severity: payload.severity ?? "INFO",
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
          requestId: payload.requestId,
          oldData: payload.oldData,
          newData: payload.newData,
          metadata: payload.metadata,
        },
      });
    } catch (error) {
      console.error("Audit Create Error:", error);
      return null;
    }
  }

  async getLogs(
    page = 1,
    limit = 20,
    search = ""
  ) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              action: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              module: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              performedBy: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.auditLog.count({
        where,
      }),
    ]);

    return {
      logs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserLogs(userId: string) {
    return prisma.auditLog.findMany({
      where: {
        performedBy: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAdminLogs(adminId: string) {
    return prisma.auditLog.findMany({
      where: {
        performedBy: adminId,
        role: "ADMIN",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getByModule(module: string) {
    return prisma.auditLog.findMany({
      where: {
        module,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getByAction(action: string) {
    return prisma.auditLog.findMany({
      where: {
        action,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBySeverity(severity: AuditSeverity) {
    return prisma.auditLog.findMany({
      where: {
        severity,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAuditAnalytics() {
    const [totalLogs, todayLogs, errorLogs, criticalLogs] =
      await Promise.all([
        prisma.auditLog.count(),

        prisma.auditLog.count({
          where: {
            createdAt: {
              gte: new Date(
                new Date().setHours(0, 0, 0, 0)
              ),
            },
          },
        }),

        prisma.auditLog.count({
          where: {
            severity: "ERROR",
          },
        }),

        prisma.auditLog.count({
          where: {
            severity: "CRITICAL",
          },
        }),
      ]);

    return {
      totalLogs,
      todayLogs,
      errorLogs,
      criticalLogs,
    };
  }

  async getAuditStats() {
    return this.getAuditAnalytics();
  }

  async deleteOldLogs(days = 90) {
    const date = new Date();

    date.setDate(date.getDate() - days);

    return prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });
  }
}

export default new AuditService();

