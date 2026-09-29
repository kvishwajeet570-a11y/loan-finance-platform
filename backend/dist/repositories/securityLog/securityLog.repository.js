"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityLogRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SecurityLogRepository {
    /* =========================
        CREATE LOG
    ========================= */
    static async createLog(data) {
        return prisma_1.default.securityLog.create({
            data,
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getById(id) {
        return prisma_1.default.securityLog.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* =========================
        USER LOGS
    ========================= */
    static async getUserLogs(userId, page = 1, limit = 20) {
        return prisma_1.default.securityLog.findMany({
            where: {
                userId
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        LOGIN ATTEMPTS
    ========================= */
    static async getLoginAttempts(userId) {
        return prisma_1.default.securityLog.findMany({
            where: {
                userId,
                action: "LOGIN"
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        FAILED LOGINS
    ========================= */
    static async getFailedLogins() {
        return prisma_1.default.securityLog.findMany({
            where: {
                action: "LOGIN",
                status: "FAILED"
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        HIGH RISK EVENTS
    ========================= */
    static async getHighRiskEvents() {
        return prisma_1.default.securityLog.findMany({
            where: {
                severity: "HIGH"
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        CRITICAL EVENTS
    ========================= */
    static async getCriticalEvents() {
        return prisma_1.default.securityLog.findMany({
            where: {
                severity: "CRITICAL"
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET BY EVENT TYPE
    ========================= */
    static async getByEventType(action) {
        return prisma_1.default.securityLog.findMany({
            where: {
                action
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET BY IP
    ========================= */
    static async getByIpAddress(ipAddress) {
        return prisma_1.default.securityLog.findMany({
            where: {
                ipAddress
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        SEARCH LOGS
    ========================= */
    static async searchLogs(keyword) {
        return prisma_1.default.securityLog.findMany({
            where: {
                OR: [
                    {
                        action: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        ipAddress: {
                            contains: keyword
                        }
                    }
                ]
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        DELETE OLD LOGS
    ========================= */
    static async deleteOldLogs(days = 90) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return prisma_1.default.securityLog.deleteMany({
            where: {
                createdAt: {
                    lt: date
                }
            }
        });
    }
    /* =========================
        SECURITY ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalLogs, failedLogins, criticalEvents, highRiskEvents] = await Promise.all([
            prisma_1.default.securityLog.count(),
            prisma_1.default.securityLog.count({
                where: {
                    action: "LOGIN",
                    status: "FAILED"
                }
            }),
            prisma_1.default.securityLog.count({
                where: {
                    severity: "CRITICAL"
                }
            }),
            prisma_1.default.securityLog.count({
                where: {
                    severity: "HIGH"
                }
            })
        ]);
        return {
            totalLogs,
            failedLogins,
            criticalEvents,
            highRiskEvents
        };
    }
    /* =========================
        SECURITY DASHBOARD
    ========================= */
    static async getDashboard() {
        const [analytics, recentEvents] = await Promise.all([
            this.getAnalytics(),
            prisma_1.default.securityLog.findMany({
                take: 20,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        ]);
        return {
            analytics,
            recentEvents
        };
    }
}
exports.SecurityLogRepository = SecurityLogRepository;
