"use strict";
// src/services/ai/ai.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma/prisma"));
class AIService {
    async getDashboardInsights() {
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
            approvalRate: `${approvalRate}%`,
            insights: [
                approvedLoans > rejectedLoans
                    ? "Loan approvals are performing well."
                    : "High rejection ratio detected.",
                pendingLoans > 20
                    ? "Large pending queue requires review."
                    : "Pending applications under control.",
            ],
        };
    }
    async getTopLoanTypes() {
        const loans = await prisma_1.default.loanApplication.groupBy({
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
        return loans;
    }
    async getRevenuePrediction() {
        const approvedLoans = await prisma_1.default.loanApplication.findMany({
            where: {
                status: client_1.LoanStatus.APPROVED,
            },
            select: {
                amount: true,
            },
        });
        const totalAmount = approvedLoans.reduce((sum, loan) => sum + Number(loan.amount), 0);
        const estimatedRevenue = totalAmount * 0.015;
        const nextMonthForecast = estimatedRevenue * 1.12;
        return {
            totalDisbursed: totalAmount,
            estimatedRevenue,
            nextMonthForecast,
        };
    }
}
exports.AIService = AIService;
exports.default = new AIService();
