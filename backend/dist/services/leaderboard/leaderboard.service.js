"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LeaderboardService {
    /**
     * Top DSA By Commission
     */
    async getTopDSAByCommission(limit = 10) {
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            _sum: {
                commissionAmount: true,
            },
            _count: {
                id: true,
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
     * Top Loan Closers
     */
    async getTopLoanClosers(limit = 10) {
        return prisma_1.default.loanApplication.groupBy({
            by: ["assignedTo"],
            where: {
                status: "approved",
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit,
        });
    }
    /**
     * Top Referral Earners
     */
    async getTopReferralEarners(limit = 10) {
        return prisma_1.default.referral.groupBy({
            by: ["referrerId"],
            _sum: {
                rewardAmount: true,
            },
            orderBy: {
                _sum: {
                    rewardAmount: "desc",
                },
            },
            take: limit,
        });
    }
    /**
     * Top Insurance Sellers
     */
    async getTopInsuranceAgents(limit = 10) {
        return prisma_1.default.insuranceApplication.groupBy({
            by: ["agentId"],
            where: {
                status: "APPROVED",
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit,
        });
    }
    /**
     * Top Investors
     */
    async getTopInvestors(limit = 10) {
        return prisma_1.default.userInvestment.groupBy({
            by: ["userId"],
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
            take: limit,
        });
    }
    /**
     * Monthly Leaderboard
     */
    async getMonthlyLeaderboard() {
        const startDate = new Date();
        startDate.setDate(1);
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            where: {
                status: "APPROVED",
                createdAt: {
                    gte: startDate,
                },
            },
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 20,
        });
    }
    /**
     * Weekly Leaderboard
     */
    async getWeeklyLeaderboard() {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            where: {
                status: "APPROVED",
                createdAt: {
                    gte: date,
                },
            },
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 20,
        });
    }
    /**
     * Today's Leaderboard
     */
    async getTodayLeaderboard() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            where: {
                status: "APPROVED",
                createdAt: {
                    gte: start,
                },
            },
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 20,
        });
    }
    /**
     * User Ranking
     */
    async getUserRank(userId) {
        const leaderboard = await prisma_1.default.commission.groupBy({
            by: ["userId"],
            where: {
                status: "APPROVED",
            },
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
        });
        const rank = leaderboard.findIndex((item) => item.userId === userId) + 1;
        return {
            rank,
            totalParticipants: leaderboard.length,
        };
    }
    /**
     * Dashboard Statistics
     */
    async getLeaderboardStats() {
        const [totalDSA, totalCommission, totalReferrals, totalInvestments,] = await Promise.all([
            prisma_1.default.user.count({
                where: {
                    role: "dsa",
                },
            }),
            prisma_1.default.commission.aggregate({
                _sum: {
                    commissionAmount: true,
                },
            }),
            prisma_1.default.referral.count(),
            prisma_1.default.userInvestment.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalDSA,
            totalCommission: totalCommission._sum
                .commissionAmount || 0,
            totalReferrals,
            totalInvestment: totalInvestments._sum
                .amount || 0,
        };
    }
    /**
     * Complete Leaderboard
     */
    async getCompleteLeaderboard() {
        const [topDSA, topReferral, topInvestors, monthly,] = await Promise.all([
            this.getTopDSAByCommission(),
            this.getTopReferralEarners(),
            this.getTopInvestors(),
            this.getMonthlyLeaderboard(),
        ]);
        return {
            topDSA,
            topReferral,
            topInvestors,
            monthly,
        };
    }
}
exports.default = new LeaderboardService();
