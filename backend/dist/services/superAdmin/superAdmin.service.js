"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                    role: "admin",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "dsa",
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
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
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
            page,
            pages: Math.ceil(total / limit),
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
                role: "admin",
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
                role: "customer",
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
                    status: "approved",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "rejected",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "pending",
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
        return {
            database: "online",
            api: "online",
            server: "online",
            timestamp: new Date(),
        };
    }
    /**
     * Monthly Business Report
     */
    async monthlyBusiness() {
        const year = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_loans,
      SUM(amount) as total_amount
      FROM "LoanApplication"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
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
            totalCommission: commissions._sum
                .commissionAmount || 0,
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
