"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AuditService {
    async createLog(payload) {
        try {
            return await prisma_1.default.auditLog.create({
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
        }
        catch (error) {
            console.error("Audit Create Error:", error);
            return null;
        }
    }
    async getLogs(page = 1, limit = 20, search = "") {
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
                    {
                        performedBy: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.auditLog.count({
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
    async getUserLogs(userId) {
        return prisma_1.default.auditLog.findMany({
            where: {
                performedBy: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getAdminLogs(adminId) {
        return prisma_1.default.auditLog.findMany({
            where: {
                performedBy: adminId,
                role: "ADMIN",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getByModule(module) {
        return prisma_1.default.auditLog.findMany({
            where: {
                module,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getByAction(action) {
        return prisma_1.default.auditLog.findMany({
            where: {
                action,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getBySeverity(severity) {
        return prisma_1.default.auditLog.findMany({
            where: {
                severity,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getAuditAnalytics() {
        const [totalLogs, todayLogs, errorLogs, criticalLogs] = await Promise.all([
            prisma_1.default.auditLog.count(),
            prisma_1.default.auditLog.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma_1.default.auditLog.count({
                where: {
                    severity: "ERROR",
                },
            }),
            prisma_1.default.auditLog.count({
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
        return prisma_1.default.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: date,
                },
            },
        });
    }
}
exports.default = new AuditService();
