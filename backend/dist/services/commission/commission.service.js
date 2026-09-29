"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CommissionService {
    /**
     * Create Commission Entry
     */
    async createCommission(userId, loanId, loanAmount, percentage) {
        const commissionAmount = (loanAmount * percentage) / 100;
        return prisma_1.default.commission.create({
            data: {
                userId,
                loanId,
                loanAmount,
                amount: commissionAmount,
                commissionAmount,
                status: "PENDING",
            },
        });
    }
    /**
     * Approve Commission
     */
    async approveCommission(id) {
        return prisma_1.default.$transaction(async (tx) => {
            const commission = await tx.commission.update({
                where: { id },
                data: {
                    status: "APPROVED",
                    approvedAt: new Date(),
                },
            });
            try {
                await tx.wallet.update({
                    where: {
                        userId: commission.userId,
                    },
                    data: {
                        balance: {
                            increment: commission.commissionAmount,
                        },
                    },
                });
            }
            catch {
                // wallet not found
            }
            await tx.transaction.create({
                data: {
                    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                    userId: commission.userId,
                    amount: commission.commissionAmount,
                    type: "COMMISSION_CREDIT",
                    category: "COMMISSION",
                    status: "SUCCESS",
                    remark: "Commission Credit",
                },
            });
            return commission;
        });
    }
    /**
     * Reject Commission
     */
    async rejectCommission(id, reason) {
        return prisma_1.default.commission.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * Get Commission By ID
     */
    async getCommissionById(id) {
        return prisma_1.default.commission.findUnique({
            where: { id },
            include: {
                user: true,
                partner: true,
                loan: true,
            },
        });
    }
    /**
     * Commission List
     */
    async getCommissions(filters) {
        const { page = 1, limit = 20, status, userId, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userId) {
            where.userId = userId;
        }
        const [commissions, total] = await Promise.all([
            prisma_1.default.commission.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: true,
                    partner: true,
                    loan: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.commission.count({
                where,
            }),
        ]);
        return {
            commissions,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * User Earnings
     */
    async getUserEarnings(userId) {
        const result = await prisma_1.default.commission.aggregate({
            where: {
                userId,
                status: "APPROVED",
            },
            _sum: {
                commissionAmount: true,
            },
        });
        return {
            totalEarnings: result._sum.commissionAmount || 0,
        };
    }
    /**
     * Monthly Earnings Report
     */
    async getMonthlyCommissionReport() {
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        return prisma_1.default.commission.aggregate({
            where: {
                createdAt: {
                    gte: startDate,
                },
                status: "APPROVED",
            },
            _sum: {
                commissionAmount: true,
            },
            _count: true,
        });
    }
    /**
     * Top Partners
     */
    async getTopPartners(limit = 10) {
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
            take: limit,
        });
    }
    /**
     * Dashboard Stats
     */
    async getCommissionStats() {
        const [totalCommission, pendingCommission, approvedCommission, rejectedCommission,] = await Promise.all([
            prisma_1.default.commission.aggregate({
                _sum: {
                    commissionAmount: true,
                },
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "PENDING",
                },
                _sum: {
                    commissionAmount: true,
                },
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "APPROVED",
                },
                _sum: {
                    commissionAmount: true,
                },
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "REJECTED",
                },
                _sum: {
                    commissionAmount: true,
                },
            }),
        ]);
        return {
            totalCommission: totalCommission._sum
                .commissionAmount || 0,
            pendingCommission: pendingCommission._sum
                .commissionAmount || 0,
            approvedCommission: approvedCommission._sum
                .commissionAmount || 0,
            rejectedCommission: rejectedCommission._sum
                .commissionAmount || 0,
        };
    }
}
exports.default = new CommissionService();
