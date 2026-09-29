"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class DashboardService {
    async getDashboardStats() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
        ]);
        const totalDisbursed = await prisma_1.default.loanApplication.aggregate({
            where: {
                status: "APPROVED",
            },
            _sum: {
                amount: true,
            },
        });
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
            totalDisbursed: Number(totalDisbursed?._sum?.amount ?? 0),
        };
    }
    async getRecentLoans(limit = 10) {
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
    async getRecentUsers(limit = 10) {
        return prisma_1.default.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                createdAt: true,
            },
        });
    }
}
exports.default = new DashboardService();
