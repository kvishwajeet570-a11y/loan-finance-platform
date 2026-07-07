"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AuditService {
    /**
     * Create Audit Log
     */
    async createLog(payload) {
        try {
            return await prisma_1.default.auditLog.create({
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
        }
        catch (error) {
            console.error("Audit Log Error:", error);
            return null;
        }
    }
    /**
     * Get All Logs
     */
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
    /**
     * User Activity
     */
    async getUserLogs(userId) {
        return prisma_1.default.auditLog.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Admin Activity
     */
    async getAdminLogs(adminId) {
        return prisma_1.default.auditLog.findMany({
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
        return prisma_1.default.auditLog.deleteMany({
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
        const totalLogs = await prisma_1.default.auditLog.count();
        const todayLogs = await prisma_1.default.auditLog.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
        return {
            totalLogs,
            todayLogs,
        };
    }
}
exports.default = new AuditService();
