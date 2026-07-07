"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminRepository = void 0;
const prisma_1 = require("../../prisma");
class SuperAdminRepository {
    /* =========================
        DASHBOARD OVERVIEW
    ========================= */
    static async getDashboardOverview() {
        const [totalUsers, totalLoans, totalPartners, totalDsa, totalRevenue] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.loanApplication.count(),
            prisma_1.prisma.partnerProfile.count(),
            prisma_1.prisma.dsaProfile.count(),
            prisma_1.prisma.payment.aggregate({
                where: {
                    status: "SUCCESS"
                },
                _sum: {
                    amount: true
                }
            })
        ]);
        return {
            totalUsers,
            totalLoans,
            totalPartners,
            totalDsa,
            totalRevenue: totalRevenue._sum.amount || 0
        };
    }
    /* =========================
        CREATE ACTION LOG
    ========================= */
    static async createActionLog(data) {
        return prisma_1.prisma.superAdminAction.create({
            data
        });
    }
    /* =========================
        GET ACTION LOGS
    ========================= */
    static async getActionLogs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return prisma_1.prisma.superAdminAction.findMany({
            skip,
            take: limit,
            include: {
                admin: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        BLOCK USER
    ========================= */
    static async blockUser(userId) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: true
            }
        });
    }
    /* =========================
        UNBLOCK USER
    ========================= */
    static async unblockUser(userId) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: false
            }
        });
    }
    /* =========================
        VERIFY USER
    ========================= */
    static async verifyUser(userId) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isVerified: true
            }
        });
    }
    /* =========================
        CHANGE USER ROLE
    ========================= */
    static async changeUserRole(userId, role) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role
            }
        });
    }
    /* =========================
        SYSTEM USERS
    ========================= */
    static async getAllUsers(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.user.count()
        ]);
        return {
            users,
            total,
            page,
            limit
        };
    }
    /* =========================
        SYSTEM SETTINGS
    ========================= */
    static async getSystemSettings() {
        return prisma_1.prisma.setting.findMany({
            orderBy: {
                category: "asc"
            }
        });
    }
    /* =========================
        UPDATE SETTING
    ========================= */
    static async updateSetting(settingKey, value) {
        return prisma_1.prisma.setting.update({
            where: {
                settingKey
            },
            data: {
                settingValue: value
            }
        });
    }
    /* =========================
        SYSTEM HEALTH
    ========================= */
    static async getSystemHealth() {
        const [users, loans, payments, notifications] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.loanApplication.count(),
            prisma_1.prisma.payment.count(),
            prisma_1.prisma.notification.count()
        ]);
        return {
            users,
            loans,
            payments,
            notifications,
            serverStatus: "HEALTHY"
        };
    }
    /* =========================
        PLATFORM ANALYTICS
    ========================= */
    static async getPlatformAnalytics() {
        const [userCount, loanCount, approvedLoans, disbursedLoans, partnerCount, dsaCount] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.loanApplication.count(),
            prisma_1.prisma.loanApplication.count({
                where: {
                    status: "APPROVED"
                }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    status: "DISBURSED"
                }
            }),
            prisma_1.prisma.partnerProfile.count(),
            prisma_1.prisma.dsaProfile.count()
        ]);
        return {
            userCount,
            loanCount,
            approvedLoans,
            disbursedLoans,
            partnerCount,
            dsaCount
        };
    }
    /* =========================
        RECENT ACTIVITIES
    ========================= */
    static async getRecentActivities() {
        return prisma_1.prisma.superAdminAction.findMany({
            take: 20,
            include: {
                admin: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
}
exports.SuperAdminRepository = SuperAdminRepository;
