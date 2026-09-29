"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LoanRepository {
    static async createLoan(data) {
        return prisma_1.default.loanApplication.create({ data });
    }
    static async getLoanById(id) {
        return prisma_1.default.loanApplication.findUnique({
            where: { id },
            include: { user: true }
        });
    }
    static async getUserLoans(userId) {
        return prisma_1.default.loanApplication.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getAllLoans(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [loans, total] = await Promise.all([
            prisma_1.default.loanApplication.findMany({
                skip,
                take: limit,
                include: { user: true },
                orderBy: { createdAt: "desc" }
            }),
            prisma_1.default.loanApplication.count()
        ]);
        return {
            total,
            page,
            limit,
            loans
        };
    }
    static async updateLoan(id, data) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data
        });
    }
    static async approveLoan(id) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data: {
                status: client_1.LoanStatus.APPROVED,
                rejectionReason: null
            }
        });
    }
    static async rejectLoan(id, reason) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data: {
                status: client_1.LoanStatus.REJECTED,
                rejectionReason: reason
            }
        });
    }
    static async disburseLoan(id) {
        return prisma_1.default.loanApplication.update({
            where: { id },
            data: {
                status: client_1.LoanStatus.APPROVED
            }
        });
    }
    static async deleteLoan(id) {
        return prisma_1.default.loanApplication.delete({
            where: { id }
        });
    }
    static async searchLoans(keyword) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                OR: [
                    {
                        fullName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        phone: {
                            contains: keyword
                        }
                    },
                    {
                        loanType: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: { user: true }
        });
    }
    static async getLoansByStatus(status) {
        return prisma_1.default.loanApplication.findMany({
            where: { status },
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getPendingLoans() {
        return prisma_1.default.loanApplication.findMany({
            where: {
                status: client_1.LoanStatus.PENDING
            },
            include: { user: true }
        });
    }
    static async getApprovedLoans() {
        return prisma_1.default.loanApplication.findMany({
            where: {
                status: client_1.LoanStatus.APPROVED
            },
            include: { user: true }
        });
    }
    static async getLoanAnalytics() {
        const [totalLoans, pendingLoans, approvedLoans, rejectedLoans, disbursedLoans, totalAmount] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.PENDING
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.APPROVED
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.REJECTED
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.APPROVED
                }
            }),
            prisma_1.default.loanApplication.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);
        return {
            totalLoans,
            pendingLoans,
            approvedLoans,
            rejectedLoans,
            disbursedLoans,
            totalAmount: totalAmount._sum.amount ?? 0
        };
    }
    static async getMonthlyReport(month, year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        return prisma_1.default.loanApplication.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lt: end
                }
            },
            include: {
                user: true
            }
        });
    }
}
exports.LoanRepository = LoanRepository;
