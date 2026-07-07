"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AuditService {
    async logAction(userId, action, entity, entityId, metadata) {
        return prisma_1.default.auditLog.create({
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
        return prisma_1.default.auditLog.findMany({
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
