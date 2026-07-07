"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class LoanRepository {
    /* =========================
        CREATE LOAN
    ========================= */
    static async createLoan(data) {
        return prisma_1.prisma.loanApplication.create({
            data
        });
    }
    /* =========================
        GET LOAN BY ID
    ========================= */
    static async getLoanById(id) {
        return prisma_1.prisma.loanApplication.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* =========================
        GET USER LOANS
    ========================= */
    static async getUserLoans(userId) {
        return prisma_1.prisma.loanApplication.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET ALL LOANS
    ========================= */
    static async getAllLoans(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [loans, total] = await Promise.all([
            prisma_1.prisma.loanApplication.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.loanApplication.count()
        ]);
        return {
            total,
            page,
            limit,
            loans
        };
    }
    /* =========================
        UPDATE LOAN
    ========================= */
    static async updateLoan(id, data) {
        return prisma_1.prisma.loanApplication.update({
            where: {
                id
            },
            data
        });
    }
    /* =========================
        APPROVE LOAN
    ========================= */
    static async approveLoan(id) {
        return prisma_1.prisma.loanApplication.update({
            where: {
                id
            },
            data: {
                status: "APPROVED",
                rejectionReason: null
            }
        });
    }
    /* =========================
        REJECT LOAN
    ========================= */
    static async rejectLoan(id, reason) {
        return prisma_1.prisma.loanApplication.update({
            where: {
                id
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason
            }
        });
    }
    /* =========================
        DISBURSE LOAN
    ========================= */
    static async disburseLoan(id) {
        return prisma_1.prisma.loanApplication.update({
            where: {
                id
            },
            data: {
                status: "DISBURSED"
            }
        });
    }
    /* =========================
        DELETE LOAN
    ========================= */
    static async deleteLoan(id) {
        return prisma_1.prisma.loanApplication.delete({
            where: { id }
        });
    }
    /* =========================
        SEARCH LOANS
    ========================= */
    static async searchLoans(keyword) {
        return prisma_1.prisma.loanApplication.findMany({
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
            include: {
                user: true
            }
        });
    }
    /* =========================
        LOANS BY STATUS
    ========================= */
    static async getLoansByStatus(status) {
        return prisma_1.prisma.loanApplication.findMany({
            where: {
                status
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        PENDING LOANS
    ========================= */
    static async getPendingLoans() {
        return prisma_1.prisma.loanApplication.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        APPROVED LOANS
    ========================= */
    static async getApprovedLoans() {
        return prisma_1.prisma.loanApplication.findMany({
            where: {
                status: "APPROVED"
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        LOAN ANALYTICS
    ========================= */
    static async getLoanAnalytics() {
        const [totalLoans, pendingLoans, approvedLoans, rejectedLoans, disbursedLoans, totalAmount] = await Promise.all([
            prisma_1.prisma.loanApplication.count(),
            prisma_1.prisma.loanApplication.count({
                where: { status: "PENDING" }
            }),
            prisma_1.prisma.loanApplication.count({
                where: { status: "APPROVED" }
            }),
            prisma_1.prisma.loanApplication.count({
                where: { status: "REJECTED" }
            }),
            prisma_1.prisma.loanApplication.count({
                where: { status: "DISBURSED" }
            }),
            prisma_1.prisma.loanApplication.aggregate({
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
            totalAmount: totalAmount._sum.amount || 0
        };
    }
    /* =========================
        MONTHLY REPORT
    ========================= */
    static async getMonthlyReport(month, year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        return prisma_1.prisma.loanApplication.findMany({
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
