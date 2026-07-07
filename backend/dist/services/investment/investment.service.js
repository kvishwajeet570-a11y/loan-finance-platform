"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class InvestmentService {
    /**
     * Create Investment Product
     */
    async createInvestment(data) {
        return prisma_1.default.investment.create({
            data,
        });
    }
    /**
     * Update Investment
     */
    async updateInvestment(id, data) {
        return prisma_1.default.investment.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete Investment
     */
    async deleteInvestment(id) {
        return prisma_1.default.investment.delete({
            where: { id },
        });
    }
    /**
     * Investment Details
     */
    async getInvestmentById(id) {
        return prisma_1.default.investment.findUnique({
            where: { id },
        });
    }
    /**
     * Investment Listing
     */
    async getInvestments(filters) {
        const { page = 1, limit = 20, search, category, riskLevel, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (riskLevel) {
            where.riskLevel = riskLevel;
        }
        const [investments, total] = await Promise.all([
            prisma_1.default.investment.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.investment.count({
                where,
            }),
        ]);
        return {
            investments,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Invest
     */
    async createInvestmentRequest(userId, investmentId, amount) {
        const investment = await prisma_1.default.investment.findUnique({
            where: {
                id: investmentId,
            },
        });
        if (!investment) {
            throw new Error("Investment product not found");
        }
        if (amount < investment.minimumAmount) {
            throw new Error(`Minimum investment amount is ₹${investment.minimumAmount}`);
        }
        return prisma_1.default.userInvestment.create({
            data: {
                userId,
                investmentId,
                amount,
                status: "PENDING",
            },
        });
    }
    /**
     * Approve Investment
     */
    async approveInvestment(investmentRequestId) {
        return prisma_1.default.userInvestment.update({
            where: {
                id: investmentRequestId,
            },
            data: {
                status: "ACTIVE",
                approvedAt: new Date(),
            },
        });
    }
    /**
     * Close Investment
     */
    async closeInvestment(investmentRequestId) {
        return prisma_1.default.userInvestment.update({
            where: {
                id: investmentRequestId,
            },
            data: {
                status: "CLOSED",
                closedAt: new Date(),
            },
        });
    }
    /**
     * User Investments
     */
    async getUserInvestments(userId) {
        return prisma_1.default.userInvestment.findMany({
            where: {
                userId,
            },
            include: {
                investment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * ROI Calculator
     */
    calculateReturns(principal, annualRate, years) {
        const maturityAmount = principal *
            Math.pow(1 + annualRate / 100, years);
        return {
            investedAmount: principal,
            maturityAmount: Number(maturityAmount.toFixed(2)),
            estimatedProfit: Number((maturityAmount -
                principal).toFixed(2)),
        };
    }
    /**
     * Dashboard Analytics
     */
    async getInvestmentStats() {
        const [totalProducts, totalInvestments, activeInvestments, totalAmount,] = await Promise.all([
            prisma_1.default.investment.count(),
            prisma_1.default.userInvestment.count(),
            prisma_1.default.userInvestment.count({
                where: {
                    status: "ACTIVE",
                },
            }),
            prisma_1.default.userInvestment.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalProducts,
            totalInvestments,
            activeInvestments,
            totalInvestmentAmount: totalAmount._sum.amount || 0,
        };
    }
}
exports.default = new InvestmentService();
