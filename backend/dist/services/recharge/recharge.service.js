"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RechargeService {
    async createRecharge(data) {
        return prisma_1.default.recharge.create({
            data: {
                userId: data.userId,
                operator: data.operator,
                mobileNumber: data.number,
                amount: data.amount,
                rechargeType: data.serviceType,
                status: "PENDING",
            },
        });
    }
    async markSuccess(id, operatorTxnId) {
        return prisma_1.default.recharge.update({
            where: {
                id: id,
            },
            data: {
                status: "SUCCESS",
                operatorTxnId,
                completedAt: new Date(),
            },
        });
    }
    async markFailed(id, reason) {
        return prisma_1.default.recharge.update({
            where: {
                id: id,
            },
            data: {
                status: "FAILED",
                failureReason: reason,
            },
        });
    }
    async getRechargeHistory(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [recharges, total] = await Promise.all([
            prisma_1.default.recharge.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.recharge.count({
                where: { userId },
            }),
        ]);
        return {
            recharges,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getRechargeById(rechargeId) {
        return prisma_1.default.recharge.findUnique({
            where: {
                id: rechargeId,
            },
            include: {
                user: true,
            },
        });
    }
    async distributeCommission(id, commissionAmount) {
        const recharge = await prisma_1.default.recharge.findUnique({
            where: {
                id: id,
            },
        });
        if (!recharge) {
            throw new Error("Recharge not found");
        }
        return prisma_1.default.commission.create({
            data: {
                userId: recharge.userId,
                amount: commissionAmount,
                commissionAmount,
                loanAmount: 0,
                source: "RECHARGE",
                status: "APPROVED",
            },
        });
    }
    async todayRechargeReport() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return prisma_1.default.recharge.aggregate({
            where: {
                createdAt: {
                    gte: today,
                },
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
    async monthlyRechargeReport() {
        const year = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_recharges,
      SUM(amount) as total_amount
      FROM "Recharge"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
    }
    async topRechargeUsers() {
        return prisma_1.default.recharge.groupBy({
            by: ["userId"],
            where: {
                status: "SUCCESS",
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
            take: 10,
        });
    }
    async getRechargeStats() {
        const [totalRecharge, successRecharge, failedRecharge, totalBusiness,] = await Promise.all([
            prisma_1.default.recharge.count(),
            prisma_1.default.recharge.count({
                where: {
                    status: "SUCCESS",
                },
            }),
            prisma_1.default.recharge.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma_1.default.recharge.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalRecharge,
            successRecharge,
            failedRecharge,
            totalBusiness: totalBusiness._sum.amount || 0,
        };
    }
}
exports.default = new RechargeService();
