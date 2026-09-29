"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AdminRepository {
    /* =========================
       DASHBOARD STATS
    ========================= */
    static async getDashboardStats() {
        const [totalUsers, totalLoans, totalApprovedLoans, totalRejectedLoans, totalPendingLoans, totalVerifiedUsers, totalBlockedUsers, totalDisbursedAmount,] = await Promise.all([
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
            prisma_1.default.user.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.loanApplication.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalUsers,
            totalLoans,
            totalApprovedLoans,
            totalRejectedLoans,
            totalPendingLoans,
            totalVerifiedUsers,
            totalBlockedUsers,
            totalDisbursedAmount: totalDisbursedAmount._sum.amount || 0,
        };
    }
    /* =========================
       USER MANAGEMENT
    ========================= */
    static async getUsers(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                        },
                    },
                    {
                        phoneNo: {
                            contains: search,
                        },
                    },
                ],
            }
            : undefined;
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /* =========================
       USER DETAILS
    ========================= */
    static async getUserById(userId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                loans: true,
            },
        });
    }
    /* =========================
       BLOCK USER
    ========================= */
    static async blockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    /* =========================
       UNBLOCK USER
    ========================= */
    static async unblockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    /* =========================
       VERIFY USER
    ========================= */
    static async verifyUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            },
        });
    }
    /* =========================
       RECENT LOANS
    ========================= */
    static async getRecentLoans(limit = 10) {
        return prisma_1.default.loanApplication.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                    },
                },
            },
        });
    }
    /* =========================
       LOAN DETAILS
    ========================= */
    static async getLoanById(loanId) {
        return prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
            include: {
                user: true,
            },
        });
    }
    /* =========================
       APPROVE LOAN
    ========================= */
    static async approveLoan(loanId) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "APPROVED",
            },
        });
    }
    /* =========================
       REJECT LOAN
    ========================= */
    static async rejectLoan(loanId) {
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
exports.AdminRepository = AdminRepository;
