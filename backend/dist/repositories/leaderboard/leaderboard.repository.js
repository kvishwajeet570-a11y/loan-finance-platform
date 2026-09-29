"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LeaderboardRepository {
    /* ==========================
        CREATE ENTRY
    ========================== */
    static async createEntry(data) {
        return prisma_1.default.leaderboard.create({
            data: {
                userName: data.userName,
                totalPoints: data.totalPoints ?? 0,
                totalSales: data.totalSales ?? 0,
            },
        });
    }
    /* ==========================
        GET BY ID
    ========================== */
    static async getById(id) {
        return prisma_1.default.leaderboard.findUnique({
            where: { id },
        });
    }
    /* ==========================
        GET TOP USERS
    ========================== */
    static async getTopUsers(limit = 10) {
        return prisma_1.default.leaderboard.findMany({
            orderBy: {
                totalPoints: "desc",
            },
            take: limit,
        });
    }
    /* ==========================
        UPDATE POINTS
    ========================== */
    static async updatePoints(id, totalPoints) {
        return prisma_1.default.leaderboard.update({
            where: { id },
            data: {
                totalPoints,
            },
        });
    }
    /* ==========================
        UPDATE SALES
    ========================== */
    static async updateSales(id, totalSales) {
        return prisma_1.default.leaderboard.update({
            where: { id },
            data: {
                totalSales,
            },
        });
    }
    /* ==========================
        DELETE ENTRY
    ========================== */
    static async deleteEntry(id) {
        return prisma_1.default.leaderboard.delete({
            where: { id },
        });
    }
    /* ==========================
        GET ALL
    ========================== */
    static async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.leaderboard.findMany({
                skip,
                take: limit,
                orderBy: {
                    totalPoints: "desc",
                },
            }),
            prisma_1.default.leaderboard.count(),
        ]);
        return {
            total,
            page,
            limit,
            records,
        };
    }
    /* ==========================
        ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalEntries, totalPoints, totalSales,] = await Promise.all([
            prisma_1.default.leaderboard.count(),
            prisma_1.default.leaderboard.aggregate({
                _sum: {
                    totalPoints: true,
                },
            }),
            prisma_1.default.leaderboard.aggregate({
                _sum: {
                    totalSales: true,
                },
            }),
        ]);
        return {
            totalEntries,
            totalPoints: totalPoints._sum.totalPoints ?? 0,
            totalSales: totalSales._sum.totalSales ?? 0,
        };
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
exports.default = LeaderboardRepository;
