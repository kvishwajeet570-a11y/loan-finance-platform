"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RechargeRepository = void 0;
const prisma_1 = require("../../prisma");
class RechargeRepository {
    static async createRecharge(data) {
        return prisma_1.prisma.recharge.create({
            data
        });
    }
    static async getById(id) {
        return prisma_1.prisma.recharge.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    static async getByTransactionId(transactionId) {
        return prisma_1.prisma.recharge.findUnique({
            where: {
                transactionId
            }
        });
    }
    static async getUserRecharges(userId) {
        return prisma_1.prisma.recharge.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    static async markSuccess(id, transactionId, commissionAmount = 0) {
        return prisma_1.prisma.recharge.update({
            where: {
                id
            },
            data: {
                status: "SUCCESS",
                transactionId,
                commissionAmount
            }
        });
    }
    static async markFailed(id, remarks) {
        return prisma_1.prisma.recharge.update({
            where: {
                id
            },
            data: {
                status: "FAILED",
                remarks
            }
        });
    }
    static async markPending(id) {
        return prisma_1.prisma.recharge.update({
            where: {
                id
            },
            data: {
                status: "PENDING"
            }
        });
    }
    static async processRefund(id) {
        return prisma_1.prisma.recharge.update({
            where: {
                id
            },
            data: {
                refunded: true,
                refundedAt: new Date(),
                status: "REFUNDED"
            }
        });
    }
    static async searchRecharges(keyword) {
        return prisma_1.prisma.recharge.findMany({
            where: {
                OR: [
                    {
                        rechargeNumber: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        operatorName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        transactionId: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                user: true
            }
        });
    }
    static async getByStatus(status) {
        return prisma_1.prisma.recharge.findMany({
            where: {
                status
            },
            include: {
                user: true
            }
        });
    }
    static async getByType(rechargeType) {
        return prisma_1.prisma.recharge.findMany({
            where: {
                rechargeType
            },
            include: {
                user: true
            }
        });
    }
    static async getAllRecharges(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [recharges, total] = await Promise.all([
            prisma_1.prisma.recharge.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.recharge.count()
        ]);
        return {
            recharges,
            total,
            page,
            limit
        };
    }
    static async getAnalytics() {
        const [totalRecharges, successRecharges, failedRecharges, pendingRecharges, totalAmount, totalCommission] = await Promise.all([
            prisma_1.prisma.recharge.count(),
            prisma_1.prisma.recharge.count({
                where: {
                    status: "SUCCESS"
                }
            }),
            prisma_1.prisma.recharge.count({
                where: {
                    status: "FAILED"
                }
            }),
            prisma_1.prisma.recharge.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.recharge.aggregate({
                _sum: {
                    amount: true
                }
            }),
            prisma_1.prisma.recharge.aggregate({
                _sum: {
                    commissionAmount: true
                }
            })
        ]);
        return {
            totalRecharges,
            successRecharges,
            failedRecharges,
            pendingRecharges,
            totalAmount: totalAmount._sum.amount || 0,
            totalCommission: totalCommission._sum.commissionAmount || 0
        };
    }
    static async getOperatorAnalytics() {
        return prisma_1.prisma.recharge.groupBy({
            by: ["operatorName"],
            _count: true,
            _sum: {
                amount: true,
                commissionAmount: true
            }
        });
    }
}
exports.RechargeRepository = RechargeRepository;
