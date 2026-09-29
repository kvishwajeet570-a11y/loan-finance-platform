"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AuditRepository {
    static async createAuditLog(data) {
        return prisma_1.default.auditLog.create({
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
            prisma_1.default.auditLog.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.auditLog.count(),
        ]);
        return {
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getUserAuditLogs(userId) {
        return prisma_1.default.auditLog.findMany({
            where: {
                performedBy: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getModuleLogs(module) {
        return prisma_1.default.auditLog.findMany({
            where: {
                module,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getActionLogs(action) {
        return prisma_1.default.auditLog.findMany({
            where: {
                action,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async searchAuditLogs(keyword) {
        return prisma_1.default.auditLog.findMany({
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
        const [totalLogs, loginLogs, loanLogs, kycLogs] = await Promise.all([
            prisma_1.default.auditLog.count(),
            prisma_1.default.auditLog.count({
                where: { module: "AUTH" },
            }),
            prisma_1.default.auditLog.count({
                where: { module: "LOAN" },
            }),
            prisma_1.default.auditLog.count({
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
    static async deleteOldLogs(beforeDate) {
        return prisma_1.default.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: beforeDate,
                },
            },
        });
    }
}
exports.AuditRepository = AuditRepository;
