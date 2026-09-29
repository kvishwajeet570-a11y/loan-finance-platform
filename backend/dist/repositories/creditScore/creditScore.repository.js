"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScoreHistoryRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CreditScoreHistoryRepository {
    /* ==========================
        CREATE SCORE RECORD
    ========================== */
    static async createScoreHistory(data) {
        return prisma_1.default.creditScoreHistory.create({
            data: {
                ...data,
                enquiryDate: data.enquiryDate || new Date()
            }
        });
    }
    /* ==========================
        GET BY ID
    ========================== */
    static async getById(id) {
        return prisma_1.default.creditScoreHistory.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true
                    }
                }
            }
        });
    }
    /* ==========================
        USER SCORE HISTORY
    ========================== */
    static async getUserScoreHistory(userId) {
        return prisma_1.default.creditScoreHistory.findMany({
            where: { userId },
            orderBy: {
                enquiryDate: "desc"
            }
        });
    }
    /* ==========================
        LATEST SCORE
    ========================== */
    static async getLatestScore(userId) {
        return prisma_1.default.creditScoreHistory.findFirst({
            where: { userId },
            orderBy: {
                enquiryDate: "desc"
            }
        });
    }
    /* ==========================
        SCORE TREND
    ========================== */
    static async getScoreTrend(userId) {
        return prisma_1.default.creditScoreHistory.findMany({
            where: { userId },
            orderBy: {
                enquiryDate: "asc"
            },
            select: {
                score: true,
                enquiryDate: true,
                bureauType: true
            }
        });
    }
    /* ==========================
        SCORE RANGE FILTER
    ========================== */
    static async getScoresByRange(min, max) {
        return prisma_1.default.creditScoreHistory.findMany({
            where: {
                score: {
                    gte: min,
                    lte: max
                }
            }
        });
    }
    /* ==========================
        BUREAU WISE SCORES
    ========================== */
    static async getBureauScores(bureauType) {
        return prisma_1.default.creditScoreHistory.findMany({
            where: {
                bureauType
            },
            orderBy: {
                enquiryDate: "desc"
            }
        });
    }
    /* ==========================
        UPDATE RECORD
    ========================== */
    static async updateRecord(id, data) {
        return prisma_1.default.creditScoreHistory.update({
            where: { id },
            data
        });
    }
    /* ==========================
        DELETE RECORD
    ========================== */
    static async deleteRecord(id) {
        return prisma_1.default.creditScoreHistory.delete({
            where: { id }
        });
    }
    /* ==========================
        ADMIN ALL RECORDS
    ========================== */
    static async getAllRecords(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.creditScoreHistory.findMany({
                skip,
                take: limit,
                orderBy: {
                    enquiryDate: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.default.creditScoreHistory.count()
        ]);
        return {
            total,
            page,
            limit,
            records
        };
    }
    /* ==========================
        CREDIT SCORE ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalRecords, avgScore, highestScore, lowestScore] = await Promise.all([
            prisma_1.default.creditScoreHistory.count(),
            prisma_1.default.creditScoreHistory.aggregate({
                _avg: {
                    score: true
                }
            }),
            prisma_1.default.creditScoreHistory.aggregate({
                _max: {
                    score: true
                }
            }),
            prisma_1.default.creditScoreHistory.aggregate({
                _min: {
                    score: true
                }
            })
        ]);
        return {
            totalRecords,
            averageScore: avgScore._avg.score || 0,
            highestScore: highestScore._max.score || 0,
            lowestScore: lowestScore._min.score || 0
        };
    }
    /* ==========================
        SCORE DISTRIBUTION
    ========================== */
    static async getScoreDistribution() {
        return {
            poor: await prisma_1.default.creditScoreHistory.count({
                where: {
                    score: {
                        lt: 600
                    }
                }
            }),
            fair: await prisma_1.default.creditScoreHistory.count({
                where: {
                    score: {
                        gte: 600,
                        lt: 700
                    }
                }
            }),
            good: await prisma_1.default.creditScoreHistory.count({
                where: {
                    score: {
                        gte: 700,
                        lt: 750
                    }
                }
            }),
            excellent: await prisma_1.default.creditScoreHistory.count({
                where: {
                    score: {
                        gte: 750
                    }
                }
            })
        };
    }
    /* ==========================
        TOP CREDIT USERS
    ========================== */
    static async getTopCreditUsers() {
        return prisma_1.default.creditScoreHistory.findMany({
            orderBy: {
                score: "desc"
            },
            take: 10,
            include: {
                user: true
            }
        });
    }
}
exports.CreditScoreHistoryRepository = CreditScoreHistoryRepository;
