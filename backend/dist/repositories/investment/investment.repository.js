"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class InvestmentRepository {
    /* ==========================
        CREATE INVESTMENT
    ========================== */
    static async createInvestment(data) {
        return prisma_1.prisma.investment.create({
            data
        });
    }
    /* ==========================
        GET BY ID
    ========================== */
    static async getInvestmentById(investmentId) {
        return prisma_1.prisma.investment.findUnique({
            where: {
                id: investmentId
            },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        USER INVESTMENTS
    ========================== */
    static async getUserInvestments(userId) {
        return prisma_1.prisma.investment.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        INVESTMENT TYPE
    ========================== */
    static async getByType(investmentType) {
        return prisma_1.prisma.investment.findMany({
            where: {
                investmentType
            }
        });
    }
    /* ==========================
        UPDATE INVESTMENT
    ========================== */
    static async updateInvestment(investmentId, data) {
        return prisma_1.prisma.investment.update({
            where: {
                id: investmentId
            },
            data
        });
    }
    /* ==========================
        CLOSE INVESTMENT
    ========================== */
    static async closeInvestment(investmentId) {
        return prisma_1.prisma.investment.update({
            where: {
                id: investmentId
            },
            data: {
                status: "CLOSED"
            }
        });
    }
    /* ==========================
        DELETE INVESTMENT
    ========================== */
    static async deleteInvestment(investmentId) {
        return prisma_1.prisma.investment.delete({
            where: {
                id: investmentId
            }
        });
    }
    /* ==========================
        SEARCH INVESTMENTS
    ========================== */
    static async searchInvestments(keyword) {
        return prisma_1.prisma.investment.findMany({
            where: {
                OR: [
                    {
                        investmentName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        investmentType: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        provider: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* ==========================
        MATURITY DUE
    ========================== */
    static async getMaturityDue(days = 30) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        return prisma_1.prisma.investment.findMany({
            where: {
                maturityDate: {
                    lte: targetDate
                },
                status: "ACTIVE"
            }
        });
    }
    /* ==========================
        PORTFOLIO SUMMARY
    ========================== */
    static async getPortfolioSummary(userId) {
        const [totalInvested, totalCurrent] = await Promise.all([
            prisma_1.prisma.investment.aggregate({
                where: { userId },
                _sum: {
                    investedAmount: true
                }
            }),
            prisma_1.prisma.investment.aggregate({
                where: { userId },
                _sum: {
                    currentValue: true
                }
            })
        ]);
        const invested = totalInvested._sum.investedAmount || 0;
        const current = totalCurrent._sum.currentValue || 0;
        return {
            totalInvested: invested,
            currentValue: current,
            profitLoss: current - invested
        };
    }
    /* ==========================
        TOP INVESTORS
    ========================== */
    static async getTopInvestors() {
        return prisma_1.prisma.investment.groupBy({
            by: ["userId"],
            _sum: {
                investedAmount: true
            },
            orderBy: {
                _sum: {
                    investedAmount: "desc"
                }
            },
            take: 10
        });
    }
    /* ==========================
        ADMIN ALL INVESTMENTS
    ========================== */
    static async getAllInvestments(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [investments, total] = await Promise.all([
            prisma_1.prisma.investment.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.investment.count()
        ]);
        return {
            total,
            page,
            limit,
            investments
        };
    }
    /* ==========================
        INVESTMENT ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalInvestments, activeInvestments, totalInvested, totalCurrent] = await Promise.all([
            prisma_1.prisma.investment.count(),
            prisma_1.prisma.investment.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma_1.prisma.investment.aggregate({
                _sum: {
                    investedAmount: true
                }
            }),
            prisma_1.prisma.investment.aggregate({
                _sum: {
                    currentValue: true
                }
            })
        ]);
        return {
            totalInvestments,
            activeInvestments,
            totalInvested: totalInvested._sum.investedAmount || 0,
            totalCurrentValue: totalCurrent._sum.currentValue || 0
        };
    }
    /* ==========================
        TYPE ANALYTICS
    ========================== */
    static async typeAnalytics() {
        return prisma_1.prisma.investment.groupBy({
            by: ["investmentType"],
            _count: {
                investmentType: true
            },
            _sum: {
                investedAmount: true
            }
        });
    }
}
exports.InvestmentRepository = InvestmentRepository;
