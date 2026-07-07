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
                where: { status: "approved" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "rejected" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "pending" },
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
}
exports.default = new AdminService();
