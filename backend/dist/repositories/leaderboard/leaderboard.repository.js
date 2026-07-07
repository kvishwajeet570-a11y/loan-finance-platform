"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class LeaderboardRepository {
    /* ==========================
        CREATE ENTRY
    ========================== */
    static async createEntry(data) {
        return prisma_1.prisma.leaderboard.create({
            data
        });
    }
    /* ==========================
        GET ENTRY BY ID
    ========================== */
    static async getById(id) {
        return prisma_1.prisma.leaderboard.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        USER RANKINGS
    ========================== */
    static async getUserRankings(userId) {
        return prisma_1.prisma.leaderboard.findMany({
            where: {
                userId
            },
            orderBy: {
                score: "desc"
            }
        });
    }
    /* ==========================
        TOP DSA
    ========================== */
    static async getTopDsa(limit = 10) {
        return prisma_1.prisma.leaderboard.findMany({
            where: {
                leaderboardType: "DSA"
            },
            orderBy: {
                score: "desc"
            },
            take: limit,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        TOP PARTNERS
    ========================== */
    static async getTopPartners(limit = 10) {
        return prisma_1.prisma.leaderboard.findMany({
            where: {
                leaderboardType: "PARTNER"
            },
            orderBy: {
                score: "desc"
            },
            take: limit,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        TOP REFERRERS
    ========================== */
    static async getTopReferrers(limit = 10) {
        return prisma_1.prisma.leaderboard.findMany({
            orderBy: {
                totalLeads: "desc"
            },
            take: limit,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        TOP COMMISSION EARNERS
    ========================== */
    static async getTopCommissionEarners(limit = 10) {
        return prisma_1.prisma.leaderboard.findMany({
            orderBy: {
                totalCommission: "desc"
            },
            take: limit,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        TOP BUSINESS GENERATORS
    ========================== */
    static async getTopBusinessGenerators(limit = 10) {
        return prisma_1.prisma.leaderboard.findMany({
            orderBy: {
                totalBusiness: "desc"
            },
            take: limit,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        MONTHLY LEADERBOARD
    ========================== */
    static async getMonthlyLeaderboard(month, year) {
        return prisma_1.prisma.leaderboard.findMany({
            where: {
                month,
                year
            },
            orderBy: {
                score: "desc"
            },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        UPDATE SCORE
    ========================== */
    static async updateScore(id, score) {
        return prisma_1.prisma.leaderboard.update({
            where: {
                id
            },
            data: {
                score
            }
        });
    }
    /* ==========================
        UPDATE RANK
    ========================== */
    static async updateRank(id, rank) {
        return prisma_1.prisma.leaderboard.update({
            where: {
                id
            },
            data: {
                rank
            }
        });
    }
    /* ==========================
        DELETE ENTRY
    ========================== */
    static async deleteEntry(id) {
        return prisma_1.prisma.leaderboard.delete({
            where: {
                id
            }
        });
    }
    /* ==========================
        RECALCULATE RANKS
    ========================== */
    static async recalculateRanks() {
        const records = await prisma_1.prisma.leaderboard.findMany({
            orderBy: {
                score: "desc"
            }
        });
        const updates = records.map((item, index) => {
            return prisma_1.prisma.leaderboard.update({
                where: {
                    id: item.id
                },
                data: {
                    rank: index + 1
                }
            });
        });
        return prisma_1.prisma.$transaction(updates);
    }
    /* ==========================
        GET ALL LEADERBOARD
    ========================== */
    static async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.prisma.leaderboard.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    score: "desc"
                }
            }),
            prisma_1.prisma.leaderboard.count()
        ]);
        return {
            total,
            page,
            limit,
            records
        };
    }
    /* ==========================
        LEADERBOARD ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalEntries, totalBusiness, totalCommission, totalLeads] = await Promise.all([
            prisma_1.prisma.leaderboard.count(),
            prisma_1.prisma.leaderboard.aggregate({
                _sum: {
                    totalBusiness: true
                }
            }),
            prisma_1.prisma.leaderboard.aggregate({
                _sum: {
                    totalCommission: true
                }
            }),
            prisma_1.prisma.leaderboard.aggregate({
                _sum: {
                    totalLeads: true
                }
            })
        ]);
        return {
            totalEntries,
            totalBusiness: totalBusiness._sum.totalBusiness || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
            totalLeads: totalLeads._sum.totalLeads || 0
        };
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
