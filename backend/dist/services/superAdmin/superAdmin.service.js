"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SuperAdminService {
    /**
     * Global Dashboard
     */
    async getDashboard() {
        const [totalUsers, totalAdmins, totalDSA, totalPartners, totalLoans, totalPayments, totalRevenue,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({
                where: {
                    role: "ADMIN",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.payment.count(),
            prisma_1.default.payment.aggregate({
                where: {
                    status: "SUCCESS",
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalUsers,
            totalAdmins,
            totalDSA,
            totalPartners,
            totalLoans,
            totalPayments,
            totalRevenue: totalRevenue._sum.amount || 0,
        };
    }
    /**
     * User Management
     */
    async getAllUsers(page = 1, limit = 20, search = "") {
        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
        const skip = (safePage - 1) * safeLimit;
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: safeLimit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return {
            users,
            total,
            page: safePage,
            limit: safeLimit,
            pages: Math.ceil(total / safeLimit),
        };
    }
    /**
     * Block User
     */
    async blockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    /**
     * Unblock User
     */
    async unblockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    /**
     * Promote User To Admin
     */
    async makeAdmin(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                role: "ADMIN",
            },
        });
    }
    /**
     * Remove Admin Access
     */
    async removeAdmin(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                role: "CUSTOMER",
            },
        });
    }
    /**
     * Loan Analytics
     */
    async loanAnalytics() {
        const [total, approved, rejected, pending, amount,] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.loanApplication.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            total,
            approved,
            rejected,
            pending,
            totalAmount: amount._sum.amount || 0,
        };
    }
    /**
     * Revenue Analytics
     */
    async revenueAnalytics() {
        return prisma_1.default.payment.aggregate({
            where: {
                status: "SUCCESS",
            },
            _sum: {
                amount: true,
            },
            _count: {
                id: true,
            },
        });
    }
    /**
     * Top DSA
     */
    async topDSA() {
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 10,
        });
    }
    /**
     * Top Partners
     */
    async topPartners() {
        return prisma_1.default.commission.groupBy({
            by: ["partnerId"],
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 10,
        });
    }
    /**
     * System Health
     */
    async systemHealth() {
        try {
            await prisma_1.default.$queryRaw `SELECT 1`;
            return {
                database: "online",
                api: "online",
                server: "online",
                timestamp: new Date(),
            };
        }
        catch (error) {
            return {
                database: "offline",
                api: "online",
                server: "online",
                timestamp: new Date(),
            };
        }
    }
    /**
     * Monthly Business Report
     */
    async monthlyBusiness() {
        const year = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        COUNT(*) AS total_loans,
        COALESCE(SUM(amount), 0) AS total_amount
      FROM "LoanApplication"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month ASC
    `;
    }
    /**
     * Platform Statistics
     */
    async platformStats() {
        const [users, loans, partners, payments, referrals, commissions,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.partner.count(),
            prisma_1.default.payment.count(),
            prisma_1.default.referral.count(),
            prisma_1.default.commission.aggregate({
                _sum: {
                    commissionAmount: true,
                },
            }),
        ]);
        return {
            users,
            loans,
            partners,
            payments,
            referrals,
            totalCommission: commissions._sum.commissionAmount || 0,
        };
    }
    /**
     * Recent Activities
     */
    async recentActivities() {
        return prisma_1.default.auditLog.findMany({
            take: 50,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Complete Super Admin Report
     */
    async completeReport() {
        const [dashboard, loanAnalytics, revenue, platform,] = await Promise.all([
            this.getDashboard(),
            this.loanAnalytics(),
            this.revenueAnalytics(),
            this.platformStats(),
        ]);
        return {
            dashboard,
            loanAnalytics,
            revenue,
            platform,
        };
    }
}
exports.default = new SuperAdminService();
