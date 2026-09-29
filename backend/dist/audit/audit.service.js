"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuditService {
    async logAction(userId, action, entity, entityId, metadata) {
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
exports.AuditService = AuditService;
exports.default = new AuditService();
