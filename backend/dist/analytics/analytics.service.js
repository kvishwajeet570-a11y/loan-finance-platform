"use strict";
// src/services/analytics/analytics.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma/prisma"));
class AnalyticsService {
    async getDashboardAnalytics() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.APPROVED,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.REJECTED,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.PENDING,
                },
            }),
        ]);
        const approvalRate = totalLoans > 0
            ? ((approvedLoans / totalLoans) * 100).toFixed(2)
            : "0";
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
            approvalRate,
        };
    }
    async getLoanTypeAnalytics() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["loanType"],
            _count: {
                loanType: true,
            },
            orderBy: {
                _count: {
                    loanType: "desc",
                },
            },
        });
    }
    async getMonthlyLoanTrend() {
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
    async getRevenueAnalytics() {
        const approvedLoans = await prisma_1.default.loanApplication.findMany({
            where: {
                status: client_1.LoanStatus.APPROVED,
            },
            select: {
                amount: true,
            },
        });
        const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + Number(loan.amount), 0);
        const estimatedRevenue = totalDisbursed * 0.015;
        return {
            totalDisbursed,
            estimatedRevenue,
        };
    }
    async getRecentApplications() {
        return prisma_1.default.loanApplication.findMany({
            take: 10,
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
}
exports.default = new AnalyticsService();
