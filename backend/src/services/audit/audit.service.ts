import prisma from "../../prisma/prisma";

interface AuditLogPayload {
  userId?: string;
  adminId?: string;
  action: string;
  module: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
}

class AuditService {
  /**
   * Create Audit Log
   */
  async createLog(payload: AuditLogPayload) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: payload.userId,
          adminId: payload.adminId,
          action: payload.action,
          module: payload.module,
          entityId: payload.entityId,
          oldData: payload.oldData,
          newData: payload.newData,
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
        },
      });
    } catch (error) {
      console.error("Audit Log Error:", error);
      return null;
    }
  }

  /**
   * Get All Logs
   */
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
                mode: "insensitive",
              },
            },
            {
              module: {
                contains: search,
                mode: "insensitive",
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

  /**
   * User Activity
   */
  async getUserLogs(userId: string) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Admin Activity
   */
  async getAdminLogs(adminId: string) {
    return prisma.auditLog.findMany({
      where: { adminId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Delete Old Logs
   */
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

  /**
   * Dashboard Audit Stats
   */
  async getAuditStats() {
    const totalLogs =
      await prisma.auditLog.count();

    const todayLogs =
      await prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().setHours(0, 0, 0, 0)
            ),
          },
        },
      });

    return {
      totalLogs,
      todayLogs,
    };
  }
}

export default new AuditService();