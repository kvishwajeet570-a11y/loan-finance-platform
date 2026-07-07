import prisma from "../../prisma/prisma";

export class AuditService {
  async logAction(
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    metadata?: any
  ) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata,
        createdAt: new Date(),
      },
    });
  }

  async getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    return prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new AuditService();