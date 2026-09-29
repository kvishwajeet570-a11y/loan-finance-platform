"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CommissionRepository {
    /* =========================
        CREATE COMMISSION
    ========================= */
    static async createCommission(data) {
        return prisma_1.default.commission.create({
            data: {
                ...data,
                status: "PENDING",
            },
        });
    }
    /* =========================
        GET COMMISSION BY ID
    ========================= */
    static async getCommissionById(commissionId) {
        return prisma_1.default.commission.findUnique({
            where: {
                id: commissionId
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        USER COMMISSIONS
    ========================= */
    static async getUserCommissions(userId) {
        return prisma_1.default.commission.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        PENDING COMMISSIONS
    ========================= */
    static async getPendingCommissions() {
        return prisma_1.default.commission.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        APPROVE COMMISSION
    ========================= */
    static async approveCommission(commissionId, approvedBy) {
        return prisma_1.default.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
            }
        });
    }
    /* =========================
        REJECT COMMISSION
    ========================= */
    static async rejectCommission(commissionId, rejectionReason) {
        return prisma_1.default.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "REJECTED",
                rejectionReason
            }
        });
    }
    /* =========================
        MARK AS PAID
    ========================= */
    static async markCommissionPaid(commissionId) {
        return prisma_1.default.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "PAID",
            }
        });
    }
    /* =========================
        GET ALL COMMISSIONS
    ========================= */
    static async getAllCommissions(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [commissions, total] = await Promise.all([
            prisma_1.default.commission.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.default.commission.count()
        ]);
        return {
            total,
            page,
            limit,
            commissions
        };
    }
    /* =========================
        SEARCH COMMISSIONS
    ========================= */
    static async searchCommissions(keyword) {
        return prisma_1.default.commission.findMany({
            where: {
                OR: [
                    {
                        status: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        source: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
    }
    /* =========================
        COMMISSION ANALYTICS
    ========================= */
    static async getCommissionAnalytics() {
        const [totalCommission, pendingCommission, approvedCommission, paidCommission] = await Promise.all([
            prisma_1.default.commission.aggregate({
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "PENDING"
                },
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "APPROVED"
                },
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    status: "PAID"
                },
                _sum: {
                    commissionAmount: true
                }
            })
        ]);
        return {
            totalCommission: totalCommission._sum.commissionAmount || 0,
            pendingCommission: pendingCommission._sum.commissionAmount || 0,
            approvedCommission: approvedCommission._sum.commissionAmount || 0,
            paidCommission: paidCommission._sum.commissionAmount || 0
        };
    }
    /* =========================
        TOP EARNERS
    ========================= */
    static async getTopEarners() {
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            _sum: {
                commissionAmount: true
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc"
                }
            },
            take: 10
        });
    }
    /* =========================
        MONTHLY COMMISSION
    ========================= */
    static async getMonthlyCommission(startDate, endDate) {
        return prisma_1.default.commission.aggregate({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                commissionAmount: true
            }
        });
    }
}
exports.CommissionRepository = CommissionRepository;
