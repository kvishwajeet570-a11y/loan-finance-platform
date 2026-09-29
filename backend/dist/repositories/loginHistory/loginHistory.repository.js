"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistoryRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LoginHistoryRepository {
    /* ==========================================
       CREATE LOGIN RECORD
    ========================================== */
    async create(data) {
        return prisma_1.default.loginHistory.create({
            data: {
                userId: data.userId,
                loginMethod: data.loginMethod,
                ipAddress: data.ipAddress,
                browser: data.browser,
                os: data.os,
                platform: data.platform,
                status: data.status || "SUCCESS",
            },
        });
    }
    /* ==========================================
       GET ALL LOGIN HISTORY
    ========================================== */
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.loginHistory.findMany({
                skip,
                take: limit,
                orderBy: {
                    loginTime: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNo: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma_1.default.loginHistory.count(),
        ]);
        return {
            records,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    /* ==========================================
       USER LOGIN HISTORY
    ========================================== */
    async findByUserId(userId) {
        return prisma_1.default.loginHistory.findMany({
            where: {
                userId,
            },
            orderBy: {
                loginTime: "desc",
            },
        });
    }
    /* ==========================================
       LAST LOGIN
    ========================================== */
    async findLastLogin(userId) {
        return prisma_1.default.loginHistory.findFirst({
            where: {
                userId,
            },
            orderBy: {
                loginTime: "desc",
            },
        });
    }
    /* ==========================================
       ACTIVE SESSIONS
    ========================================== */
    async getActiveSessions() {
        return prisma_1.default.loginHistory.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                loginTime: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    /* ==========================================
       LOGOUT SESSION
    ========================================== */
    async logoutSession(id) {
        return prisma_1.default.loginHistory.update({
            where: {
                id,
            },
            data: {
                logoutTime: new Date(),
                isActive: false,
            },
        });
    }
    /* ==========================================
       ANALYTICS
    ========================================== */
    async getAnalytics() {
        const [totalLogins, successLogins, failedLogins, activeSessions,] = await Promise.all([
            prisma_1.default.loginHistory.count(),
            prisma_1.default.loginHistory.count({
                where: {
                    status: "SUCCESS",
                },
            }),
            prisma_1.default.loginHistory.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma_1.default.loginHistory.count({
                where: {
                    isActive: true,
                },
            }),
        ]);
        return {
            totalLogins,
            successLogins,
            failedLogins,
            activeSessions,
            successRate: totalLogins > 0
                ? Number(((successLogins / totalLogins) *
                    100).toFixed(2))
                : 0,
        };
    }
    /* ==========================================
       DELETE LOGIN HISTORY
    ========================================== */
    async delete(id) {
        return prisma_1.default.loginHistory.delete({
            where: {
                id,
            },
        });
    }
    /* ==========================================
       DELETE OLD HISTORY
    ========================================== */
    async deleteOldHistory(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return prisma_1.default.loginHistory.deleteMany({
            where: {
                loginTime: {
                    lt: date,
                },
            },
        });
    }
}
exports.LoginHistoryRepository = LoginHistoryRepository;
exports.default = new LoginHistoryRepository();
