"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LoanService {
    async getAllLoans() {
        return prisma_1.default.loanApplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getLoanById(id) {
        return prisma_1.default.loanApplication.findUnique({
            where: { id },
        });
    }
    async approveLoan(id) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data: {
                status: "APPROVED",
            },
        });
    }
    async rejectLoan(id) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data: {
                status: "REJECTED",
            },
        });
    }
    async getLoanStats() {
        const [totalLoans, approvedLoans, rejectedLoans, pendingLoans,] = await Promise.all([
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
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
        };
    }
}
exports.default = new LoanService();
