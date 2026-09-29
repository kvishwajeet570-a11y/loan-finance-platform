"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AdminService {
    async getDashboardStats() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: "APPROVED" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "REJECTED" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "PENDING" },
            }),
        ]);
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
        };
    }
    async getAllUsers() {
        return prisma_1.default.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getAllLoans() {
        return prisma_1.default.loanApplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getUserById(userId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                loans: true,
            },
        });
    }
    async blockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    async verifyUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            },
        });
    }
    async getLoanById(loanId) {
        return prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
            include: {
                user: true,
            },
        });
    }
    async approveLoan(loanId) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "APPROVED",
            },
        });
    }
    async rejectLoan(loanId) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "REJECTED",
            },
        });
    }
}
exports.default = new AdminService();
