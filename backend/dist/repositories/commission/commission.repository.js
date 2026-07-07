"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class CommissionRepository {
    /* =========================
        CREATE COMMISSION
    ========================= */
    static async createCommission(data) {
        return prisma_1.prisma.commission.create({
            data
        });
    }
    /* =========================
        GET COMMISSION BY ID
    ========================= */
    static async getCommissionById(commissionId) {
        return prisma_1.prisma.commission.findUnique({
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
        return prisma_1.prisma.commission.findMany({
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
        return prisma_1.prisma.commission.findMany({
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
        return prisma_1.prisma.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "APPROVED",
                approvedBy
            }
        });
    }
    /* =========================
        REJECT COMMISSION
    ========================= */
    static async rejectCommission(commissionId, remarks) {
        return prisma_1.prisma.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "REJECTED",
                remarks
            }
        });
    }
    /* =========================
        MARK AS PAID
    ========================= */
    static async markCommissionPaid(commissionId) {
        return prisma_1.prisma.commission.update({
            where: {
                id: commissionId
            },
            data: {
                status: "PAID",
                paidAt: new Date()
            }
        });
    }
    /* =========================
        GET ALL COMMISSIONS
    ========================= */
    static async getAllCommissions(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [commissions, total] = await Promise.all([
            prisma_1.prisma.commission.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.prisma.commission.count()
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
        return prisma_1.prisma.commission.findMany({
            where: {
                OR: [
                    {
                        commissionType: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        status: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        COMMISSION ANALYTICS
    ========================= */
    static async getCommissionAnalytics() {
        const [totalCommission, pendingCommission, approvedCommission, paidCommission] = await Promise.all([
            prisma_1.prisma.commission.aggregate({
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.prisma.commission.aggregate({
                where: {
                    status: "PENDING"
                },
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.prisma.commission.aggregate({
                where: {
                    status: "APPROVED"
                },
                _sum: {
                    commissionAmount: true
                }
            }),
            prisma_1.prisma.commission.aggregate({
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
        return prisma_1.prisma.commission.groupBy({
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
        return prisma_1.prisma.commission.aggregate({
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
