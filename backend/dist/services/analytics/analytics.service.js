"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AnalyticsService {
    async getDashboardAnalytics() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans, totalPartners, totalDSA,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: "approved" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "rejected" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "pending" },
            }),
            prisma_1.default.user.count({
                where: { role: "partner" },
            }),
            prisma_1.default.user.count({
                where: { role: "dsa" },
            }),
        ]);
        const disbursedAmount = await prisma_1.default.loanApplication.aggregate({
            where: {
                status: "approved",
            },
            _sum: {
                amount: true,
            },
        });
        const approvalRate = totalLoans > 0
            ? Number(((approvedLoans / totalLoans) *
                100).toFixed(2))
            : 0;
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
            totalPartners,
            totalDSA,
            approvalRate,
            totalDisbursed: Number(disbursedAmount._sum.amount) || 0,
        };
    }
    async getLoanTypeAnalytics() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["loanType"],
            _count: {
                loanType: true,
            },
        });
    }
    async getRecentApplications(limit = 10) {
        return prisma_1.default.loanApplication.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                fullName: true,
                loanType: true,
                amount: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async getMonthlyTrend() {
        return prisma_1.default.loanApplication.findMany({
            select: {
                amount: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
}
exports.default = new AnalyticsService();
